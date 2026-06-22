"""Web crawler task — uses Playwright to crawl and extract page data."""
import asyncio
import json
import re
from urllib.parse import urljoin, urlparse

from app.core.url_safety import UnsafeUrlError, assert_url_is_safe
from app.tasks.celery_app import celery_app


def crawl_website(scan_id: str, url: str, max_pages: int = 20) -> dict:
    """Synchronous wrapper for the async crawler."""
    from app.utils.async_helpers import run_async
    return run_async(_async_crawl(scan_id, url, max_pages))


async def _async_crawl(scan_id: str, url: str, max_pages: int) -> dict:
    """Crawl website with Playwright, extract scripts, APIs, DOM patterns."""
    from playwright.async_api import async_playwright

    url = assert_url_is_safe(url)
    base_domain = urlparse(url).netloc
    visited: set[str] = set()
    queue: list[str] = [url]
    pages_data: list[dict] = []
    network_requests: list[str] = []
    all_scripts: list[str] = []

    crawl_errors: list[dict] = []

    async with async_playwright() as p:
        browser = await p.chromium.launch(
            headless=True,
            args=["--no-sandbox", "--disable-setuid-sandbox", "--disable-dev-shm-usage"],
        )
        context = await browser.new_context(
            user_agent="Mozilla/5.0 (compatible; ReguScan/1.0; +https://reguscan.app/bot)",
            viewport={"width": 1280, "height": 800},
            ignore_https_errors=True,
        )

        async def block_unsafe_request(route, request):
            try:
                assert_url_is_safe(request.url)
            except UnsafeUrlError:
                await route.abort()
                return
            await route.continue_()

        await context.route("**/*", block_unsafe_request)

        # Intercept network requests to detect API calls
        def on_request(req):
            url_str = req.url
            if any(kw in url_str for kw in [
                "openai", "anthropic", "groq", "intercom", "drift", "zendesk",
                "tawk", "crisp", "chat", "api/chat", "completions", "embeddings",
                "face-api", "emotion", "biometric", "credit", "score", "hire",
                "recruit", "screening", "deepfake", "generate", "dalle", "midjourney",
            ]):
                network_requests.append(url_str)

        context.on("request", on_request)

        while queue and len(visited) < max_pages:
            current_url = queue.pop(0)
            if current_url in visited:
                continue
            visited.add(current_url)

            page = None
            try:
                current_url = assert_url_is_safe(current_url)
                page = await context.new_page()
                load_warning = None
                try:
                    await page.goto(current_url, wait_until="domcontentloaded", timeout=20000)
                    await page.wait_for_timeout(3000)
                except Exception as exc:
                    load_warning = f"{type(exc).__name__}: {str(exc)}"
                    crawl_errors.append({
                        "url": current_url,
                        "stage": "load",
                        "error": load_warning,
                    })

                final_url = assert_url_is_safe(page.url)

                # Extract page data even when late network activity or a timeout occurred.
                page_data = await _extract_page_data(page, final_url)
                if load_warning:
                    page_data["warning"] = load_warning
                pages_data.append(page_data)
                all_scripts.extend(page_data.get("script_urls", []))

                # Collect internal links for crawling
                links = await page.eval_on_selector_all(
                    "a[href]",
                    "elements => elements.map(e => e.href)"
                )
                for link in links:
                    try:
                        safe_link = assert_url_is_safe(link)
                    except UnsafeUrlError:
                        continue
                    parsed = urlparse(safe_link)
                    if parsed.netloc == base_domain and safe_link not in visited and safe_link not in queue:
                        queue.append(safe_link)

                await page.close()

            except Exception as e:
                # Non-fatal: log and continue
                crawl_errors.append({
                    "url": current_url,
                    "stage": "extract",
                    "error": f"{type(e).__name__}: {str(e)}",
                })
                pages_data.append({
                    "url": current_url,
                    "error": str(e),
                    "html": "",
                    "scripts": [],
                    "selectors": [],
                    "meta_tags": [],
                    "network_requests": [],
                    "screenshot_base64": None,
                })
                if page:
                    await page.close()

        await browser.close()

    pages_attempted = len(visited)
    pages_succeeded = len([p for p in pages_data if not p.get("error")])
    pages_failed = max(0, pages_attempted - pages_succeeded)

    return {
        "scan_id": scan_id,
        "base_url": url,
        "pages_crawled": pages_succeeded,
        "pages_attempted": pages_attempted,
        "pages_succeeded": pages_succeeded,
        "pages_failed": pages_failed,
        "crawl_errors": crawl_errors[:25],
        "crawl_confidence": _crawl_confidence(pages_attempted, pages_succeeded, pages_failed),
        "pages_data": pages_data,
        "all_network_requests": list(set(network_requests)),
        "all_script_urls": list(set(all_scripts)),
    }


def _crawl_confidence(pages_attempted: int, pages_succeeded: int, pages_failed: int) -> str:
    if pages_attempted == 0 or pages_succeeded == 0:
        return "low"
    if pages_failed > 0:
        return "medium"
    return "high"


async def _extract_page_data(page, url: str) -> dict:
    """Extract AI-relevant signals from a page."""
    # Collect script URLs
    script_urls = await page.eval_on_selector_all(
        "script[src]", "elements => elements.map(e => e.src)"
    )

    # Collect inline script content (first 500 chars each to avoid huge data)
    inline_scripts = await page.eval_on_selector_all(
        "script:not([src])",
        "elements => elements.map(e => e.textContent.substring(0, 500))"
    )

    # Meta tags
    meta_tags = await page.eval_on_selector_all(
        "meta",
        "elements => elements.map(e => ({name: e.name, content: e.content, property: e.getAttribute('property')}))"
    )

    # Chat widget selectors
    chat_selectors = await _detect_chat_selectors(page)

    # Take screenshot (base64, compressed)
    try:
        screenshot = await page.screenshot(type="jpeg", quality=40, full_page=False)
        import base64
        screenshot_b64 = base64.b64encode(screenshot).decode()
    except Exception:
        screenshot_b64 = None

    # Page HTML (truncated)
    html = await page.content()
    html_snippet = html[:8000]  # first 8KB only

    return {
        "url": url,
        "title": await page.title(),
        "html_snippet": html_snippet,
        "script_urls": script_urls,
        "inline_scripts": inline_scripts,
        "meta_tags": meta_tags,
        "chat_selectors": chat_selectors,
        "screenshot_base64": screenshot_b64,
    }


async def _detect_chat_selectors(page) -> list[str]:
    """Check for known chatbot/AI widget DOM selectors."""
    selectors = [
        "#intercom-container", "#intercom-frame",
        ".drift-conversation", "#drift-widget",
        "#web_widget", ".zopim",
        "#tawkchat-container", ".tawk-min-container",
        "#crisp-chatbox", "[data-id='crisp']",
        "[data-ai-chat]", ".chat-widget",
        "#hubspot-messages-iframe-container",
        ".fc-widget-normal",  # Freshchat
    ]
    found = []
    for sel in selectors:
        try:
            el = await page.query_selector(sel)
            if el:
                found.append(sel)
        except Exception:
            pass
    return found

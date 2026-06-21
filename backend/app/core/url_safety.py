"""URL normalization and SSRF safety checks for website scans."""
import ipaddress
import socket
from functools import lru_cache
from urllib.parse import urlparse, urlunparse


class UnsafeUrlError(ValueError):
    """Raised when a URL is unsafe to crawl."""


METADATA_IPS = {
    ipaddress.ip_address("169.254.169.254"),
    ipaddress.ip_address("fd00:ec2::254"),
}
CGNAT_RANGE = ipaddress.ip_network("100.64.0.0/10")


def normalize_website_url(raw_url: str) -> str:
    """Normalize user-entered URLs without performing DNS lookups."""
    url = raw_url.strip()
    if not url:
        raise UnsafeUrlError("URL is required")

    parsed = urlparse(url)
    if not parsed.scheme and "://" not in url:
        url = f"https://{url}"
        parsed = urlparse(url)

    if parsed.scheme not in {"http", "https"}:
        raise UnsafeUrlError("Only http and https URLs can be scanned")
    if not parsed.hostname:
        raise UnsafeUrlError("URL must include a hostname")
    if parsed.username or parsed.password:
        raise UnsafeUrlError("URLs with embedded credentials are not allowed")

    normalized = parsed._replace(fragment="", scheme=parsed.scheme.lower())
    return urlunparse(normalized).rstrip("/")


def assert_url_is_safe(raw_url: str) -> str:
    """Normalize a URL and reject hosts that resolve to internal addresses."""
    url = normalize_website_url(raw_url)
    parsed = urlparse(url)
    host = (parsed.hostname or "").strip("[]").rstrip(".").lower()

    if host in {"localhost", "localhost.localdomain"} or host.endswith((".localhost", ".local")):
        raise UnsafeUrlError("Localhost and local network hostnames cannot be scanned")

    try:
        ip = ipaddress.ip_address(host)
        _assert_ip_is_safe(ip)
        return url
    except ValueError:
        pass

    for ip in _resolve_host(host, parsed.port):
        _assert_ip_is_safe(ip)

    return url


def _assert_ip_is_safe(ip: ipaddress._BaseAddress) -> None:
    if ip in METADATA_IPS:
        raise UnsafeUrlError("Cloud metadata addresses cannot be scanned")
    if isinstance(ip, ipaddress.IPv4Address) and ip in CGNAT_RANGE:
        raise UnsafeUrlError("Shared private network addresses cannot be scanned")
    if (
        ip.is_private
        or ip.is_loopback
        or ip.is_link_local
        or ip.is_multicast
        or ip.is_reserved
        or ip.is_unspecified
    ):
        raise UnsafeUrlError("Private, local, and reserved addresses cannot be scanned")


@lru_cache(maxsize=2048)
def _resolve_host(host: str, port: int | None) -> tuple[ipaddress._BaseAddress, ...]:
    try:
        records = socket.getaddrinfo(host, port or 443, type=socket.SOCK_STREAM)
    except socket.gaierror as exc:
        raise UnsafeUrlError("Hostname could not be resolved") from exc

    addresses = {
        ipaddress.ip_address(record[4][0])
        for record in records
    }
    if not addresses:
        raise UnsafeUrlError("Hostname could not be resolved")
    return tuple(addresses)

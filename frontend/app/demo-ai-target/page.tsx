export const metadata = {
  title: "ReguScan Demo AI Target",
  description: "Stable public demo page with obvious AI detection signals for ReguScan.",
};

export default function DemoAiTargetPage() {
  return (
    <main className="min-h-screen bg-white px-6 py-12 text-slate-950">
      <script src="https://widget.intercom.io/widget/demo-ai" />
      <script src="https://bzrcdn.openai.com/sdk/oaiq.min.js" />

      <div className="mx-auto max-w-3xl space-y-8">
        <header>
          <p className="text-sm font-semibold uppercase tracking-normal text-slate-500">
            ReguScan controlled demo target
          </p>
          <h1 className="mt-3 text-4xl font-bold tracking-normal">
            Demo AI Hiring Assistant
          </h1>
          <p className="mt-4 text-lg leading-8 text-slate-700">
            This page intentionally contains AI chatbot, AI assistant, AI resume builder,
            AI recruiter, automated candidate ranking, AI-generated content, and automated
            decision system signals for scanner verification.
          </p>
        </header>

        <section data-ai-chat className="rounded-lg border border-slate-200 p-5">
          <h2 className="text-xl font-semibold">Customer AI Chatbot</h2>
          <p className="mt-2 text-slate-700">
            Our virtual assistant answers visitor questions and uses generative AI to draft
            suggested replies. The chatbot app is embedded on this page.
          </p>
        </section>

        <section data-resume-upload className="rounded-lg border border-slate-200 p-5">
          <h2 className="text-xl font-semibold">Recruitment AI Screening</h2>
          <p className="mt-2 text-slate-700">
            Candidates can upload a resume parser document. An AI screening workflow scores
            recruiter match, candidate ranking, and automated decision system signals.
          </p>
          <input className="mt-4" type="file" accept=".pdf,.doc,.docx" name="resume_upload" />
        </section>

        <section className="rounded-lg border border-slate-200 p-5">
          <h2 className="text-xl font-semibold">Disclosure Gap</h2>
          <p className="mt-2 text-slate-700">
            This demo target intentionally omits a clear user-facing AI transparency disclosure
            near the assistant and hiring workflow so ReguScan can produce compliance gaps.
          </p>
        </section>

        <div id="intercom-container" />
      </div>
    </main>
  );
}

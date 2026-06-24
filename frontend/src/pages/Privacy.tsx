export default function Privacy() {
  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-14">
      <h1 className="text-3xl font-bold text-gray-900">Privacy Policy</h1>
      <p className="text-gray-500 mt-2 text-sm">Last updated: June 2025</p>

      <div className="mt-8 space-y-6 text-sm text-gray-700 leading-relaxed">
        <section>
          <h2 className="font-semibold text-gray-900 mb-2">What data we collect</h2>
          <p>When you use PrintSupport, we may collect the following information:</p>
          <ul className="mt-2 space-y-1 list-disc list-inside text-gray-600">
            <li>Your name (required to start a chat session)</li>
            <li>Your email address (optional, only if you provide it)</li>
            <li>Your printer brand and a description of your issue</li>
            <li>The full transcript of your chat session with our agents</li>
            <li>Date, time, and duration of the support session</li>
          </ul>
        </section>

        <section>
          <h2 className="font-semibold text-gray-900 mb-2">How we use your data</h2>
          <ul className="mt-2 space-y-1 list-disc list-inside text-gray-600">
            <li>To provide live chat support and answer your printer questions</li>
            <li>To let agents review prior chat history if you return for follow-up</li>
            <li>To monitor support quality and improve our service internally</li>
          </ul>
          <p className="mt-3">
            We do not use your data for marketing purposes and we do not sell, rent, or share your
            personal information with third parties.
          </p>
        </section>

        <section>
          <h2 className="font-semibold text-gray-900 mb-2">Chat session token</h2>
          <p>
            We store a session token in your browser's local storage to let you resume an in-progress
            chat if you navigate away or reload the page. This token is only used to resume your support
            session — it is not used for tracking or advertising.
          </p>
        </section>

        <section>
          <h2 className="font-semibold text-gray-900 mb-2">Data retention</h2>
          <p>
            Chat transcripts and session records are retained for up to 12 months to support follow-up
            assistance and internal quality review. After this period, records are deleted.
          </p>
        </section>

        <section>
          <h2 className="font-semibold text-gray-900 mb-2">Your rights</h2>
          <p>
            You may request access to, correction of, or deletion of your personal data at any time.
            Since we don't require account creation, requests are handled by matching your name and
            any email address you provided during chat. To make a data request, start a chat session
            and inform the agent, or contact us through our diagnostic form.
          </p>
        </section>

        <section>
          <h2 className="font-semibold text-gray-900 mb-2">Cookies</h2>
          <p>
            We do not use advertising or tracking cookies. We use only functional session storage
            (local storage) necessary to operate the chat feature.
          </p>
        </section>

        <section>
          <h2 className="font-semibold text-gray-900 mb-2">Changes to this policy</h2>
          <p>
            We may update this policy periodically. Significant changes will be noted with a new
            "Last updated" date at the top of this page.
          </p>
        </section>
      </div>
    </div>
  )
}

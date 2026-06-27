export default function RefundPolicy() {
  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-14">
      <h1 className="text-3xl font-bold text-gray-900">Refund Policy</h1>
      <p className="text-gray-500 mt-2 text-sm">Last updated: June 2026</p>

      <div className="mt-8 space-y-6 text-sm text-gray-700 leading-relaxed">
        <section>
          <h2 className="font-semibold text-gray-900 mb-2">Overview</h2>
          <p>
            PrintSupport is an independent third-party printer support service. We aim to provide helpful,
            accurate assistance. This policy explains when and how refunds are provided.
          </p>
        </section>

        <section>
          <h2 className="font-semibold text-gray-900 mb-2">Eligibility for a refund</h2>
          <p>You may be eligible for a refund if:</p>
          <ul className="mt-2 space-y-1 list-disc list-inside text-gray-600">
            <li>A paid session was not delivered due to a technical failure on our end</li>
            <li>You were charged incorrectly or more than once for the same session</li>
            <li>You contact us within 7 days of the charge</li>
          </ul>
        </section>

        <section>
          <h2 className="font-semibold text-gray-900 mb-2">Non-refundable situations</h2>
          <p>Refunds are generally not provided if:</p>
          <ul className="mt-2 space-y-1 list-disc list-inside text-gray-600">
            <li>A technician provided assistance but the issue was not resolved due to hardware limitations</li>
            <li>You chose to end the chat session before a resolution was attempted</li>
            <li>The issue is related to physical printer damage, consumables, or manufacturer defects</li>
            <li>More than 7 days have passed since the charge</li>
          </ul>
        </section>

        <section>
          <h2 className="font-semibold text-gray-900 mb-2">How to request a refund</h2>
          <p>
            To request a refund, contact us at{' '}
            <a href="mailto:support@printsupport.online" className="text-primary-600 underline">
              support@printsupport.online
            </a>{' '}
            with the subject line "Refund Request" and include the date of the session, the name used
            during the chat, and a brief explanation of the issue.
          </p>
          <p className="mt-2">
            We will review your request and respond within 3 business days. Approved refunds are
            processed within 5–10 business days to the original payment method.
          </p>
        </section>

        <section>
          <h2 className="font-semibold text-gray-900 mb-2">Complaints</h2>
          <p>
            If you are dissatisfied with our service or the outcome of a refund request, you may
            escalate the matter by emailing{' '}
            <a href="mailto:support@printsupport.online" className="text-primary-600 underline">
              support@printsupport.online
            </a>{' '}
            with the subject line "Complaint." We aim to acknowledge complaints within 2 business days.
          </p>
        </section>

        <section>
          <h2 className="font-semibold text-gray-900 mb-2">Contact</h2>
          <p>
            For refund requests or billing questions, please visit our{' '}
            <a href="/contact" className="text-primary-600 underline">Contact page</a> or email{' '}
            <a href="mailto:support@printsupport.online" className="text-primary-600 underline">
              support@printsupport.online
            </a>.
          </p>
        </section>
      </div>
    </div>
  )
}

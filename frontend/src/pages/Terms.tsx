export default function Terms() {
  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-14">
      <h1 className="text-3xl font-bold text-gray-900">Terms of Service</h1>
      <p className="text-gray-500 mt-2 text-sm">Last updated: June 2026</p>

      <div className="mt-8 space-y-6 text-sm text-gray-700 leading-relaxed">
        <section>
          <h2 className="font-semibold text-gray-900 mb-2">1. About this service</h2>
          <p>
            PrintSupport ("we," "us," or "our") is an independent third-party technical support service
            that provides printer setup and troubleshooting assistance via live chat. We are not affiliated
            with, authorized by, or endorsed by any printer manufacturer including HP, Canon, Epson, Brother,
            Samsung, Xerox, Lexmark, or others.
          </p>
        </section>

        <section>
          <h2 className="font-semibold text-gray-900 mb-2">2. Nature of assistance</h2>
          <p>
            The guidance provided by our technicians is based on publicly available documentation and
            general technical knowledge. We do not guarantee that any specific issue will be resolved.
            Our assistance is advisory only. We do not remotely access your device and do not install
            software on your behalf.
          </p>
        </section>

        <section>
          <h2 className="font-semibold text-gray-900 mb-2">3. Pricing and payment</h2>
          <p>
            Service fees, if applicable, will be disclosed to you before any charge is processed.
            By proceeding with a paid session, you agree to the stated fee. All prices are in USD
            unless otherwise specified. Payment is processed securely via our payment provider.
          </p>
        </section>

        <section>
          <h2 className="font-semibold text-gray-900 mb-2">4. Refunds</h2>
          <p>
            Please see our <a href="/refund-policy" className="text-primary-600 underline">Refund Policy</a> for
            full details on refund eligibility, timelines, and how to request a refund.
          </p>
        </section>

        <section>
          <h2 className="font-semibold text-gray-900 mb-2">5. Limitation of liability</h2>
          <p>
            To the maximum extent permitted by applicable law, PrintSupport shall not be liable for any
            indirect, incidental, special, or consequential damages arising from use of our service,
            including any damage to your printer, computer, data, or network. Our total liability to you
            for any claim shall not exceed the amount you paid for the session in question.
          </p>
        </section>

        <section>
          <h2 className="font-semibold text-gray-900 mb-2">6. Acceptable use</h2>
          <p>
            You agree not to misuse our live chat system, including by submitting false information,
            harassing our technicians, or using the service for any purpose other than genuine printer
            support inquiries.
          </p>
        </section>

        <section>
          <h2 className="font-semibold text-gray-900 mb-2">7. Intellectual property</h2>
          <p>
            All content on this website is the property of PrintSupport or its licensors. Manufacturer
            names, logos, and product names referenced on this site are trademarks of their respective
            owners. Their use here does not imply any affiliation or endorsement.
          </p>
        </section>

        <section>
          <h2 className="font-semibold text-gray-900 mb-2">8. Privacy</h2>
          <p>
            Your use of this service is also governed by our{' '}
            <a href="/privacy" className="text-primary-600 underline">Privacy Policy</a>,
            which is incorporated into these Terms by reference.
          </p>
        </section>

        <section>
          <h2 className="font-semibold text-gray-900 mb-2">9. Changes to these terms</h2>
          <p>
            We may update these Terms from time to time. Continued use of the service after changes
            are posted constitutes acceptance of the updated Terms. Significant changes will be
            indicated by an updated date at the top of this page.
          </p>
        </section>

        <section>
          <h2 className="font-semibold text-gray-900 mb-2">10. Contact</h2>
          <p>
            For questions about these Terms, please contact us at{' '}
            <a href="mailto:support@printsupport.online" className="text-primary-600 underline">
              support@printsupport.online
            </a>
            {' '}or via our <a href="/contact" className="text-primary-600 underline">Contact page</a>.
          </p>
        </section>
      </div>
    </div>
  )
}

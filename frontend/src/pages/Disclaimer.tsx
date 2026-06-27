export default function Disclaimer() {
  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-14">
      <h1 className="text-3xl font-bold text-gray-900">Disclaimer</h1>
      <p className="text-gray-500 mt-2 text-sm">Last updated: June 2026</p>

      <div className="mt-8 space-y-6 text-sm text-gray-700 leading-relaxed">
        <section className="bg-amber-50 border border-amber-200 rounded-xl p-5">
          <h2 className="font-semibold text-amber-900 mb-2">Independent third-party service</h2>
          <p className="text-amber-800">
            PrintSupport is an <strong>independent, third-party technical support provider</strong>.
            We are not affiliated with, authorized by, endorsed by, or sponsored by HP Inc., Canon Inc.,
            Epson America Inc., Brother Industries Ltd., Samsung Electronics Co. Ltd., Xerox Holdings
            Corporation, Lexmark International Inc., or any other printer manufacturer. Any use of their
            names on this website is solely to identify printer brands our technicians can assist with,
            and does not imply any partnership or official relationship.
          </p>
        </section>

        <section>
          <h2 className="font-semibold text-gray-900 mb-2">No guarantee of results</h2>
          <p>
            The technical guidance provided through PrintSupport is based on publicly available
            information and general technical knowledge. We do not guarantee that any particular printer
            issue will be resolved through our assistance. Results may vary depending on the specific
            hardware, software, and network environment involved.
          </p>
        </section>

        <section>
          <h2 className="font-semibold text-gray-900 mb-2">Trademarks</h2>
          <p>
            All manufacturer names, model names, brand names, logos, and product names mentioned on
            this website are the trademarks or registered trademarks of their respective owners.
            PrintSupport makes no claim to these trademarks. References to these names are made solely
            for the purpose of identifying compatible printer hardware.
          </p>
        </section>

        <section>
          <h2 className="font-semibold text-gray-900 mb-2">Limitation of liability</h2>
          <p>
            PrintSupport is not responsible for any damage to hardware, software, or data that may
            occur as a result of following guidance provided during a support session. Our technicians
            do not remotely access your device. You are solely responsible for any actions taken on
            your equipment.
          </p>
        </section>

        <section>
          <h2 className="font-semibold text-gray-900 mb-2">Official manufacturer support</h2>
          <p>
            For warranty service, authorized repairs, or official manufacturer support, please contact
            the printer manufacturer directly through their official website. PrintSupport cannot
            process warranty claims or act as an authorized service center.
          </p>
        </section>

        <section>
          <h2 className="font-semibold text-gray-900 mb-2">Contact</h2>
          <p>
            Questions about this Disclaimer? Contact us at{' '}
            <a href="mailto:support@printsupport.online" className="text-primary-600 underline">
              support@printsupport.online
            </a>{' '}
            or visit our <a href="/contact" className="text-primary-600 underline">Contact page</a>.
          </p>
        </section>
      </div>
    </div>
  )
}

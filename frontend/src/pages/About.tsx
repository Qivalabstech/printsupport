import { Link } from 'react-router-dom'

export default function About() {
  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-14">
      <h1 className="text-3xl font-bold text-gray-900">About Us</h1>
      <p className="text-gray-500 mt-2">Who we are and what we do</p>

      <div className="mt-8 space-y-6 text-gray-700">
        <section>
          <h2 className="font-semibold text-gray-900 mb-2">What is PrintSupport?</h2>
          <p className="text-sm leading-relaxed">
            PrintSupport is an independent, third-party technical support service that helps home and small
            business users troubleshoot printer problems over live chat. We focus on common issues like
            connectivity problems, offline printers, stuck print queues, and driver issues.
          </p>
        </section>

        <section>
          <h2 className="font-semibold text-gray-900 mb-2">What we do</h2>
          <ul className="text-sm leading-relaxed space-y-1.5 list-disc list-inside text-gray-600">
            <li>Help you diagnose and troubleshoot printer problems over live chat</li>
            <li>Walk you through step-by-step fixes for common printer issues</li>
            <li>Provide guidance for all major printer brands</li>
            <li>Offer real, honest troubleshooting — not upselling or fake urgency</li>
          </ul>
        </section>

        <section>
          <h2 className="font-semibold text-gray-900 mb-2">What we don't do</h2>
          <ul className="text-sm leading-relaxed space-y-1.5 list-disc list-inside text-gray-600">
            <li>We do not provide phone support — chat only</li>
            <li>We cannot remotely access your computer (we don't offer remote access tools)</li>
            <li>We cannot issue refunds or replacements — we're not a manufacturer</li>
            <li>We do not sell printer supplies, parts, or warranties</li>
          </ul>
        </section>

        <section className="bg-amber-50 border border-amber-200 rounded-xl p-5">
          <h2 className="font-semibold text-amber-900 mb-2">Important: Independent service</h2>
          <p className="text-sm text-amber-800 leading-relaxed">
            PrintSupport is not affiliated with, authorized by, endorsed by, or sponsored by HP, Canon,
            Epson, Brother, Samsung, Lexmark, Xerox, or any other printer manufacturer. Any trade names
            or product names mentioned are the property of their respective owners and are used solely
            to describe the printers we can help you troubleshoot. Our guidance is based on publicly
            available documentation and general technical knowledge.
          </p>
        </section>

        <section>
          <h2 className="font-semibold text-gray-900 mb-2">Contact</h2>
          <p className="text-sm text-gray-600 leading-relaxed">
            For support, please use our{' '}
            <Link to="/diagnose" className="text-primary-600 underline">live chat diagnostic</Link>{' '}
            — it's the only support channel we offer. For data requests or privacy questions, see our{' '}
            <Link to="/privacy" className="text-primary-600 underline">Privacy Policy</Link>.
          </p>
        </section>
      </div>
    </div>
  )
}

import { MessageCircle, Mail, Clock } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function Contact() {
  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-14">
      <h1 className="text-3xl font-bold text-gray-900">Contact Us</h1>
      <p className="text-gray-500 mt-2 text-sm">How to reach PrintSupport</p>

      <div className="mt-8 space-y-6">
        <div className="bg-primary-50 border border-primary-100 rounded-xl p-5 flex gap-4">
          <div className="w-10 h-10 bg-primary-100 text-primary-600 rounded-lg flex items-center justify-center flex-shrink-0">
            <MessageCircle size={20} />
          </div>
          <div>
            <h2 className="font-semibold text-gray-900 text-sm mb-1">Live chat support</h2>
            <p className="text-sm text-gray-600 leading-relaxed">
              Our primary support channel is live chat. Start the diagnostic flow to connect with
              a technician — no phone call required.
            </p>
            <Link to="/diagnose" className="btn-primary mt-3 inline-block text-sm">
              Start chat
            </Link>
          </div>
        </div>

        <div className="border border-gray-200 rounded-xl p-5 flex gap-4">
          <div className="w-10 h-10 bg-gray-100 text-gray-600 rounded-lg flex items-center justify-center flex-shrink-0">
            <Mail size={20} />
          </div>
          <div>
            <h2 className="font-semibold text-gray-900 text-sm mb-1">Email</h2>
            <p className="text-sm text-gray-600 mb-1">
              For billing, data requests, or non-urgent queries:
            </p>
            <a href="mailto:support@printsupport.online" className="text-sm text-primary-600 hover:underline font-medium">
              support@printsupport.online
            </a>
          </div>
        </div>

        <div className="border border-gray-200 rounded-xl p-5 flex gap-4">
          <div className="w-10 h-10 bg-gray-100 text-gray-600 rounded-lg flex items-center justify-center flex-shrink-0">
            <Clock size={20} />
          </div>
          <div>
            <h2 className="font-semibold text-gray-900 text-sm mb-1">Support hours</h2>
            <div className="text-sm text-gray-600 space-y-0.5">
              <p>Monday – Friday: 9:00 AM – 8:00 PM EST</p>
              <p>Saturday: 10:00 AM – 6:00 PM EST</p>
              <p>Sunday: Closed</p>
            </div>
            <p className="text-xs text-gray-400 mt-2">
              Chat availability depends on agent availability during the above hours.
              Email responses are typically within 1–2 business days.
            </p>
          </div>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-xl p-5">
          <h2 className="font-semibold text-amber-900 text-sm mb-2">Important: Independent service</h2>
          <p className="text-sm text-amber-800 leading-relaxed">
            PrintSupport is an independent third-party technical support service. We are not affiliated with,
            authorized by, or endorsed by HP, Canon, Epson, Brother, Samsung, Xerox, Lexmark, or any other
            printer manufacturer. For manufacturer warranty or official support, please contact the manufacturer
            directly through their official website.
          </p>
        </div>

        <div className="text-sm text-gray-500 space-y-1">
          <p className="font-medium text-gray-700">Company information</p>
          <p>PrintSupport</p>
          <p>
            <a href="mailto:support@printsupport.online" className="text-primary-600 hover:underline">
              support@printsupport.online
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}

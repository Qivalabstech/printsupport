import { Link } from 'react-router-dom'
import { Printer, MessageCircle, ShieldCheck, Clock, AlertCircle } from 'lucide-react'

export default function Home() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-b from-primary-50 to-white border-b border-gray-100">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-20 text-center">
          <div className="inline-flex items-center gap-2 bg-white border border-primary-100 text-primary-600 text-xs font-medium px-3 py-1.5 rounded-full mb-6">
            <span className="w-2 h-2 bg-green-400 rounded-full inline-block"></span>
            Agents available now
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 leading-tight">
            Printer not working?<br />
            <span className="text-primary-600">We'll help you fix it.</span>
          </h1>
          <p className="mt-5 text-lg text-gray-500 max-w-xl mx-auto">
            Answer a few quick questions about your issue, then chat live with a support specialist — no phone hold times, no scripts, no runaround.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/diagnose" className="btn-primary text-base px-8 py-3">
              Start Activation
            </Link>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-16">
        <h2 className="text-xl font-semibold text-gray-800 text-center mb-10">How it works</h2>
        <div className="grid sm:grid-cols-3 gap-6">
          {[
            {
              icon: <Printer size={22} className="text-primary-600" />,
              title: 'Describe your issue',
              body: 'Tell us your printer brand and what\'s going wrong — takes about a minute.'
            },
            {
              icon: <ShieldCheck size={22} className="text-primary-600" />,
              title: 'Try a quick fix',
              body: 'We\'ll suggest a few targeted steps specific to your problem. Many issues are solved right here.'
            },
            {
              icon: <MessageCircle size={22} className="text-primary-600" />,
              title: 'Chat with a specialist',
              body: 'If the quick fix doesn\'t work, we connect you live with a support agent who already has your context.'
            }
          ].map((item) => (
            <div key={item.title} className="card flex gap-4">
              <div className="w-10 h-10 bg-primary-50 rounded-lg flex items-center justify-center flex-shrink-0">
                {item.icon}
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 text-sm">{item.title}</h3>
                <p className="text-sm text-gray-500 mt-1">{item.body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Trust / Transparency */}
      <section className="bg-gray-50 border-y border-gray-100">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 text-center">
          <div className="inline-flex items-center gap-2 text-amber-700 bg-amber-50 border border-amber-200 px-4 py-2 rounded-xl mb-6">
            <AlertCircle size={16} />
            <span className="text-sm font-medium">Important disclosure</span>
          </div>
          <h2 className="text-xl font-semibold text-gray-800">Independent support — not a manufacturer</h2>
          <p className="mt-3 text-gray-500 text-sm max-w-xl mx-auto">
            PrintSupport is an independent, third-party technical support service. We are not affiliated with,
            authorized by, or sponsored by HP, Canon, Epson, Brother, Samsung, or any other printer manufacturer.
            We provide general troubleshooting guidance based on publicly available information.
          </p>
        </div>
      </section>

      {/* Supported brands */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-14">
        <h2 className="text-xl font-semibold text-gray-800 text-center mb-8">We help with all major brands</h2>
        <div className="flex flex-wrap justify-center gap-3">
          {['HP', 'Canon', 'Epson', 'Brother', 'Samsung', 'Lexmark', 'Xerox', 'Other brands'].map(brand => (
            <span key={brand} className="bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium">
              {brand}
            </span>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-primary-600">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 text-center">
          <Clock size={28} className="text-primary-200 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white">Ready to fix your printer?</h2>
          <p className="text-primary-100 mt-2 text-sm">No account needed. Chat only — no phone calls.</p>
          <Link to="/diagnose" className="mt-6 inline-block bg-white text-primary-600 font-semibold px-8 py-3 rounded-lg hover:bg-primary-50 transition-colors text-base">
            Start Activation — Free
          </Link>
        </div>
      </section>
    </div>
  )
}

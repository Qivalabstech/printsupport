import { Link } from 'react-router-dom'
import { Printer, MessageCircle, ShieldCheck, Clock, AlertCircle, CheckCircle, Wifi, MonitorOff, FileX, Zap } from 'lucide-react'

export default function Home() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-b from-primary-50 to-white border-b border-gray-100">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-20 text-center">
          <div className="inline-flex items-center gap-2 bg-white border border-primary-100 text-primary-600 text-xs font-medium px-3 py-1.5 rounded-full mb-6">
            <span className="w-2 h-2 bg-green-400 rounded-full inline-block"></span>
            Support agents available now
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 leading-tight">
            Activate Your Printer Now<br />
            <span className="text-primary-600">Live Expert Support — Free</span>
          </h1>
          <p className="mt-5 text-lg text-gray-500 max-w-xl mx-auto">
            Instant printer activation and setup help for HP, Canon, Epson, Brother, and Samsung.
            Fix driver errors, WiFi issues, and offline printers — via live chat in minutes.
          </p>
          <div className="mt-8">
            <Link to="/diagnose" className="btn-primary text-base px-10 py-3.5">
              Activate Your Printer Now
            </Link>
            <p className="text-xs text-gray-400 mt-3">No account needed · Chat only · Takes under 2 minutes</p>
          </div>
        </div>
      </section>

      {/* Issue quick-links */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
        <h2 className="text-xl font-semibold text-gray-800 text-center mb-8">
          What printer problem are you facing?
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {[
            { icon: <Wifi size={18} />, label: 'Printer not connecting to WiFi', desc: 'Wireless setup & network activation' },
            { icon: <MonitorOff size={18} />, label: 'Printer showing offline', desc: 'Restore online status instantly' },
            { icon: <FileX size={18} />, label: 'Print jobs stuck in queue', desc: 'Clear stuck jobs & reset spooler' },
            { icon: <Zap size={18} />, label: 'Driver installation failed', desc: 'Fix Error 303 & driver errors' },
            { icon: <Printer size={18} />, label: 'Poor print quality', desc: 'Fix streaks, fading & misalignment' },
            { icon: <ShieldCheck size={18} />, label: 'Printer activation support', desc: 'Complete setup & registration' },
          ].map(item => (
            <Link
              to="/diagnose"
              key={item.label}
              className="flex items-start gap-3 border border-gray-200 rounded-xl p-4 hover:border-primary-400 hover:bg-primary-50 transition-all group"
            >
              <div className="w-8 h-8 bg-primary-100 text-primary-600 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-primary-200 transition-colors">
                {item.icon}
              </div>
              <div>
                <div className="text-sm font-semibold text-gray-800 group-hover:text-primary-700">{item.label}</div>
                <div className="text-xs text-gray-500 mt-0.5">{item.desc}</div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="bg-gray-50 border-y border-gray-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-14">
          <h2 className="text-xl font-semibold text-gray-800 text-center mb-10">
            How printer activation works
          </h2>
          <div className="grid sm:grid-cols-3 gap-6">
            {[
              {
                icon: <Printer size={22} className="text-primary-600" />,
                title: 'Tell us your printer details',
                body: 'Select your printer brand and enter your serial number — takes less than a minute.'
              },
              {
                icon: <ShieldCheck size={22} className="text-primary-600" />,
                title: 'Select your issue',
                body: 'Pick the problem you\'re facing — driver error, WiFi, offline, print quality, or activation.'
              },
              {
                icon: <MessageCircle size={22} className="text-primary-600" />,
                title: 'Chat with an activation specialist',
                body: 'A live agent takes over with your full context ready — no repeating yourself, no hold time.'
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
        </div>
      </section>

      {/* Supported brands */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-14">
        <h2 className="text-xl font-semibold text-gray-800 text-center mb-3">
          Printer activation support for all major brands
        </h2>
        <p className="text-center text-sm text-gray-500 mb-8">
          We support setup, driver installation, and activation for every major printer manufacturer.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          {[
            { name: 'HP', detail: 'DeskJet, LaserJet, OfficeJet, ENVY' },
            { name: 'Canon', detail: 'PIXMA, imageCLASS, MAXIFY' },
            { name: 'Epson', detail: 'EcoTank, WorkForce, Expression' },
            { name: 'Brother', detail: 'MFC, HL, DCP Series' },
            { name: 'Samsung', detail: 'Xpress, MultiXpress' },
            { name: 'Lexmark', detail: 'All series' },
            { name: 'Xerox', detail: 'All series' },
            { name: 'Other brands', detail: 'All makes & models' },
          ].map(brand => (
            <div key={brand.name} className="bg-white border border-gray-200 rounded-xl px-4 py-3 text-center min-w-[130px]">
              <div className="font-semibold text-gray-800 text-sm">{brand.name}</div>
              <div className="text-xs text-gray-400 mt-0.5">{brand.detail}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Why us */}
      <section className="bg-primary-50 border-y border-primary-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-14">
          <h2 className="text-xl font-semibold text-gray-800 text-center mb-10">
            Why choose PrintSupport for printer activation?
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { icon: <Zap size={20} />, title: 'Instant live chat', body: 'No waiting on hold. Connect to a real agent in seconds.' },
              { icon: <CheckCircle size={20} />, title: 'Step-by-step guidance', body: 'Agents walk you through every step of the activation process.' },
              { icon: <ShieldCheck size={20} />, title: 'All printer brands', body: 'HP, Canon, Epson, Brother, Samsung and more.' },
              { icon: <Clock size={20} />, title: 'Fast resolution', body: 'Most printer activation issues resolved in under 15 minutes.' },
            ].map(item => (
              <div key={item.title} className="bg-white rounded-xl p-5 border border-primary-100">
                <div className="w-9 h-9 bg-primary-100 text-primary-600 rounded-lg flex items-center justify-center mb-3">
                  {item.icon}
                </div>
                <h3 className="font-semibold text-gray-800 text-sm mb-1">{item.title}</h3>
                <p className="text-xs text-gray-500">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ — keyword rich, helps Google featured snippets */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 py-14">
        <h2 className="text-xl font-semibold text-gray-800 text-center mb-8">
          Frequently asked printer activation questions
        </h2>
        <div className="space-y-4">
          {[
            {
              q: 'How do I activate my HP printer?',
              a: 'Connect your HP printer to WiFi using the wireless setup menu on the printer's control panel. Download and install the HP driver from 123.hp.com or HP's official site. Run the setup wizard to complete activation. If the setup fails with an error code, our live chat agents can resolve it immediately.'
            },
            {
              q: 'Why does my printer say "offline" and how do I fix it?',
              a: 'A printer showing offline usually means the connection between your computer and printer was lost. On Windows, open Devices and Printers, right-click your printer, and make sure "Use Printer Offline" is unchecked. You can also try deleting and re-adding the printer. Our agents fix offline printer errors in minutes.'
            },
            {
              q: 'My printer driver installation failed — what should I do?',
              a: 'Driver installation failures (including Error 303) are often caused by incomplete downloads, firewall blocks, or conflicting software. Uninstall the existing driver, restart your computer, then reinstall the latest driver. Our specialists can walk you through this step by step over live chat.'
            },
            {
              q: 'How do I connect my Canon/Epson/Brother printer to WiFi?',
              a: 'On most printers, go to Settings > Network > Wireless Setup Wizard and select your WiFi network. Enter your WiFi password when prompted. If your printer still won\'t connect, restart both the printer and router. Our agents can guide you through brand-specific WiFi activation for Canon, Epson, Brother, and all other brands.'
            },
            {
              q: 'Is this an official HP / Canon / Epson support service?',
              a: 'No. PrintSupport is an independent, third-party technical support service. We are not affiliated with or authorized by HP, Canon, Epson, Brother, Samsung, or any other printer manufacturer. We provide general printer activation and troubleshooting guidance.'
            }
          ].map(({ q, a }) => (
            <details key={q} className="group border border-gray-200 rounded-xl overflow-hidden">
              <summary className="flex items-center justify-between px-5 py-4 cursor-pointer font-medium text-gray-800 text-sm hover:bg-gray-50 transition-colors list-none">
                {q}
                <span className="text-gray-400 ml-3 flex-shrink-0 group-open:rotate-180 transition-transform">▾</span>
              </summary>
              <div className="px-5 pb-4 text-sm text-gray-600 leading-relaxed border-t border-gray-100 pt-3">
                {a}
              </div>
            </details>
          ))}
        </div>
      </section>

      {/* Trust / Transparency */}
      <section className="bg-gray-50 border-t border-gray-100">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 text-center">
          <div className="inline-flex items-center gap-2 text-amber-700 bg-amber-50 border border-amber-200 px-4 py-2 rounded-xl mb-4">
            <AlertCircle size={16} />
            <span className="text-sm font-medium">Important disclosure</span>
          </div>
          <p className="text-gray-500 text-sm max-w-xl mx-auto">
            PrintSupport is an independent, third-party support service. We are not affiliated with,
            authorized by, or sponsored by HP, Canon, Epson, Brother, Samsung, or any printer manufacturer.
          </p>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="bg-primary-600">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-14 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white">
            Ready to activate your printer?
          </h2>
          <p className="text-primary-100 mt-2 text-sm">
            Live chat support · All brands · Free · No phone calls
          </p>
          <Link
            to="/diagnose"
            className="mt-7 inline-block bg-white text-primary-600 font-semibold px-10 py-3.5 rounded-lg hover:bg-primary-50 transition-colors text-base"
          >
            Activate Your Printer Now — Free
          </Link>
        </div>
      </section>
    </div>
  )
}

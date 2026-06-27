import { Link } from 'react-router-dom'
import { Printer, MessageCircle, ShieldCheck, Clock, AlertCircle, CheckCircle, Wifi, MonitorOff, FileX, Zap, Info } from 'lucide-react'

export default function Home() {
  return (
    <div>
      {/* Independence disclosure — above the fold */}
      <div className="bg-amber-50 border-b border-amber-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3 flex items-start gap-2">
          <Info size={16} className="text-amber-700 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-amber-800 leading-relaxed">
            <strong>Independent service:</strong> PrintSupport is not affiliated with, endorsed by, or authorized by HP, Canon, Brother, Epson, Samsung, Xerox, Lexmark, or any other printer manufacturer. We are an independent third-party technical support provider.
          </p>
        </div>
      </div>

      {/* Hero */}
      <section className="bg-gradient-to-b from-primary-50 to-white border-b border-gray-100">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-20 text-center">
          <div className="inline-flex items-center gap-2 bg-white border border-primary-100 text-primary-600 text-xs font-medium px-3 py-1.5 rounded-full mb-6">
            <span className="w-2 h-2 bg-green-400 rounded-full inline-block"></span>
            Support technicians available
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 leading-tight">
            Printer Not Working?<br />
            <span className="text-primary-600">Get Independent Setup Help</span>
          </h1>
          <p className="mt-5 text-lg text-gray-500 max-w-xl mx-auto">
            Need assistance setting up your printer? Our technicians provide independent printer
            installation and configuration assistance via live chat — no phone calls required.
          </p>
          <div className="mt-8">
            <Link to="/diagnose" className="btn-primary text-base px-10 py-3.5">
              Get Setup Assistance
            </Link>
            <p className="text-xs text-gray-400 mt-3">No account needed · Live chat only · Independent third-party service</p>
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
            { icon: <Wifi size={18} />, label: 'Printer not connecting to WiFi', desc: 'Wireless configuration assistance' },
            { icon: <MonitorOff size={18} />, label: 'Printer showing offline', desc: 'Restore online status guidance' },
            { icon: <FileX size={18} />, label: 'Print jobs stuck in queue', desc: 'Clear stuck jobs and reset spooler' },
            { icon: <Zap size={18} />, label: 'Driver installation failed', desc: 'Driver setup troubleshooting' },
            { icon: <Printer size={18} />, label: 'Poor print quality', desc: 'Fix streaks, fading and misalignment' },
            { icon: <ShieldCheck size={18} />, label: 'General setup assistance', desc: 'Complete configuration support' },
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
            How our printer support works
          </h2>
          <div className="grid sm:grid-cols-3 gap-6">
            {[
              {
                icon: <Printer size={22} className="text-primary-600" />,
                title: 'Tell us about your printer',
                body: 'Select your printer brand and describe the issue you are experiencing — takes less than a minute.'
              },
              {
                icon: <ShieldCheck size={22} className="text-primary-600" />,
                title: 'Select your issue',
                body: 'Pick the problem you are facing — driver error, WiFi connection, offline status, or print quality.'
              },
              {
                icon: <MessageCircle size={22} className="text-primary-600" />,
                title: 'Chat with a support technician',
                body: 'A live technician assists you with your full context ready — no repeating yourself, no hold time.'
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
          Compatible printer brands we can help configure
        </h2>
        <p className="text-center text-sm text-gray-500 mb-2">
          We provide independent setup and troubleshooting guidance for printers from most major manufacturers.
        </p>
        <p className="text-center text-xs text-gray-400 mb-8">
          PrintSupport is not affiliated with or authorized by any of the brands listed below.
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
            { name: 'Other brands', detail: 'All makes and models' },
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
            Why use PrintSupport?
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { icon: <Zap size={20} />, title: 'Live chat assistance', body: 'Connect to a real technician — no phone calls, no hold music.' },
              { icon: <CheckCircle size={20} />, title: 'Step-by-step guidance', body: 'Technicians walk you through every step of the configuration process.' },
              { icon: <ShieldCheck size={20} />, title: 'All printer brands', body: 'Independent support for most major printer manufacturers.' },
              { icon: <Clock size={20} />, title: 'Quick resolution', body: 'Many printer setup issues can be resolved in a single chat session.' },
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

      {/* FAQ */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 py-14">
        <h2 className="text-xl font-semibold text-gray-800 text-center mb-8">
          Frequently asked questions
        </h2>
        <div className="space-y-4">
          {[
            {
              q: `Is PrintSupport an official manufacturer support service?`,
              a: `No. PrintSupport is an independent, third-party technical support service. We are not affiliated with, authorized by, or endorsed by HP, Canon, Epson, Brother, Samsung, or any other printer manufacturer. Brand names are referenced only to describe the printers we can provide general guidance for.`
            },
            {
              q: `Why does my printer say offline and how do I fix it?`,
              a: `A printer showing offline usually means the connection between your computer and printer was lost. On Windows, open Devices and Printers, right-click your printer, and confirm that Use Printer Offline is not checked. You may also try removing and re-adding the printer. Our technicians can help diagnose this via live chat.`
            },
            {
              q: `My printer driver installation failed — what should I do?`,
              a: `Driver installation failures are often caused by incomplete downloads, firewall blocks, or conflicting software. Uninstall the existing driver, restart your computer, then reinstall the latest driver from the manufacturer's official website. Our technicians can walk you through this process over live chat.`
            },
            {
              q: `How do I connect my printer to WiFi?`,
              a: `On most printers, go to Settings, then Network, then Wireless Setup and select your WiFi network. Enter your WiFi password when prompted. If your printer still will not connect, restart both the printer and router. Our technicians can provide brand-specific configuration guidance via live chat.`
            },
            {
              q: `What does PrintSupport charge for its service?`,
              a: `Please review our Terms of Service for current pricing details. Our support is provided via live chat. For questions about billing or refunds, please see our Refund Policy or contact us on the Contact page.`
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
          <p className="text-gray-600 text-sm max-w-xl mx-auto">
            We are an independent third-party technical support provider and are not affiliated with,
            endorsed by, sponsored by, or authorized by any printer manufacturer including HP, Canon,
            Brother, Epson, Samsung, Xerox, Lexmark or others. Any manufacturer names or product names
            mentioned are trademarks of their respective owners, used only to indicate compatibility.
          </p>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="bg-primary-600">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-14 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white">
            Need help with your printer?
          </h2>
          <p className="text-primary-100 mt-2 text-sm">
            Independent live chat assistance · All brands · No phone calls
          </p>
          <Link
            to="/diagnose"
            className="mt-7 inline-block bg-white text-primary-600 font-semibold px-10 py-3.5 rounded-lg hover:bg-primary-50 transition-colors text-base"
          >
            Get Setup Assistance
          </Link>
        </div>
      </section>
    </div>
  )
}

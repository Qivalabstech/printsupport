import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronRight, ArrowLeft, Hash, MessageCircle, Printer } from 'lucide-react'
import { useChat } from '../contexts/ChatContext'

const BRANDS = ['HP', 'Canon', 'Epson', 'Brother', 'Samsung', 'Other']

const CATEGORIES = [
  'Printer not connecting to WiFi',
  'Printer shows offline',
  'Print jobs stuck in queue',
  'Driver/installation issue',
  'Poor print quality',
  'Other / not sure'
]

type Step = 1 | 2 | 3 | 4

export default function Diagnose() {
  const [step, setStep] = useState<Step>(1)
  const [brand, setBrand] = useState('')
  const [serialNumber, setSerialNumber] = useState('')
  const [category, setCategory] = useState('')
  const { startDiagnosticChat } = useChat()
  const navigate = useNavigate()

  const handleBrandSelect = (b: string) => {
    setBrand(b)
    setStep(2)
  }

  const handleSerialNext = () => setStep(3)

  const handleCategorySelect = (c: string) => {
    setCategory(c)
    setStep(4)
  }

  const handleStartChat = () => {
    const description = [
      serialNumber.trim() ? `Serial number: ${serialNumber.trim()}` : '',
      `Issue: ${category}`
    ].filter(Boolean).join('\n')

    startDiagnosticChat({ brand, issueCategory: category, description })
    navigate('/')
  }

  const goBack = () => {
    if (step === 2) setStep(1)
    else if (step === 3) setStep(2)
    else if (step === 4) setStep(3)
  }

  return (
    <div className="max-w-lg mx-auto px-4 sm:px-6 py-12">
      {/* Progress bar */}
      <div className="flex items-center gap-1.5 mb-8">
        {[1, 2, 3, 4].map((s) => (
          <div
            key={s}
            className={`h-1.5 flex-1 rounded-full transition-colors ${
              s <= step ? 'bg-primary-600' : 'bg-gray-200'
            }`}
          />
        ))}
      </div>

      {/* Step 1: Brand */}
      {step === 1 && (
        <div>
          <h1 className="text-2xl font-bold text-gray-900">What brand is your printer?</h1>
          <p className="text-gray-500 text-sm mt-1 mb-6">Select the manufacturer of your printer.</p>
          <div className="grid grid-cols-2 gap-3">
            {BRANDS.map((b) => (
              <button
                key={b}
                onClick={() => handleBrandSelect(b)}
                className="border border-gray-200 rounded-xl px-4 py-4 text-left font-medium text-gray-700 hover:border-primary-400 hover:bg-primary-50 hover:text-primary-700 transition-all focus:outline-none focus:ring-2 focus:ring-primary-600"
              >
                {b}
                <ChevronRight size={16} className="float-right mt-0.5 text-gray-400" />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step 2: Serial number */}
      {step === 2 && (
        <div>
          <button onClick={goBack} className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-5">
            <ArrowLeft size={14} /> Back
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Enter your serial number</h1>
          <p className="text-gray-500 text-sm mt-1 mb-6">
            Found on a sticker on the back or bottom of your <strong>{brand}</strong> printer.
            This helps our agents look up model-specific fixes.
          </p>

          <div className="relative">
            <Hash size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              className="input pl-9 font-mono tracking-wider uppercase"
              value={serialNumber}
              onChange={e => setSerialNumber(e.target.value.toUpperCase())}
              placeholder="e.g. CN123ABC45"
              autoFocus
              maxLength={30}
            />
          </div>

          <div className="mt-6">
            <button onClick={handleSerialNext} className="btn-primary w-full text-sm">
              Continue
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Issue category */}
      {step === 3 && (
        <div>
          <button onClick={goBack} className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-5">
            <ArrowLeft size={14} /> Back
          </button>
          <h1 className="text-2xl font-bold text-gray-900">What's the issue?</h1>
          <p className="text-gray-500 text-sm mt-1 mb-6">
            Select the category that best describes your problem with the <strong>{brand}</strong> printer.
          </p>
          <div className="space-y-2">
            {CATEGORIES.map((c) => (
              <button
                key={c}
                onClick={() => handleCategorySelect(c)}
                className="w-full border border-gray-200 rounded-xl px-4 py-3.5 text-left text-sm font-medium text-gray-700 hover:border-primary-400 hover:bg-primary-50 hover:text-primary-700 transition-all focus:outline-none focus:ring-2 focus:ring-primary-600"
              >
                {c}
                <ChevronRight size={16} className="float-right mt-0.5 text-gray-400" />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step 4: Chat prompt */}
      {step === 4 && (
        <div>
          <button onClick={goBack} className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-5">
            <ArrowLeft size={14} /> Back
          </button>

          <div className="text-center py-4">
            <div className="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center mx-auto mb-5">
              <Printer size={32} className="text-primary-600" />
            </div>

            <h1 className="text-2xl font-bold text-gray-900">
              Chat with a support agent
            </h1>
            <p className="text-gray-500 text-sm mt-2 mb-8 max-w-sm mx-auto">
              To get your <strong>{brand}</strong> printer activation completed, one of our support
              specialists will assist you over live chat. They'll have your details ready.
            </p>

            <div className="bg-primary-50 border border-primary-100 rounded-xl p-4 mb-8 text-left space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Brand</span>
                <span className="font-medium text-gray-800">{brand}</span>
              </div>
              {serialNumber && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Serial number</span>
                  <span className="font-mono font-medium text-gray-800">{serialNumber}</span>
                </div>
              )}
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Issue</span>
                <span className="font-medium text-gray-800 text-right max-w-[60%]">{category}</span>
              </div>
            </div>

            <button
              onClick={handleStartChat}
              className="btn-primary w-full py-3.5 text-base flex items-center justify-center gap-2"
            >
              <MessageCircle size={18} />
              Chat with a support agent now
            </button>

            <p className="text-xs text-gray-400 mt-4">
              Free · No phone calls · Live chat only
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

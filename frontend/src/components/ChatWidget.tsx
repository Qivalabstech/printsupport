import { useState, useRef, useEffect, FormEvent } from 'react'
import { MessageCircle, X, Send, Loader2 } from 'lucide-react'
import { useChat } from '../contexts/ChatContext'

export default function ChatWidget() {
  const {
    isOpen, openWidget, closeWidget,
    status, messages, queuePosition, agentName, typingIndicator,
    pendingDiagnostic, submitVisitorInfo, sendMessage, sendTypingStart, sendTypingStop
  } = useChat()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [input, setInput] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const typingTimeout = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (isOpen) messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isOpen])

  const handleInfoSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!name.trim()) { setError('Please enter your name.'); return }
    setError('')
    setSubmitting(true)
    try {
      await submitVisitorInfo(name.trim(), email.trim())
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleSend = (e: FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return
    sendMessage(input)
    setInput('')
    sendTypingStop()
  }

  const handleInputChange = (val: string) => {
    setInput(val)
    sendTypingStart()
    if (typingTimeout.current) clearTimeout(typingTimeout.current)
    typingTimeout.current = setTimeout(() => sendTypingStop(), 2000)
  }

  const bubbleLabel =
    status === 'queued' ? `In queue #${queuePosition ?? '...'}` :
    status === 'active' ? 'Live chat' :
    status === 'connecting' ? 'Connecting...' :
    'Chat with us'

  return (
    <>
      {/* Floating bubble */}
      <button
        onClick={() => isOpen ? closeWidget() : openWidget()}
        className="fixed bottom-5 right-5 z-50 flex items-center gap-2 bg-primary-600 text-white rounded-full shadow-lg hover:bg-primary-700 transition-all focus:outline-none focus:ring-2 focus:ring-primary-600 focus:ring-offset-2"
        style={{ padding: isOpen ? '10px' : '12px 18px' }}
        aria-label="Chat support"
      >
        {isOpen ? <X size={20} /> : (
          <>
            <MessageCircle size={20} />
            <span className="text-sm font-medium">{bubbleLabel}</span>
          </>
        )}
      </button>

      {/* Chat panel */}
      {isOpen && (
        <div className="fixed bottom-20 right-5 z-50 w-80 sm:w-96 flex flex-col bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden"
          style={{ height: '520px' }}>

          {/* Header */}
          <div className="bg-primary-600 text-white px-4 py-3 flex-shrink-0">
            <div className="font-semibold text-sm">PrintSupport Live Chat</div>
            <div className="text-xs text-primary-100 mt-0.5">
              {status === 'idle' && 'Independent printer troubleshooting'}
              {status === 'name-form' && 'Tell us a bit about yourself'}
              {status === 'connecting' && 'Creating your support session...'}
              {status === 'queued' && `You're #${queuePosition ?? '...'} in queue`}
              {status === 'active' && agentName ? `Connected with ${agentName}` : status === 'active' ? 'Connected with an agent' : ''}
              {status === 'closed' && 'Chat session ended'}
            </div>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">

            {/* Idle state — manual open */}
            {status === 'idle' && (
              <div className="text-center py-8">
                <MessageCircle size={40} className="mx-auto text-primary-300 mb-3" />
                <p className="text-sm text-gray-600">
                  Run our diagnostic first to connect with a support agent.
                </p>
                <a href="/diagnose" className="btn-primary mt-4 inline-block text-sm">
                  Get Setup Help
                </a>
              </div>
            )}

            {/* Name/email form */}
            {status === 'name-form' && (
              <form onSubmit={handleInfoSubmit} className="space-y-4 py-2">
                <div>
                  <p className="text-sm text-gray-600 mb-4">
                    You're being connected to a support agent for your{' '}
                    <strong>{pendingDiagnostic?.brand}</strong> printer issue.
                    Please tell us your name to start the chat.
                  </p>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Your name *</label>
                  <input
                    className="input"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="First name"
                    autoFocus
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Email <span className="text-gray-400 font-normal">(optional — for follow-up)</span>
                  </label>
                  <input
                    className="input"
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="you@example.com"
                  />
                </div>
                {error && <p className="text-xs text-red-600">{error}</p>}
                <button type="submit" disabled={submitting} className="btn-primary w-full">
                  {submitting ? <Loader2 size={16} className="animate-spin mx-auto" /> : 'Start Chat'}
                </button>
              </form>
            )}

            {/* Connecting */}
            {status === 'connecting' && (
              <div className="text-center py-12">
                <Loader2 size={32} className="animate-spin mx-auto text-primary-500 mb-3" />
                <p className="text-sm text-gray-600">Connecting you to a support agent...</p>
              </div>
            )}

            {/* Queued */}
            {status === 'queued' && (
              <div className="space-y-3">
                <div className="bg-primary-50 border border-primary-100 rounded-xl p-4 text-center">
                  <div className="text-2xl font-bold text-primary-600">#{queuePosition ?? '...'}</div>
                  <div className="text-sm text-gray-600 mt-1">in the support queue</div>
                  <p className="text-xs text-gray-500 mt-2">
                    All agents are currently busy. We'll connect you as soon as one is available.
                  </p>
                </div>
                {messages.map(msg => <MessageBubble key={msg.id} msg={msg} />)}
              </div>
            )}

            {/* Active chat */}
            {status === 'active' && (
              <>
                <div className="text-center">
                  <span className="text-xs text-gray-400 bg-gray-100 px-3 py-1 rounded-full">
                    You're connected with {agentName ?? 'an agent'}
                  </span>
                </div>
                {messages.map(msg => <MessageBubble key={msg.id} msg={msg} />)}
                {typingIndicator === 'agent' && (
                  <div className="flex gap-1 items-center text-gray-400 text-xs">
                    <span className="bg-gray-200 rounded-full px-3 py-1.5 inline-flex gap-1">
                      <span className="animate-bounce" style={{ animationDelay: '0ms' }}>·</span>
                      <span className="animate-bounce" style={{ animationDelay: '150ms' }}>·</span>
                      <span className="animate-bounce" style={{ animationDelay: '300ms' }}>·</span>
                    </span>
                    <span>{agentName} is typing</span>
                  </div>
                )}
              </>
            )}

            {/* Closed */}
            {status === 'closed' && (
              <div className="space-y-3">
                {messages.map(msg => <MessageBubble key={msg.id} msg={msg} />)}
                <div className="text-center">
                  <span className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                    This chat has ended. Thank you for using PrintSupport.
                  </span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          {status === 'active' && (
            <form
              onSubmit={handleSend}
              className="border-t border-gray-100 p-3 flex gap-2 flex-shrink-0"
            >
              <input
                className="input flex-1 text-sm py-2"
                value={input}
                onChange={e => handleInputChange(e.target.value)}
                placeholder="Type a message..."
                autoFocus
              />
              <button
                type="submit"
                disabled={!input.trim()}
                className="bg-primary-600 text-white p-2 rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-40"
              >
                <Send size={16} />
              </button>
            </form>
          )}
        </div>
      )}
    </>
  )
}

function MessageBubble({ msg }: { msg: { senderType: string; content: string; sender?: { name: string } | null } }) {
  const isVisitor = msg.senderType === 'visitor'
  return (
    <div className={`flex ${isVisitor ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[80%] rounded-2xl px-3.5 py-2 text-sm ${
          isVisitor
            ? 'bg-primary-600 text-white rounded-br-sm'
            : 'bg-gray-100 text-gray-800 rounded-bl-sm'
        }`}
      >
        {!isVisitor && msg.sender && (
          <div className="text-xs font-medium text-gray-500 mb-0.5">{msg.sender.name}</div>
        )}
        {msg.content}
      </div>
    </div>
  )
}

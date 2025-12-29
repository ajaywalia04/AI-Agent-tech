import React, { useState, useEffect, useRef } from 'react';
import { Send, Bot, Loader2 } from 'lucide-react';
import { sendMessage, fetchHistory } from './services/api';
import type { Message } from './services/api';
import ReactMarkdown from 'react-markdown';

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<string | undefined>(() => {
    return localStorage.getItem('chat_session_id') || undefined;
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  useEffect(() => {
    if (sessionId) {
      const loadHistory = async () => {
        try {
          const history = await fetchHistory(sessionId);
          setMessages(history);
        } catch (err) {
          console.error('Failed to load history:', err);
        }
      };
      loadHistory();
    }
  }, [sessionId]);

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isTyping) return;

    const userMsg = input.trim();
    setInput('');
    setError(null);

    // Optimistic update
    const newMessage: Message = { role: 'user', content: userMsg };
    setMessages(prev => [...prev, newMessage]);

    setIsTyping(true);

    try {
      const response = await sendMessage(userMsg, sessionId);

      if (!sessionId) {
        setSessionId(response.sessionId);
        localStorage.setItem('chat_session_id', response.sessionId);
      }

      const aiMsg: Message = { role: 'assistant', content: response.reply };
      setMessages(prev => [...prev, aiMsg]);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Something went wrong. Please try again.');
      // Remove the optimistic user message if we want, or just leave it. 
      // For now, let's keep it but show an error.
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="app-container">
      <div className="chat-card">
        <header className="chat-header">
          <Bot size={24} color="var(--primary)" />
          <div style={{ flex: 1 }}>
            <h1>AI Assistant</h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <div className="status-indicator"></div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Always Online</span>
            </div>
          </div>
          <button
            onClick={() => {
              localStorage.removeItem('chat_session_id');
              setSessionId(undefined);
              setMessages([]);
            }}
            style={{ fontSize: '0.75rem', color: 'var(--text-muted)', background: 'none', border: '1px solid var(--border)', padding: '2px 8px', borderRadius: '4px', cursor: 'pointer' }}
          >
            New Chat
          </button>
        </header>

        {error && <div className="error-banner">{error}</div>}

        <div className="message-list">
          {messages.length === 0 && (
            <div style={{ textAlign: 'center', color: 'var(--text-muted)', marginTop: '2rem', animation: 'fadeIn 0.5s ease-out' }}>
              <Bot size={48} style={{ opacity: 0.2, marginBottom: '1rem' }} />
              <p style={{ fontWeight: 500, color: 'var(--text-main)', marginBottom: '0.5rem' }}>Hi! I'm your Support AI</p>
              <p style={{ fontSize: '0.875rem', marginBottom: '1.5rem' }}>How can I help you today?</p>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', justifyContent: 'center', maxWidth: '400px', margin: '0 auto' }}>
                {['Return policy?', 'Support hours?', 'Shipping to USA?', 'Contact info'].map((q) => (
                  <button
                    key={q}
                    onClick={() => {
                      setInput(q);
                    }}
                    style={{
                      background: 'white',
                      border: '1px solid var(--border)',
                      padding: '6px 12px',
                      borderRadius: '20px',
                      fontSize: '0.75rem',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      color: 'var(--primary)',
                      fontWeight: 500
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.borderColor = 'var(--primary)';
                      e.currentTarget.style.backgroundColor = '#f5f7ff';
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.borderColor = 'var(--border)';
                      e.currentTarget.style.backgroundColor = 'white';
                    }}
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((msg, index) => (
            <div
              key={index}
              className={`message-item message-${msg.role}`}
            >
              {msg.role === 'assistant' ? (
                <div className="markdown-content">
                  <ReactMarkdown>{msg.content}</ReactMarkdown>
                </div>
              ) : (
                msg.content
              )}
            </div>
          ))}

          {isTyping && (
            <div className="typing-indicator">
              <div className="dot"></div>
              <div className="dot"></div>
              <div className="dot"></div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <form className="chat-input-area" onSubmit={handleSend}>
          <input
            type="text"
            className="chat-input"
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isTyping}
          />
          <button
            type="submit"
            className="send-button"
            disabled={!input.trim() || isTyping}
          >
            {isTyping ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
            <span>Send</span>
          </button>
        </form>
      </div>
      <footer style={{ textAlign: 'center', padding: '1rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
        Powered by AI
      </footer>
    </div>
  );
};

export default App;

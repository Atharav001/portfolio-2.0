import React, { useState, useEffect, useRef } from 'react';
import { Send, Bot, User, Sparkles, X, MessageSquareText, RotateCcw, Copy, Check } from 'lucide-react';
import './ChatWidget.css';

const SUGGESTED_QUESTIONS = [
  "What has Atharav built?",
  "What is his tech stack?",
  "Tell me about India Space Lab",
  "Is he open to internships?"
];

const getOrCreateSessionId = () => {
  try {
    let id = sessionStorage.getItem('ath_chat_session_id');
    if (!id) {
      id = 'sess_' + Math.random().toString(36).substring(2, 11) + '_' + Date.now();
      sessionStorage.setItem('ath_chat_session_id', id);
    }
    return id;
  } catch {
    return 'sess_' + Date.now();
  }
};

// Formats text responses cleanly (handling linebreaks, bullet lists, bold text, and inline code)
const FormattedMessageText = ({ text }) => {
  if (!text) return null;

  const lines = text.split('\n').filter((l) => l.trim() !== '');

  return (
    <div className="formatted-chat-text">
      {lines.map((line, lIdx) => {
        const isBullet = line.trim().startsWith('- ') || line.trim().startsWith('* ');
        const cleanLine = isBullet ? line.trim().substring(2) : line;

        // Parse inline elements (bold **text**, inline `code`)
        const parts = cleanLine.split(/(\*\*.*?\*\*|`.*?`)/g);

        const renderedLine = parts.map((part, pIdx) => {
          if (part.startsWith('**') && part.endsWith('**')) {
            return <strong key={pIdx}>{part.slice(2, -2)}</strong>;
          }
          if (part.startsWith('`') && part.endsWith('`')) {
            return <code key={pIdx} className="chat-inline-code">{part.slice(1, -1)}</code>;
          }
          return part;
        });

        if (isBullet) {
          return (
            <div key={lIdx} className="chat-bullet-line">
              <span className="chat-bullet-dot">•</span>
              <span>{renderedLine}</span>
            </div>
          );
        }

        return (
          <p key={lIdx} className="chat-paragraph">
            {renderedLine}
          </p>
        );
      })}
    </div>
  );
};

const ChatWidget = () => {
  const [sessionId, setSessionId] = useState('');
  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      sender: 'assistant',
      text: "Hi! I'm Atharav's Portfolio Assistant. Ask me anything about Atharav — his background, projects, skills, or experience!",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isMobileExpanded, setIsMobileExpanded] = useState(false);
  const [copiedId, setCopiedId] = useState(null);

  const chatMessagesRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    setSessionId(getOrCreateSessionId());
  }, []);

  // Scroll ONLY the internal messages container without triggering outer page scrolling
  useEffect(() => {
    const container = chatMessagesRef.current;
    if (container) {
      container.scrollTo({
        top: container.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages, isLoading]);

  const handleSend = async (textToSend) => {
    const query = (textToSend || input).trim();
    if (!query || isLoading) return;

    const userMsg = {
      id: 'user_' + Date.now(),
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: query,
          sessionId: sessionId || getOrCreateSessionId(),
        }),
      });

      const data = await response.json();
      const assistantText =
        data.answer ||
        'Something went wrong on my end — please try again in a moment.';

      setMessages((prev) => [
        ...prev,
        {
          id: 'ast_' + Date.now(),
          sender: 'assistant',
          text: assistantText,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } catch (err) {
      console.error('Chat API request error:', err);
      setMessages((prev) => [
        ...prev,
        {
          id: 'ast_err_' + Date.now(),
          sender: 'assistant',
          text: 'Something went wrong on my end — please try again in a moment.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleSend();
  };

  const handleClear = () => {
    setMessages([
      {
        id: 'welcome_' + Date.now(),
        sender: 'assistant',
        text: "Hi! I'm Atharav's Portfolio Assistant. Ask me anything about Atharav — his background, projects, skills, or experience!",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  const handleCopy = (id, text) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const content = (
    <div className={`chat-card ${isMobileExpanded ? 'mobile-fullscreen' : ''}`}>
      <div className="chat-header">
        <div className="chat-header-left">
          <span className="console-dot red"></span>
          <span className="console-dot yellow"></span>
          <span className="console-dot green"></span>
          <div className="chat-header-title-wrap">
            <Bot size={16} className="chat-bot-icon" />
            <span className="chat-header-title">Ask About Atharav AI</span>
            <span className="chat-status-badge">Scope-Locked RAG</span>
          </div>
        </div>
        <div className="chat-header-right">
          {messages.length > 1 && (
            <button
              className="chat-header-action-btn"
              onClick={handleClear}
              title="Reset Conversation"
              type="button"
            >
              <RotateCcw size={14} />
              <span className="btn-label-desktop">Reset</span>
            </button>
          )}
          {isMobileExpanded && (
            <button
              className="chat-close-btn"
              onClick={() => setIsMobileExpanded(false)}
              title="Close Assistant"
              type="button"
            >
              <X size={18} />
            </button>
          )}
        </div>
      </div>

      <div className="chat-body">
        <div className="chat-messages" ref={chatMessagesRef}>
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`chat-message-row ${msg.sender === 'user' ? 'user-row' : 'assistant-row'}`}
            >
              <div className="chat-avatar">
                {msg.sender === 'user' ? (
                  <User size={14} />
                ) : (
                  <Bot size={14} />
                )}
              </div>
              <div className="chat-bubble-container">
                <div className="chat-bubble">
                  <FormattedMessageText text={msg.text} />
                  <div className="chat-bubble-footer">
                    <span className="chat-timestamp">{msg.timestamp}</span>
                    {msg.sender === 'assistant' && (
                      <button
                        className="chat-copy-btn"
                        onClick={() => handleCopy(msg.id, msg.text)}
                        title="Copy message"
                        type="button"
                      >
                        {copiedId === msg.id ? (
                          <Check size={11} className="copied-icon" />
                        ) : (
                          <Copy size={11} />
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="chat-message-row assistant-row">
              <div className="chat-avatar">
                <Bot size={14} />
              </div>
              <div className="chat-bubble-container">
                <div className="chat-bubble typing-bubble">
                  <span className="typing-label">Thinking</span>
                  <span className="typing-dot"></span>
                  <span className="typing-dot"></span>
                  <span className="typing-dot"></span>
                </div>
              </div>
            </div>
          )}
        </div>

        {messages.length <= 2 && !isLoading && (
          <div className="chat-chips-container">
            <div className="chat-chips-label">
              <Sparkles size={12} /> Suggested Questions
            </div>
            <div className="chat-chips">
              {SUGGESTED_QUESTIONS.map((q, idx) => (
                <button
                  key={idx}
                  className="chat-chip"
                  onClick={() => handleSend(q)}
                  type="button"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="chat-footer">
        <form className="chat-input-row" onSubmit={handleSubmit}>
          <input
            ref={inputRef}
            type="text"
            className="chat-input"
            placeholder="Ask anything about Atharav..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            maxLength={500}
            disabled={isLoading}
          />
          <button
            type="submit"
            className="chat-send-btn"
            disabled={!input.trim() || isLoading}
            title="Send Message"
          >
            <Send size={15} />
          </button>
        </form>
        <div className="chat-caption">
          <span>Answers only questions about Atharav. Powered by Gemini & Supabase RAG.</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="chat-widget-wrapper">
      {/* Desktop & Expanded View */}
      <div className="chat-desktop-view">{content}</div>

      {/* Mobile Collapsed Pill */}
      <div className="chat-mobile-pill-container">
        <button
          type="button"
          className="chat-mobile-pill"
          onClick={() => setIsMobileExpanded(true)}
        >
          <MessageSquareText size={18} />
          <span>Ask me anything about Atharav →</span>
        </button>
      </div>

      {/* Mobile Fullscreen Overlay */}
      {isMobileExpanded && (
        <div className="chat-mobile-overlay">
          {content}
        </div>
      )}
    </div>
  );
};

export default ChatWidget;

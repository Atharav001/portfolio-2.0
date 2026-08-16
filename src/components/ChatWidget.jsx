import React, { useState, useEffect, useRef } from 'react';
import { Send, Bot, User, Sparkles, X, MessageSquareText, RotateCcw, Copy, Check } from 'lucide-react';
import { ThinkingOrb } from './ThinkingOrb';
import './ChatWidget.css';

const SUGGESTED_QUESTIONS = [
  "What are the projects he has built?",
  "Tell me about his education."
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

// Parses markdown bold (**text**), inline code (`code`), and markdown clickable links ([text](url))
const parseLineTokens = (line) => {
  const tokens = line.split(/(\*\*.*?\*\*|`.*?`|\[.*?\]\(.*?\))/g);
  return tokens.map((token, idx) => {
    if (token.startsWith('**') && token.endsWith('**')) {
      return <strong key={idx}>{token.slice(2, -2)}</strong>;
    }
    if (token.startsWith('`') && token.endsWith('`')) {
      return <code key={idx} className="chat-inline-code">{token.slice(1, -1)}</code>;
    }
    const linkMatch = token.match(/^\[(.*?)\]\((.*?)\)$/);
    if (linkMatch) {
      return (
        <a
          key={idx}
          href={linkMatch[2]}
          target="_blank"
          rel="noopener noreferrer"
          className="chat-link"
        >
          {linkMatch[1]}
        </a>
      );
    }
    return token;
  });
};

const FormattedMessageText = ({ text }) => {
  if (!text) return null;

  const lines = text.split('\n').filter((l) => l.trim() !== '');

  return (
    <div className="formatted-chat-text">
      {lines.map((line, lIdx) => {
        const leadingSpaces = line.search(/\S/);
        const isNested = leadingSpaces >= 2;
        const trimmed = line.trim();
        const isBullet = trimmed.startsWith('- ') || trimmed.startsWith('* ');
        const cleanLine = isBullet ? trimmed.substring(2) : trimmed;
        const renderedTokens = parseLineTokens(cleanLine);

        if (isBullet) {
          return (
            <div key={lIdx} className={`chat-bullet-line${isNested ? ' nested' : ''}`}>
              <span className="chat-bullet-dot">{isNested ? '▪' : '•'}</span>
              <span>{renderedTokens}</span>
            </div>
          );
        }

        return (
          <p key={lIdx} className={`chat-paragraph${isNested ? ' nested-para' : ''}`}>
            {renderedTokens}
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

  // Scroll internal messages container when new messages arrive or loading starts
  useEffect(() => {
    const container = chatMessagesRef.current;
    if (container) {
      setTimeout(() => {
        container.scrollTo({
          top: container.scrollHeight,
          behavior: 'smooth',
        });
      }, 60);
    }
  }, [messages.length, isLoading]);

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
        "I'm sorry, I couldn't fetch an answer right now. Please check back in a moment or view Atharav's [GitHub Profile](https://github.com/Atharav001).";

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
          text: "Sorry, I encountered a network error. Please try again or check Atharav's [GitHub Profile](https://github.com/Atharav001).",
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
              <RotateCcw size={13} />
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
                <div className="chat-bubble thinking-bubble-orb">
                  <ThinkingOrb state="composing" size={32} speed={1.50} />
                  <span className="thinking-text">Composing response...</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {messages.length <= 2 && !isLoading && (
          <div className="chat-chips-container">
            <div className="chat-chips-label">
              <Sparkles size={11} /> Example Questions
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
        <form
          className="chat-input-row"
          onSubmit={handleSubmit}
          onClick={() => inputRef.current?.focus()}
        >
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

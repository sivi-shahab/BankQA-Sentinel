
import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, Send, X, Bot, User, BookText, Database, Sparkles, AlertCircle } from 'lucide-react';
import { ChatMessage, FullDashboardContext } from '../types';
import { sendChatQuery } from '../services/geminiService';

interface ChatAssistantProps {
  dashboardContext: FullDashboardContext;
  referenceText: string;
}

export const ChatAssistant: React.FC<ChatAssistantProps> = ({ dashboardContext, referenceText }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'model',
      text: 'ProofPoint.AI Analyst active. Context synced with Dashboard DB. How can I help with leads, retention, or audits today?',
      timestamp: new Date()
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const history = messages.map(m => ({ role: m.role, text: m.text }));
      const responseText = await sendChatQuery(history, userMsg.text, dashboardContext, referenceText);

      const botMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: responseText,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMsg]);
    } catch (error) {
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: 'model',
        text: "System overload or context error. Please try again.",
        timestamp: new Date()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const quickQueries = [
    "Who is at highest churn risk?",
    "Summarize top performing agent",
    "Identify hot leads from Facebook",
    "Analyze current call compliance"
  ];

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 h-14 w-14 bg-indigo-600 text-white rounded-full shadow-lg hover:bg-indigo-700 transition-all duration-300 flex items-center justify-center z-50 hover:scale-110 group"
      >
        <MessageCircle className="w-7 h-7" />
        <div className="absolute -top-1 -right-1 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500 border-2 border-white"></span>
        </div>
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 w-96 h-[650px] bg-white rounded-[32px] shadow-2xl flex flex-col border border-slate-200 z-50 animate-slide-up overflow-hidden">
      {/* Header */}
      <div className="bg-slate-900 p-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-600 rounded-xl shadow-lg shadow-indigo-500/20">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-black text-white text-sm tracking-tight leading-none mb-1">ProofPoint.AI Analyst</h3>
            <div className="flex items-center gap-1.5">
                <Database className="w-2.5 h-2.5 text-emerald-400" />
                <span className="text-[9px] text-emerald-400 font-black uppercase tracking-widest">Context Synchronized</span>
            </div>
          </div>
        </div>
        <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white transition-colors">
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* RAG Status Bar */}
      {referenceText && (
        <div className="bg-indigo-50 px-4 py-2 border-b border-indigo-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
                <BookText className="w-3 h-3 text-indigo-600" />
                <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">RAG Engine Active</span>
            </div>
            <span className="text-[9px] text-slate-400 font-bold">{Math.round(referenceText.length / 1024)}KB Context</span>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-slate-50 custom-scrollbar">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] rounded-[20px] p-4 text-sm shadow-sm ${
                msg.role === 'user'
                  ? 'bg-indigo-600 text-white rounded-tr-none'
                  : 'bg-white border border-slate-200 text-slate-700 rounded-tl-none'
              }`}
            >
              <p className="leading-relaxed font-medium">{msg.text}</p>
              <div className={`mt-1 text-[9px] opacity-40 font-bold ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
                {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-none p-4 shadow-sm">
              <div className="flex space-x-1.5">
                <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Actions */}
      {!isLoading && messages.length < 4 && (
        <div className="px-5 py-3 flex flex-wrap gap-2 bg-slate-50 border-t border-slate-100">
            {quickQueries.map((q, i) => (
                <button 
                    key={i}
                    onClick={() => { setInput(q); }}
                    className="text-[9px] font-black text-slate-500 bg-white border border-slate-200 px-3 py-1.5 rounded-full hover:bg-indigo-50 hover:border-indigo-200 hover:text-indigo-600 transition-all shadow-sm"
                >
                    {q}
                </button>
            ))}
        </div>
      )}

      {/* Input */}
      <div className="p-5 bg-white border-t border-slate-200">
        <div className="flex gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask about leads, customers, or team..."
            className="flex-1 px-4 py-3 bg-slate-100 border-none rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm font-medium"
          />
          <button
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="bg-indigo-600 text-white p-3 rounded-2xl hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-indigo-200 flex items-center justify-center"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

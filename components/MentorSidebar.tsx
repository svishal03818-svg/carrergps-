import React, { useState, useRef, useEffect } from 'react';
import { MentorMessage } from '../types';
import { chatWithMentor } from '../services/geminiService';
import { MessageSquare, Send, Sparkles, X } from 'lucide-react';

interface Props {
  context: string;
}

const MentorSidebar: React.FC<Props> = ({ context }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<MentorMessage[]>([
    { id: '1', role: 'ai', content: 'Hi! I see you\'re working on your roadmap. I can help clarify specific goals or explain why certain skills are needed. What\'s on your mind?', timestamp: Date.now() }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim()) return;
    
    const userMsg: MentorMessage = { id: Date.now().toString(), role: 'user', content: input, timestamp: Date.now() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    const responseText = await chatWithMentor(messages, input, context);
    
    const aiMsg: MentorMessage = { id: (Date.now() + 1).toString(), role: 'ai', content: responseText, timestamp: Date.now() };
    setMessages(prev => [...prev, aiMsg]);
    setIsTyping(false);
  };

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-primary text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-transform z-50 group"
      >
        <Sparkles size={24} className="group-hover:animate-spin" />
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 w-[350px] h-[500px] bg-surfaceHighlight border border-slate-700 rounded-2xl shadow-2xl flex flex-col z-50 animate-fade-in-up overflow-hidden">
      {/* Header */}
      <div className="p-4 bg-primary text-white flex justify-between items-center">
         <div className="flex items-center gap-2">
            <Sparkles size={16} />
            <span className="font-bold">AI Mentor</span>
         </div>
         <button onClick={() => setIsOpen(false)} className="hover:bg-white/20 rounded p-1">
            <X size={16} />
         </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-surface" ref={scrollRef}>
         {messages.map(msg => (
            <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
               <div className={`max-w-[85%] p-3 rounded-xl text-sm leading-relaxed ${
                 msg.role === 'user' 
                   ? 'bg-primary text-white rounded-br-none' 
                   : 'bg-surfaceHighlight border border-slate-700 text-slate-200 rounded-bl-none'
               }`}>
                  {msg.content}
               </div>
            </div>
         ))}
         {isTyping && (
           <div className="flex justify-start">
              <div className="bg-surfaceHighlight border border-slate-700 rounded-xl rounded-bl-none p-3 flex gap-1">
                 <span className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce"></span>
                 <span className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></span>
                 <span className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></span>
              </div>
           </div>
         )}
      </div>

      {/* Input */}
      <div className="p-3 bg-surfaceHighlight border-t border-slate-700 flex gap-2">
         <input
           type="text"
           value={input}
           onChange={(e) => setInput(e.target.value)}
           onKeyDown={(e) => e.key === 'Enter' && handleSend()}
           placeholder="Ask for hints or clarity..."
           className="flex-1 bg-surface text-white text-sm rounded-lg px-3 py-2 outline-none border border-slate-700 focus:border-primary"
         />
         <button onClick={handleSend} className="bg-primary text-white p-2 rounded-lg hover:bg-indigo-600 transition-colors">
            <Send size={18} />
         </button>
      </div>
    </div>
  );
};

export default MentorSidebar;
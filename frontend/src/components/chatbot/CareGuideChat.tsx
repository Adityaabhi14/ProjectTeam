// Client-side CareGuide assistant. No chatbot API or patient data is used.
import React, { FormEvent, useEffect, useRef, useState } from 'react';
import { Bot, Calendar, ChevronRight, ClipboardList, MessageCircleHeart, RefreshCw, Search, Send, Sparkles, Stethoscope, X } from 'lucide-react';

type Message = { id: number; sender: 'assistant' | 'user'; text: string };
interface CareGuideChatProps {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  onBookAppointment: () => void;
  onBrowseDoctors: () => void;
}

const welcomeMessage: Message = {
  id: 1,
  sender: 'assistant',
  text: 'Hi, I’m CareGuide. Search for a specialist, appointment help, or information about your visit. I can guide you to the right CarePoint service, but I cannot diagnose medical conditions.'
};
const starterPrompts = ['Book an appointment', 'Find a specialist', 'Prepare for my visit'];

const getAssistantReply = (message: string): string => {
  const normalized = message.toLowerCase();
  if (/emergency|urgent|chest pain|can.?t breathe|cannot breathe|difficulty breathing|stroke|unconscious|suicid/.test(normalized)) return 'If there is severe chest pain, trouble breathing, stroke symptoms, severe bleeding, loss of consciousness, or you feel unsafe, call your local emergency number or go to the nearest emergency department now. Do not wait for an online reply.';
  if (/book|appointment|schedule|consult/.test(normalized)) return 'I can help with that. Select “Book appointment” below to choose a doctor, visit type, and a suitable time.';
  if (/doctor|specialist|department|find/.test(normalized)) return 'You can explore our doctor directory by specialty, including cardiology, neurology, orthopedics, general medicine, and more. Select “Find a specialist” below to get started.';
  if (/bring|prepare|visit|documents|insurance/.test(normalized)) return 'For your visit, bring a photo ID, insurance details if applicable, a list of medicines and allergies, recent reports or scans, and your questions for the clinician. Arriving 10–15 minutes early can help.';
  if (/medicine|prescription|pharmacy|refill/.test(normalized)) return 'For prescription questions, please speak with your treating clinician or pharmacist before starting, stopping, or changing a medicine. The Pharmacy area can help you browse medicine information.';
  if (/hello|hi|hey/.test(normalized)) return 'Hello! Try searching for an appointment, a specialist, or help preparing for a visit.';
  return 'I can help you find CarePoint services and prepare for your visit. Try asking about appointments, specialists, or visit preparation. For a medical emergency, call your local emergency number now.';
};

export const CareGuideChat: React.FC<CareGuideChatProps> = ({ isOpen, onOpen, onClose, onBookAppointment, onBrowseDoctors }) => {
  const [messages, setMessages] = useState<Message[]>([welcomeMessage]);
  const [draft, setDraft] = useState('');
  const [isReplying, setIsReplying] = useState(false);
  const transcriptEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const nextMessageId = useRef(2);

  useEffect(() => { if (isOpen) window.setTimeout(() => inputRef.current?.focus(), 180); }, [isOpen]);
  useEffect(() => { transcriptEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' }); }, [messages, isReplying]);

  const sendMessage = (rawMessage: string) => {
    const text = rawMessage.trim();
    if (!text || isReplying) return;
    setMessages(previous => [...previous, { id: nextMessageId.current++, sender: 'user', text }]);
    setDraft('');
    setIsReplying(true);
    window.setTimeout(() => {
      setMessages(previous => [...previous, { id: nextMessageId.current++, sender: 'assistant', text: getAssistantReply(text) }]);
      setIsReplying(false);
    }, 500);
  };
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => { event.preventDefault(); sendMessage(draft); };
  const resetConversation = () => { setMessages([welcomeMessage]); setDraft(''); setIsReplying(false); };
  const handleBooking = () => { onClose(); onBookAppointment(); };
  const handleDoctors = () => { onClose(); onBrowseDoctors(); };

  return (
    <div className="careguide-root">
      {isOpen && (
        <section className="careguide-window" aria-label="CareGuide assistant" role="dialog" aria-modal="false">
          <header className="careguide-header">
            <div className="careguide-brand"><span className="careguide-brand-icon"><MessageCircleHeart size={21} /></span><span><strong>CareGuide</strong><small><i />Online · CarePoint assistant</small></span></div>
            <div className="careguide-header-actions"><button type="button" onClick={resetConversation} aria-label="Start new conversation" title="New conversation"><RefreshCw size={16} /></button><button type="button" onClick={onClose} aria-label="Close CareGuide"><X size={18} /></button></div>
          </header>
          <div className="careguide-body" aria-live="polite">
            {messages.map(message => <div key={message.id} className={`careguide-message careguide-message-${message.sender}`}>{message.sender === 'assistant' && <span className="careguide-message-avatar"><Bot size={15} /></span>}<p>{message.text}</p></div>)}
            {isReplying && <div className="careguide-thinking"><span className="careguide-message-avatar"><Bot size={15} /></span><span><i /><i /><i /></span> CareGuide is thinking</div>}
            <div ref={transcriptEndRef} />
          </div>
          {messages.length === 1 && <div className="careguide-prompts">{starterPrompts.map(prompt => <button key={prompt} type="button" onClick={() => sendMessage(prompt)} disabled={isReplying}>{prompt}<ChevronRight size={14} /></button>)}</div>}
          <div className="careguide-shortcuts"><button type="button" onClick={handleBooking}><Calendar size={15} />Book appointment</button><button type="button" onClick={handleDoctors}><Stethoscope size={15} />Find a doctor</button><button type="button" onClick={() => sendMessage('What should I bring to my visit?')}><ClipboardList size={15} />Visit checklist</button></div>
          <form onSubmit={handleSubmit} className="careguide-search"><Search size={18} aria-hidden="true" /><label className="careguide-sr-only" htmlFor="careguide-message">Ask CareGuide</label><input ref={inputRef} id="careguide-message" value={draft} onChange={event => setDraft(event.target.value)} placeholder="Search CarePoint or ask a question" disabled={isReplying} /><button type="submit" disabled={!draft.trim() || isReplying} aria-label="Send message"><Send size={17} /></button></form>
          <p className="careguide-disclaimer">CareGuide provides general service guidance, not medical advice.</p>
        </section>
      )}
      <button type="button" className={`careguide-launcher ${isOpen ? 'careguide-launcher-open' : ''}`} onClick={isOpen ? onClose : onOpen} aria-label={isOpen ? 'Close CareGuide' : 'Open CareGuide'} aria-expanded={isOpen}>{isOpen ? <X size={23} /> : <MessageCircleHeart size={24} />}{!isOpen && <span>Ask CareGuide</span>}{!isOpen && <b><Sparkles size={13} /></b>}</button>
      <style>{`
        .careguide-root { position: fixed; right: 24px; bottom: 24px; z-index: 1100; font-family: var(--font-sans); }.careguide-window { width: min(390px, calc(100vw - 32px)); max-height: min(640px, calc(100dvh - 112px)); margin: 0 0 14px auto; display: flex; flex-direction: column; overflow: hidden; background: #fff; border: 1px solid #d7e5e0; border-radius: 22px; box-shadow: 0 24px 58px rgba(13,43,38,.24); animation: careguide-open .22s ease-out; }.careguide-header { flex: 0 0 auto; display: flex; align-items: center; justify-content: space-between; gap: 16px; padding: 15px 16px; color: #fff; background: linear-gradient(135deg,#0d3932,#1c6558); }.careguide-brand { display: flex; align-items: center; gap: 10px; }.careguide-brand-icon { width: 38px; height: 38px; display: grid; place-items: center; border-radius: 12px; background: rgba(255,255,255,.16); }.careguide-brand strong,.careguide-brand small { display: block; }.careguide-brand strong { font-size: .96rem; }.careguide-brand small { margin-top: 2px; font-size: .7rem; color: rgba(255,255,255,.86); }.careguide-brand small i { display: inline-block; width: 6px; height: 6px; margin-right: 4px; border-radius: 50%; background: #9ce2bb; }.careguide-header-actions { display: flex; gap: 3px; }.careguide-header-actions button { width: 32px; height: 32px; display: grid; place-items: center; border: 0; border-radius: 8px; color: #fff; background: transparent; cursor: pointer; }.careguide-header-actions button:hover { background: rgba(255,255,255,.16); }
        .careguide-body { flex: 1 1 auto; min-height: 210px; padding: 16px; overflow-y: auto; background: #fcfdfc; }.careguide-message { display: flex; gap: 8px; align-items: flex-end; margin-bottom: 12px; }.careguide-message p { max-width: 84%; padding: 10px 12px; border: 1px solid #e0ebe7; border-radius: 4px 14px 14px; color: #25312d; background: #f1f7f5; font-size: .82rem; line-height: 1.55; }.careguide-message-user { justify-content: flex-end; }.careguide-message-user p { border-color: #164a41; border-radius: 14px 4px 14px 14px; color: #fff; background: #164a41; }.careguide-message-avatar { width: 26px; height: 26px; flex: 0 0 26px; display: grid; place-items: center; border-radius: 8px; color: #fff; background: #164a41; }.careguide-thinking { display: flex; align-items: center; gap: 7px; color: #62746e; font-size: .74rem; }.careguide-thinking > span:nth-child(2) { display: inline-flex; gap: 3px; padding: 5px 7px; border-radius: 8px; background: #f1f7f5; }.careguide-thinking i { width: 4px; height: 4px; border-radius: 50%; background: #2f7d6d; animation: careguide-dot 1s infinite ease-in-out; }.careguide-thinking i:nth-child(2) { animation-delay: .15s; }.careguide-thinking i:nth-child(3) { animation-delay: .3s; }
        .careguide-prompts { display: flex; flex-wrap: wrap; gap: 6px; padding: 0 16px 12px; background: #fcfdfc; }.careguide-prompts button { display: inline-flex; align-items: center; gap: 2px; padding: 6px 8px; border: 1px solid #d9e7e2; border-radius: 99px; color: #164a41; background: #fff; font: 700 .7rem var(--font-sans); cursor: pointer; }.careguide-prompts button:hover { border-color: #2f7d6d; background: #ecf7f4; }.careguide-shortcuts { display: flex; gap: 6px; padding: 9px 13px; overflow-x: auto; border-top: 1px solid #edf0ee; background: #fff; }.careguide-shortcuts button { display: inline-flex; flex: 0 0 auto; align-items: center; gap: 5px; border: 0; padding: 5px 2px; color: #286c5e; background: transparent; font: 700 .69rem var(--font-sans); cursor: pointer; }.careguide-shortcuts button:hover { color: #164a41; text-decoration: underline; }.careguide-search { display: flex; align-items: center; gap: 8px; margin: 0 13px 6px; padding: 7px 8px 7px 11px; border: 1px solid #cddbd6; border-radius: 13px; color: #668079; background: #fff; }.careguide-search:focus-within { border-color: #2f7d6d; box-shadow: 0 0 0 3px rgba(47,125,109,.12); }.careguide-search input { min-width: 0; flex: 1; border: 0; outline: 0; color: #17201d; background: transparent; font: .78rem var(--font-sans); }.careguide-search input::placeholder { color: #82918c; }.careguide-search button { width: 33px; height: 33px; display: grid; place-items: center; border: 0; border-radius: 9px; color: #fff; background: #164a41; cursor: pointer; }.careguide-search button:disabled { cursor: not-allowed; opacity: .43; }.careguide-disclaimer { padding: 0 16px 11px; color: #80908b; background: #fff; font-size: .63rem; text-align: center; }.careguide-sr-only { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0,0,0,0); }
        .careguide-launcher { position: relative; display: flex; align-items: center; gap: 9px; min-height: 52px; padding: 0 16px; border: 0; border-radius: 999px; color: #fff; background: #164a41; box-shadow: 0 10px 24px rgba(22,74,65,.32); font: 800 .82rem var(--font-sans); cursor: pointer; transition: transform .2s ease,background .2s ease; }.careguide-launcher:hover { transform: translateY(-2px); background: #1e5c52; }.careguide-launcher b { width: 19px; height: 19px; display: grid; place-items: center; border-radius: 50%; color: #164a41; background: #f5c85b; }.careguide-launcher-open { width: 52px; justify-content: center; padding: 0; }.careguide-launcher-open:hover { background: #103831; } @keyframes careguide-open { from { opacity: 0; transform: translateY(10px) scale(.98); } to { opacity: 1; transform: translateY(0) scale(1); } } @keyframes careguide-dot { 0%,60%,100% { transform: translateY(0); opacity: .45; } 30% { transform: translateY(-3px); opacity: 1; } } @media (max-width: 520px) { .careguide-root { right: 16px; bottom: 16px; }.careguide-window { max-height: calc(100dvh - 90px); }.careguide-launcher:not(.careguide-launcher-open) span { display: none; }.careguide-launcher { width: 52px; justify-content: center; padding: 0; }.careguide-launcher b { position: absolute; top: -2px; right: -2px; } }
      `}</style>
    </div>
  );
};

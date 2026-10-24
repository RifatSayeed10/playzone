import React, { useState } from 'react';
import { Mail, Send, CheckCircle, MessageSquare, Phone, MapPin, HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';

export const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'Feedback',
    message: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!formData.name.trim()) errs.name = 'Full name is required';
    if (!formData.email.trim()) {
      errs.email = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errs.email = 'Please provide a valid email address';
    }
    if (!formData.message.trim() || formData.message.trim().length < 10) {
      errs.message = 'Message must be at least 10 characters';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      setIsSubmitted(true);
      // Save feedback entry to localStorage for demonstration
      try {
        const saved = JSON.parse(localStorage.getItem('playzone_contact_inquiries') || '[]');
        saved.unshift({ ...formData, date: new Date().toISOString() });
        localStorage.setItem('playzone_contact_inquiries', JSON.stringify(saved));
      } catch {
        // ignore
      }
      setFormData({ name: '', email: '', subject: 'Feedback', message: '' });
      setErrors({});
    }
  };

  const faqs = [
    {
      q: 'Do I need to download or install any software to play?',
      a: 'No! All PlayZone games run directly in your web browser utilizing modern HTML5 Canvas, WebGL, and JavaScript technologies without downloads.',
    },
    {
      q: 'How do high scores work?',
      a: 'Your scores are stored locally in your browser storage. You can submit your gamer tag at the end of each round to compete on the local High Scores Leaderboard.',
    },
    {
      q: 'Can I suggest or submit a new game to PlayZone?',
      a: 'Yes! Use this contact form with the "Game Submission" subject or use the Admin Portal to add custom HTML5 game URLs directly.',
    },
    {
      q: 'Is PlayZone completely free?',
      a: 'Yes, 100% of our game catalog is free to play anytime on mobile, tablet, and desktop devices.',
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-12">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <h1 className="text-3xl sm:text-5xl font-black font-display text-white">
          Get in Touch
        </h1>
        <p className="text-slate-400 text-sm sm:text-base">
          Have questions, suggestions, or want to submit your game to PlayZone? Send us a message!
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Contact Info Sidebar */}
        <div className="space-y-6">
          <div className="p-6 bg-[#172033] border border-slate-700/60 rounded-2xl shadow-lg space-y-4">
            <h3 className="font-display font-bold text-lg text-white">Contact Information</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              PlayZone is maintained as an open-access web gaming initiative for the Web Engineering department.
            </p>

            <div className="space-y-3 pt-2 text-xs">
              <div className="flex items-center gap-3 text-slate-300">
                <div className="w-8 h-8 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center shrink-0">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase font-bold">Email</span>
                  <span>support@playzone-games.com</span>
                </div>
              </div>

              <div className="flex items-center gap-3 text-slate-300">
                <div className="w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0">
                  <MessageSquare className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase font-bold">Discord Community</span>
                  <span>discord.gg/playzone</span>
                </div>
              </div>

              <div className="flex items-center gap-3 text-slate-300">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase font-bold">Location</span>
                  <span>Web Engineering Computer Lab #402</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick FAQ Accordion */}
          <div className="p-6 bg-[#172033] border border-slate-700/60 rounded-2xl shadow-lg">
            <h3 className="font-display font-bold text-base text-white mb-3 flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-cyan-400" /> Frequently Asked
            </h3>
            <div className="space-y-2">
              {faqs.map((faq, idx) => (
                <div key={idx} className="border-b border-slate-800 last:border-b-0 pb-2">
                  <button
                    onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                    className="w-full text-left py-1.5 flex items-center justify-between text-xs font-semibold text-slate-200 hover:text-cyan-300"
                  >
                    <span>{faq.q}</span>
                    {openFaq === idx ? (
                      <ChevronUp className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                    ) : (
                      <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    )}
                  </button>
                  {openFaq === idx && (
                    <p className="text-[11px] text-slate-400 pb-2 leading-relaxed animate-fadeIn">
                      {faq.a}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-2 p-6 sm:p-8 bg-[#172033] border border-slate-700/60 rounded-3xl shadow-xl">
          <h2 className="text-xl font-bold font-display text-white mb-2">Send a Message</h2>
          <p className="text-xs text-slate-400 mb-6">
            Fill out the form below. We usually reply within 24 business hours.
          </p>

          {isSubmitted ? (
            <div className="p-6 bg-emerald-950/40 border border-emerald-500/60 rounded-2xl text-center space-y-3 animate-fadeIn">
              <div className="w-12 h-12 mx-auto rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <CheckCircle className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold font-display text-white">Thank You! Message Received</h3>
              <p className="text-xs text-slate-300 max-w-md mx-auto">
                Your inquiry has been stored. Our community team will get back to your email shortly.
              </p>
              <button
                onClick={() => setIsSubmitted(false)}
                className="mt-3 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Your Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Alex Mercer"
                    className={`w-full px-4 py-2.5 bg-[#0B1020] border rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none transition ${
                      errors.name ? 'border-rose-500' : 'border-slate-700 focus:border-cyan-500'
                    }`}
                  />
                  {errors.name && <span className="text-[11px] text-rose-400 mt-1 block">{errors.name}</span>}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Your Email Address *</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="alex@example.com"
                    className={`w-full px-4 py-2.5 bg-[#0B1020] border rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none transition ${
                      errors.email ? 'border-rose-500' : 'border-slate-700 focus:border-cyan-500'
                    }`}
                  />
                  {errors.email && <span className="text-[11px] text-rose-400 mt-1 block">{errors.email}</span>}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Subject</label>
                <select
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full px-4 py-2.5 bg-[#0B1020] border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500"
                >
                  <option value="Feedback">General Feedback / Game Suggestion</option>
                  <option value="Bug">Report a Bug / Glitch</option>
                  <option value="Submission">Submit a New HTML5 Game</option>
                  <option value="Partnership">Partnership / Advertising Inquiry</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Message *</label>
                <textarea
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Tell us what's on your mind..."
                  className={`w-full px-4 py-2.5 bg-[#0B1020] border rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none transition ${
                    errors.message ? 'border-rose-500' : 'border-slate-700 focus:border-cyan-500'
                  }`}
                />
                {errors.message && <span className="text-[11px] text-rose-400 mt-1 block">{errors.message}</span>}
              </div>

              <button
                type="submit"
                className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 text-white rounded-xl text-xs font-bold uppercase tracking-wider shadow-lg shadow-purple-500/20 transition flex items-center justify-center gap-2"
              >
                <Send className="w-3.5 h-3.5" /> Submit Inquiry
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

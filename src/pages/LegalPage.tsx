import React, { useState } from 'react';
import { Shield, FileText, CheckCircle2 } from 'lucide-react';

export const LegalPage: React.FC<{ initialTab?: 'privacy' | 'terms' }> = ({ initialTab = 'privacy' }) => {
  const [activeTab, setActiveTab] = useState<'privacy' | 'terms'>(initialTab);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl sm:text-4xl font-black font-display text-white">
          Legal & Privacy Information
        </h1>
        <p className="text-xs text-slate-400">
          Last revised: October 2026 · PlayZone Free Online Games
        </p>
      </div>

      {/* Tabs */}
      <div className="flex justify-center gap-2">
        <button
          onClick={() => setActiveTab('privacy')}
          className={`px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition ${
            activeTab === 'privacy'
              ? 'bg-purple-600 text-white shadow-md'
              : 'bg-[#172033] text-slate-400 hover:text-white'
          }`}
        >
          <Shield className="w-4 h-4" /> Privacy Policy
        </button>
        <button
          onClick={() => setActiveTab('terms')}
          className={`px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition ${
            activeTab === 'terms'
              ? 'bg-cyan-600 text-white shadow-md'
              : 'bg-[#172033] text-slate-400 hover:text-white'
          }`}
        >
          <FileText className="w-4 h-4" /> Terms of Service
        </button>
      </div>

      {/* Content Container */}
      <div className="p-6 sm:p-10 bg-[#172033] border border-slate-700/60 rounded-3xl shadow-xl text-slate-300 text-sm leading-relaxed space-y-6">
        {activeTab === 'privacy' ? (
          <>
            <section className="space-y-2">
              <h2 className="text-lg font-bold font-display text-white">1. Information We Collect</h2>
              <p>
                PlayZone is dedicated to protecting user privacy. We do not require account creation, passwords, or personal credentials to access or play games on this portal.
              </p>
              <ul className="list-disc list-inside space-y-1 text-xs text-slate-400 pl-2">
                <li><strong>Local Browser Storage:</strong> We use HTML5 localStorage to save high scores, sound preferences, and game history locally on your device.</li>
                <li><strong>Contact Submissions:</strong> If you voluntarily reach out via our contact form, your provided name, email address, and message are retained to assist with your inquiry.</li>
              </ul>
            </section>

            <section className="space-y-2">
              <h2 className="text-lg font-bold font-display text-white">2. Cookies and Tracking</h2>
              <p>
                PlayZone does not use intrusive third-party cross-site tracking cookies. Any advertising slots placed on the portal are designated placeholders suitable for compliant display networks.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-lg font-bold font-display text-white">3. Third-Party Game Embeds</h2>
              <p>
                When playing sandboxed external games, network requests are isolated via HTML5 iframe sandboxing restrictions (`allow-scripts`, `allow-same-origin`) to safeguard user security.
              </p>
            </section>
          </>
        ) : (
          <>
            <section className="space-y-2">
              <h2 className="text-lg font-bold font-display text-white">1. Acceptance of Terms</h2>
              <p>
                By accessing and playing games on PlayZone, you agree to comply with and be bound by these terms. This site is provided for educational and non-commercial recreational purposes.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-lg font-bold font-display text-white">2. Acceptable Conduct</h2>
              <p>
                Users agree not to disrupt or attempt to manipulate local score storage, inject malicious scripts, or reverse-engineer game binaries beyond fair educational review.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-lg font-bold font-display text-white">3. Disclaimer & Intellectual Property</h2>
              <p>
                All canvas game implementations and designs are built for the university Web Engineering laboratory curriculum. Any third-party game assets and trademarks remain property of their respective creators.
              </p>
            </section>
          </>
        )}
      </div>
    </div>
  );
};

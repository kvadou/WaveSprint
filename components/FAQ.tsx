'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, HelpCircle } from 'lucide-react';

const faqs = [
  {
    question: 'What does MCP mean?',
    answer: `MCP stands for Maximum Conceivable Product—the opposite of MVP (Minimum Viable Product). Instead of "what's the smallest thing we can ship?", we ask "what's the full vision you actually want to build?" AI has changed the game: complexity that used to require huge teams and months of work can now be handled in days. You don't have to think small anymore.`,
  },
  {
    question: 'How does the 24-hour prototype work?',
    answer: `Here's the process: You submit your idea through our intake wizard. We schedule a 30-minute call to clarify requirements (usually same day). Then I build your prototype overnight or through the next day. You get a working proof of concept with core functionality—not just mockups—that you can click through, test, and share. From there, we scale up to your full MCP.`,
  },
  {
    question: 'Do I own the code?',
    answer: `Yes, 100%. You own everything we build. You get full access to the codebase, documentation, and deployment infrastructure. There's no vendor lock-in. If you want to take it to another developer or in-house team later, you can. The code is clean, well-documented, and built with standard technologies.`,
  },
  {
    question: 'What tech stack do you use?',
    answer: `I primarily work with React/Next.js for the frontend, Node.js for the backend, PostgreSQL for databases, and Tailwind for styling. For hosting, I typically use Vercel, AWS, or Supabase depending on your needs. That said, I'm flexible—if you have an existing stack or specific requirements, we can work with that.`,
  },
  {
    question: 'What happens after the initial prototype?',
    answer: `You have options. Many clients use the 24-Hour Spark to validate their idea, get feedback, or demo to stakeholders. From there, you can: 1) Continue with me for the finalization sprint (1-2 weeks to polish and add features), 2) Go full MCP—the complete, ambitious version you actually envisioned, or 3) Take the code and run with it yourself. No pressure either way.`,
  },
  {
    question: 'What if I need changes or revisions?',
    answer: `The Spark phase includes one round of revisions. During finalization, we iterate until you're happy. For full MCP builds, we keep going until your complete vision is realized. I also offer maintenance packages starting at $399/month for updates, bug fixes, and feature additions. I'm not going to disappear after launch.`,
  },
  {
    question: 'How can you build bigger AND faster than agencies?',
    answer: `Three reasons: 1) I'm a single decision-maker, not a committee. No project managers scheduling meetings about meetings. 2) AI has fundamentally changed development—I can generate and iterate on code 10x faster than before, handling complexity that used to require entire teams. 3) I focus on what matters and cut the bureaucracy. More ambition, less overhead.`,
  },
  {
    question: 'Is my idea protected/confidential?',
    answer: `Absolutely. I'm happy to sign an NDA before we discuss details. I don't share, repurpose, or talk about client projects without explicit permission. Your idea and your business are safe.`,
  },
  {
    question: 'What if you can\'t build what I need?',
    answer: `I'll tell you upfront. After our initial call, if I think the project isn't a good fit—whether it's outside my expertise, requires a bigger team, or the timeline is unrealistic—I'll let you know and try to point you in the right direction. No hard sell, no wasted time.`,
  },
];

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="section-container relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 grid-background opacity-30" />

      <div className="relative max-w-4xl mx-auto">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-sm font-medium mb-6">
            FAQ
          </span>
          <h2 className="section-title text-text mb-4">
            Common{' '}
            <span className="gradient-text">Questions</span>
          </h2>
          <p className="section-subtitle mx-auto text-center">
            Everything you need to know before we start building.
          </p>
        </motion.div>

        {/* FAQ accordion */}
        <div className="space-y-3">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
            >
              <div
                className={`rounded-xl overflow-hidden border transition-all duration-300 ${
                  openIndex === index
                    ? 'border-cyan/30 bg-cyan/5'
                    : 'border-white/5 bg-background/50 hover:border-white/10'
                }`}
              >
                <button
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                  className="w-full flex items-center justify-between p-5 text-left"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                        openIndex === index
                          ? 'bg-cyan/20 text-cyan'
                          : 'bg-white/5 text-text-muted'
                      }`}
                    >
                      <HelpCircle className="w-4 h-4" />
                    </div>
                    <span
                      className={`font-medium transition-colors ${
                        openIndex === index ? 'text-text' : 'text-text-muted'
                      }`}
                    >
                      {faq.question}
                    </span>
                  </div>
                  <ChevronDown
                    className={`w-5 h-5 text-text-muted transition-transform duration-300 ${
                      openIndex === index ? 'rotate-180 text-cyan' : ''
                    }`}
                  />
                </button>

                <AnimatePresence>
                  {openIndex === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: 'easeInOut' }}
                    >
                      <div className="px-5 pb-5 pl-17">
                        <div className="pl-12 text-text-muted leading-relaxed">
                          {faq.answer}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Still have questions CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="text-center mt-12 p-8 rounded-2xl bg-gradient-to-br from-background-secondary/80 to-background/40 border border-white/5"
        >
          <h3 className="font-display text-xl font-bold text-text mb-2">
            Still have questions?
          </h3>
          <p className="text-text-muted mb-6">
            Let&apos;s chat. I respond to every message personally.
          </p>
          <a
            href="#contact"
            className="inline-flex items-center gap-2 px-6 py-3 bg-cyan text-background font-semibold rounded-lg hover:bg-cyan-400 transition-colors"
          >
            Get in Touch
          </a>
        </motion.div>
      </div>
    </section>
  );
}

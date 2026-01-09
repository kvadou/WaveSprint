import { Header } from '@/components/Header';
import { AnimatedBackground } from '@/components/AnimatedBackground';
import { IntakeWizard } from '@/components/IntakeWizard';
import { ProcessDemo } from '@/components/ProcessDemo';
import { Portfolio } from '@/components/Portfolio';
import { LiveExamples } from '@/components/LiveExamples';
import { Testimonials } from '@/components/Testimonials';
import { Pricing } from '@/components/Pricing';
import { MeetTheBuilder } from '@/components/MeetTheBuilder';
import { FAQ } from '@/components/FAQ';
import { ContactForm } from '@/components/ContactForm';
import { Footer } from '@/components/Footer';
import Link from 'next/link';
import { ArrowRight, Radio } from 'lucide-react';

export default function Home() {
  return (
    <>
      <Header />
      <main className="min-h-screen relative overflow-hidden">
        <AnimatedBackground />

        {/* Hero Section */}
        <section className="relative pt-32 lg:pt-40 pb-20 px-4 sm:px-6 lg:px-8">
          {/* Grid background */}
          <div className="absolute inset-0 grid-background opacity-30" />

          <div className="relative max-w-7xl mx-auto">
            <div className="text-center mb-16 lg:mb-20">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan/10 border border-cyan/20 mb-8">
                <div className="signal-dot" />
                <span className="text-sm font-medium text-cyan">
                  Now building MCPs
                </span>
              </div>

              {/* Headline */}
              <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold tracking-tight mb-6">
                <span className="text-text">From MVP to MCP</span>
                <br />
                <span className="gradient-text">
                  faster than ever.
                </span>
              </h1>

              {/* Subheadline */}
              <p className="text-lg sm:text-xl lg:text-2xl text-text-muted max-w-3xl mx-auto mb-6">
                Stop thinking small. Build the <span className="text-cyan font-semibold">Maximum Conceivable Product</span> using cutting-edge AI.
              </p>

              {/* MCP Explainer */}
              <p className="text-sm sm:text-base text-text-muted/70 max-w-2xl mx-auto mb-10">
                MCP: Not the stripped-down version — the ambitious one you actually wanted to build.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="#console"
                  className="group inline-flex items-center justify-center gap-2 px-8 py-4 bg-cyan text-background font-semibold text-lg rounded-xl hover:bg-cyan-400 transition-all shadow-glow-md hover:shadow-glow-lg"
                >
                  <Radio className="w-5 h-5" />
                  Build My MCP
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  href="#how-it-works"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 border border-white/10 text-text font-medium text-lg rounded-xl hover:border-cyan/30 hover:bg-cyan/5 transition-all"
                >
                  See How It Works
                </Link>
              </div>
            </div>

            {/* Intake Wizard Console */}
            <div id="console" className="scroll-mt-24">
              <IntakeWizard />
            </div>
          </div>

          {/* Decorative elements */}
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan/20 to-transparent" />
        </section>

        {/* Process Demo Section */}
        <ProcessDemo />

        {/* Portfolio Section */}
        <Portfolio />

        {/* Live Examples Section */}
        <LiveExamples />

        {/* Testimonials Section */}
        <Testimonials />

        {/* Pricing Section */}
        <Pricing />

        {/* Meet The Builder Section */}
        <MeetTheBuilder />

        {/* FAQ Section */}
        <FAQ />

        {/* Contact Section */}
        <section id="contact" className="section-container relative overflow-hidden bg-background-secondary/30">
          {/* Background */}
          <div className="absolute inset-0 grid-background opacity-20" />

          <div className="relative max-w-2xl mx-auto">
            {/* Section header */}
            <div className="text-center mb-12">
              <span className="inline-block px-4 py-1.5 rounded-full bg-cyan/10 border border-cyan/20 text-cyan text-sm font-medium mb-6">
                Get in Touch
              </span>
              <h2 className="section-title text-text mb-4">
                Ready to{' '}
                <span className="gradient-text">Build?</span>
              </h2>
              <p className="section-subtitle mx-auto text-center">
                Have questions? Want to discuss your project?
                <br />
                Send a message or book a call.
              </p>
            </div>

            {/* Contact form card */}
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-cyan/10 via-purple/10 to-pink/10 rounded-3xl blur-2xl opacity-40" />
              <div className="relative p-6 lg:p-8 rounded-2xl bg-background/60 backdrop-blur-xl border border-white/5">
                <ContactForm />
              </div>
            </div>

            {/* Alternative contact */}
            <div className="text-center mt-8">
              <p className="text-text-muted text-sm mb-3">
                Prefer to talk?
              </p>
              <a
                href="https://calendly.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-cyan hover:text-cyan-300 transition-colors font-medium"
              >
                Book a 15-minute call
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}

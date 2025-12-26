'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRight,
  ArrowLeft,
  Send,
  Loader2,
  Lightbulb,
  Building2,
  Clock,
  User,
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import { RequirementsChat } from './RequirementsChat';

type WizardData = {
  idea: string;
  industry: string;
  timeline: string;
  budget: string;
  name: string;
  email: string;
  company: string;
};

const industries = [
  { id: 'financial', label: 'Financial Services', icon: '💰' },
  { id: 'healthcare', label: 'Healthcare / Med Spa', icon: '🏥' },
  { id: 'franchise', label: 'Franchise Operations', icon: '🏪' },
  { id: 'agency', label: 'Agency / Consulting', icon: '📊' },
  { id: 'education', label: 'Education', icon: '📚' },
  { id: 'ecommerce', label: 'E-commerce', icon: '🛒' },
  { id: 'saas', label: 'SaaS Startup', icon: '☁️' },
  { id: 'internal', label: 'Internal Tools', icon: '🔧' },
  { id: 'other', label: 'Other', icon: '✨' },
];

const timelines = [
  { id: 'asap', label: 'ASAP - I need this yesterday', description: '24-48 hour MVP delivery' },
  { id: '1week', label: 'Within 1 week', description: 'MVP + initial refinements' },
  { id: '2weeks', label: '2-4 weeks', description: 'Full build with polish' },
  { id: 'flexible', label: 'Flexible timeline', description: 'Quality over speed' },
];

const budgets = [
  { id: 'mvp', label: '$1,500 - $2,500', description: '24-Hour MVP' },
  { id: 'finalize', label: '$2,500 - $4,000', description: 'MVP + Finalization' },
  { id: 'full', label: '$7,500 - $25,000', description: 'Full Production Build' },
  { id: 'enterprise', label: '$25,000+', description: 'Enterprise / Complex' },
];

const steps = [
  { id: 1, title: 'Your Idea', icon: Lightbulb },
  { id: 2, title: 'Industry', icon: Building2 },
  { id: 3, title: 'Timeline & Budget', icon: Clock },
  { id: 4, title: 'Contact', icon: User },
];

export function IntakeWizard() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [chatComplete, setChatComplete] = useState(false);
  const [data, setData] = useState<WizardData>({
    idea: '',
    industry: '',
    timeline: '',
    budget: '',
    name: '',
    email: '',
    company: '',
  });

  const updateData = (field: keyof WizardData, value: string) => {
    setData((prev) => ({ ...prev, [field]: value }));
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return data.idea.length >= 20;
      case 2:
        return data.industry !== '';
      case 3:
        return data.timeline !== '' && data.budget !== '';
      case 4:
        return data.name !== '' && data.email !== '' && data.email.includes('@');
      default:
        return false;
    }
  };

  const handleSubmit = async () => {
    if (!canProceed()) return;

    setIsSubmitting(true);

    // Try to submit to API, but proceed to chat regardless
    try {
      await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          company: data.company,
          industry: data.industry,
          problemDescription: `[Timeline: ${data.timeline}] [Budget: ${data.budget}]\n\n${data.idea}`,
        }),
      });
    } catch (error) {
      console.error('Error submitting to API:', error);
    }

    // Always proceed to chat for requirements gathering
    setIsSubmitted(true);
    setIsSubmitting(false);
  };

  const nextStep = () => {
    if (canProceed() && currentStep < 4) {
      setCurrentStep(currentStep + 1);
    } else if (currentStep === 4) {
      handleSubmit();
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Final completion state - after chat is done
  if (chatComplete) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative w-full max-w-4xl mx-auto"
      >
        <div className="relative rounded-2xl overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-cyan/10 via-purple/10 to-pink/10" />
          <div className="relative p-8 lg:p-12 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', delay: 0.2 }}
              className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-emerald-400 to-cyan flex items-center justify-center"
            >
              <CheckCircle2 className="w-10 h-10 text-background" />
            </motion.div>
            <h3 className="font-display text-3xl font-bold text-text mb-4">
              Requirements Captured!
            </h3>
            <p className="text-text-muted text-lg max-w-md mx-auto mb-6">
              We have everything we need to start your sprint. Check your email for the scope document within 2 hours.
            </p>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Sprint Build Starting Soon
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  // Requirements gathering chat - after initial form submission
  if (isSubmitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative w-full max-w-4xl mx-auto"
      >
        {/* Glow effect */}
        <div className="absolute -inset-4 bg-gradient-to-r from-purple/20 via-cyan/20 to-pink/20 rounded-3xl blur-2xl opacity-40" />

        <RequirementsChat
          initialData={data}
          onComplete={(messages) => {
            // Here you could save the conversation to a backend
            console.log('Chat completed with messages:', messages);
            setChatComplete(true);
          }}
        />
      </motion.div>
    );
  }

  return (
    <div className="relative w-full max-w-4xl mx-auto">
      {/* Glow effect */}
      <div className="absolute -inset-4 bg-gradient-to-r from-cyan/20 via-purple/20 to-pink/20 rounded-3xl blur-2xl opacity-40" />

      {/* Main container */}
      <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-background-secondary/50 backdrop-blur-xl">
        {/* Progress steps */}
        <div className="border-b border-white/5 p-4 lg:p-6">
          <div className="flex items-center justify-between max-w-2xl mx-auto">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                      currentStep >= step.id
                        ? 'bg-cyan text-background'
                        : 'bg-white/5 text-text-muted'
                    }`}
                  >
                    {currentStep > step.id ? (
                      <CheckCircle2 className="w-5 h-5" />
                    ) : (
                      <step.icon className="w-5 h-5" />
                    )}
                  </div>
                  <span
                    className={`mt-2 text-xs font-medium hidden sm:block ${
                      currentStep >= step.id ? 'text-text' : 'text-text-muted'
                    }`}
                  >
                    {step.title}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`w-12 sm:w-20 lg:w-32 h-px mx-2 transition-colors duration-300 ${
                      currentStep > step.id ? 'bg-cyan' : 'bg-white/10'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step content */}
        <div className="p-6 lg:p-8 min-h-[400px]">
          <AnimatePresence mode="wait">
            {/* Step 1: Idea */}
            {currentStep === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div className="text-center mb-8">
                  <h2 className="font-display text-2xl lg:text-3xl font-bold text-text mb-2">
                    Describe Your App Idea
                  </h2>
                  <p className="text-text-muted">
                    What problem does it solve? Who uses it? What should it do?
                  </p>
                </div>
                <div className="relative">
                  <textarea
                    value={data.idea}
                    onChange={(e) => updateData('idea', e.target.value)}
                    placeholder="Example: I need a scheduling app for my med spa. Front desk staff should be able to book appointments, send SMS reminders, and track no-shows. Clients should be able to book online and manage their own appointments..."
                    className="w-full h-48 lg:h-56 p-4 rounded-xl bg-background/50 border border-white/10 focus:border-cyan/50 focus:ring-2 focus:ring-cyan/20 text-text placeholder:text-text-muted/50 resize-none transition-all"
                  />
                  <div className="absolute bottom-4 right-4 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-cyan/50" />
                    <span className={`text-sm ${data.idea.length >= 20 ? 'text-cyan' : 'text-text-muted'}`}>
                      {data.idea.length} / 20+ characters
                    </span>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 2: Industry */}
            {currentStep === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div className="text-center mb-8">
                  <h2 className="font-display text-2xl lg:text-3xl font-bold text-text mb-2">
                    Select Your Industry
                  </h2>
                  <p className="text-text-muted">
                    This helps us understand your specific needs and compliance requirements.
                  </p>
                </div>
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                  {industries.map((industry) => (
                    <button
                      key={industry.id}
                      onClick={() => updateData('industry', industry.id)}
                      className={`p-4 rounded-xl border text-left transition-all duration-200 ${
                        data.industry === industry.id
                          ? 'border-cyan bg-cyan/10 shadow-glow-sm'
                          : 'border-white/10 bg-background/30 hover:border-white/20 hover:bg-background/50'
                      }`}
                    >
                      <span className="text-2xl mb-2 block">{industry.icon}</span>
                      <span className={`text-sm font-medium ${
                        data.industry === industry.id ? 'text-text' : 'text-text-muted'
                      }`}>
                        {industry.label}
                      </span>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Step 3: Timeline & Budget */}
            {currentStep === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-8"
              >
                <div className="text-center mb-8">
                  <h2 className="font-display text-2xl lg:text-3xl font-bold text-text mb-2">
                    Timeline & Budget
                  </h2>
                  <p className="text-text-muted">
                    Help us understand your project scope.
                  </p>
                </div>

                {/* Timeline */}
                <div>
                  <h3 className="text-sm font-semibold text-text-muted uppercase tracking-wider mb-4">
                    When do you need this?
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {timelines.map((timeline) => (
                      <button
                        key={timeline.id}
                        onClick={() => updateData('timeline', timeline.id)}
                        className={`p-4 rounded-xl border text-left transition-all duration-200 ${
                          data.timeline === timeline.id
                            ? 'border-cyan bg-cyan/10 shadow-glow-sm'
                            : 'border-white/10 bg-background/30 hover:border-white/20'
                        }`}
                      >
                        <span className={`block font-medium mb-1 ${
                          data.timeline === timeline.id ? 'text-text' : 'text-text-muted'
                        }`}>
                          {timeline.label}
                        </span>
                        <span className="text-xs text-text-muted">{timeline.description}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Budget */}
                <div>
                  <h3 className="text-sm font-semibold text-text-muted uppercase tracking-wider mb-4">
                    Budget Range
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {budgets.map((budget) => (
                      <button
                        key={budget.id}
                        onClick={() => updateData('budget', budget.id)}
                        className={`p-4 rounded-xl border text-left transition-all duration-200 ${
                          data.budget === budget.id
                            ? 'border-purple bg-purple/10 shadow-glow-sm'
                            : 'border-white/10 bg-background/30 hover:border-white/20'
                        }`}
                      >
                        <span className={`block font-semibold mb-1 ${
                          data.budget === budget.id ? 'text-cyan' : 'text-text'
                        }`}>
                          {budget.label}
                        </span>
                        <span className="text-xs text-text-muted">{budget.description}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 4: Contact */}
            {currentStep === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div className="text-center mb-8">
                  <h2 className="font-display text-2xl lg:text-3xl font-bold text-text mb-2">
                    Almost There!
                  </h2>
                  <p className="text-text-muted">
                    Where should we send your MVP proposal?
                  </p>
                </div>
                <div className="max-w-md mx-auto space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-text-muted mb-2">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      value={data.name}
                      onChange={(e) => updateData('name', e.target.value)}
                      placeholder="John Smith"
                      className="w-full px-4 py-3 rounded-xl bg-background/50 border border-white/10 focus:border-cyan/50 focus:ring-2 focus:ring-cyan/20 text-text placeholder:text-text-muted/50 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-muted mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      value={data.email}
                      onChange={(e) => updateData('email', e.target.value)}
                      placeholder="john@company.com"
                      className="w-full px-4 py-3 rounded-xl bg-background/50 border border-white/10 focus:border-cyan/50 focus:ring-2 focus:ring-cyan/20 text-text placeholder:text-text-muted/50 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-muted mb-2">
                      Company <span className="text-text-muted/50">(optional)</span>
                    </label>
                    <input
                      type="text"
                      value={data.company}
                      onChange={(e) => updateData('company', e.target.value)}
                      placeholder="Acme Inc."
                      className="w-full px-4 py-3 rounded-xl bg-background/50 border border-white/10 focus:border-cyan/50 focus:ring-2 focus:ring-cyan/20 text-text placeholder:text-text-muted/50 transition-all"
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Navigation */}
        <div className="border-t border-white/5 p-4 lg:p-6 flex items-center justify-between">
          <button
            onClick={prevStep}
            disabled={currentStep === 1}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
              currentStep === 1
                ? 'text-text-muted/30 cursor-not-allowed'
                : 'text-text-muted hover:text-text hover:bg-white/5'
            }`}
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>

          <button
            onClick={nextStep}
            disabled={!canProceed() || isSubmitting}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${
              canProceed() && !isSubmitting
                ? 'bg-cyan text-background hover:bg-cyan-400 shadow-glow-sm hover:shadow-glow-md'
                : 'bg-white/5 text-text-muted cursor-not-allowed'
            }`}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Transmitting...
              </>
            ) : currentStep === 4 ? (
              <>
                <Send className="w-4 h-4" />
                Submit Project
              </>
            ) : (
              <>
                Continue
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

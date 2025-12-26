'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Radio, Cpu, Zap, Rocket, ArrowRight, CheckCircle2 } from 'lucide-react';

const steps = [
  {
    id: 1,
    icon: Radio,
    title: 'Transmit Signal',
    description: 'You describe your app idea',
    duration: '5 minutes',
    color: 'cyan',
  },
  {
    id: 2,
    icon: Cpu,
    title: 'Process & Clarify',
    description: 'AI-assisted requirements gathering',
    duration: '30 minutes',
    color: 'purple',
  },
  {
    id: 3,
    icon: Zap,
    title: 'Sprint Build',
    description: 'Rapid development begins',
    duration: '24 hours',
    color: 'pink',
  },
  {
    id: 4,
    icon: Rocket,
    title: 'MVP Delivered',
    description: 'Working app in your hands',
    duration: 'Done!',
    color: 'emerald',
  },
];

export function ProcessDemo() {
  const [activeStep, setActiveStep] = useState(0);
  const [isAnimating, setIsAnimating] = useState(true);

  useEffect(() => {
    if (!isAnimating) return;

    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % 4);
    }, 2500);

    return () => clearInterval(interval);
  }, [isAnimating]);

  const getColorClasses = (color: string, isActive: boolean) => {
    const colors: Record<string, { bg: string; text: string; border: string; glow: string }> = {
      cyan: {
        bg: isActive ? 'bg-cyan' : 'bg-cyan/20',
        text: isActive ? 'text-background' : 'text-cyan',
        border: 'border-cyan/30',
        glow: 'shadow-[0_0_30px_rgba(34,211,238,0.3)]',
      },
      purple: {
        bg: isActive ? 'bg-purple' : 'bg-purple/20',
        text: isActive ? 'text-background' : 'text-purple',
        border: 'border-purple/30',
        glow: 'shadow-[0_0_30px_rgba(139,92,246,0.3)]',
      },
      pink: {
        bg: isActive ? 'bg-pink' : 'bg-pink/20',
        text: isActive ? 'text-background' : 'text-pink',
        border: 'border-pink/30',
        glow: 'shadow-[0_0_30px_rgba(236,72,153,0.3)]',
      },
      emerald: {
        bg: isActive ? 'bg-emerald-500' : 'bg-emerald-500/20',
        text: isActive ? 'text-background' : 'text-emerald-400',
        border: 'border-emerald-500/30',
        glow: 'shadow-[0_0_30px_rgba(16,185,129,0.3)]',
      },
    };
    return colors[color] || colors.cyan;
  };

  return (
    <section id="how-it-works" className="section-container relative overflow-hidden">
      {/* Background animation */}
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px]">
          <div className="absolute inset-0 bg-gradient-radial from-cyan/5 via-transparent to-transparent animate-pulse" />
        </div>
      </div>

      <div className="relative max-w-6xl mx-auto">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-20"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-cyan/10 border border-cyan/20 text-cyan text-sm font-medium mb-6">
            The Process
          </span>
          <h2 className="section-title text-text mb-4">
            From Idea to{' '}
            <span className="gradient-text">Working App</span>
          </h2>
          <p className="section-subtitle mx-auto text-center">
            Watch your concept transform into reality in real-time.
          </p>
        </motion.div>

        {/* Process visualization */}
        <div className="relative">
          {/* Connection line */}
          <div className="hidden lg:block absolute top-16 left-[10%] right-[10%] h-0.5">
            <div className="h-full bg-white/5 rounded-full" />
            <motion.div
              className="absolute top-0 h-full bg-gradient-to-r from-cyan via-purple to-pink rounded-full"
              initial={{ width: '0%' }}
              animate={{ width: `${(activeStep / 3) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>

          {/* Steps */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-4">
            {steps.map((step, index) => {
              const isActive = index === activeStep;
              const isPast = index < activeStep;
              const colors = getColorClasses(step.color, isActive);

              return (
                <motion.div
                  key={step.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => {
                    setActiveStep(index);
                    setIsAnimating(false);
                  }}
                  className="cursor-pointer"
                >
                  <div
                    className={`relative p-6 rounded-2xl border transition-all duration-500 ${
                      isActive
                        ? `${colors.border} ${colors.glow} bg-background/80`
                        : 'border-white/5 bg-background/40 hover:border-white/10'
                    }`}
                  >
                    {/* Step number */}
                    <div className="absolute -top-3 -right-3">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                          isPast
                            ? 'bg-emerald-500 text-background'
                            : isActive
                            ? `${colors.bg} ${colors.text}`
                            : 'bg-white/5 text-text-muted'
                        }`}
                      >
                        {isPast ? <CheckCircle2 className="w-4 h-4" /> : step.id}
                      </div>
                    </div>

                    {/* Icon */}
                    <div
                      className={`w-14 h-14 rounded-xl flex items-center justify-center mb-4 transition-all ${colors.bg}`}
                    >
                      <step.icon className={`w-7 h-7 ${colors.text}`} />
                    </div>

                    {/* Content */}
                    <h3
                      className={`font-display text-lg font-bold mb-1 transition-colors ${
                        isActive ? 'text-text' : 'text-text-muted'
                      }`}
                    >
                      {step.title}
                    </h3>
                    <p className="text-sm text-text-muted mb-3">
                      {step.description}
                    </p>

                    {/* Duration badge */}
                    <div
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                        isActive
                          ? `${colors.bg} ${colors.text}`
                          : 'bg-white/5 text-text-muted'
                      }`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-current animate-pulse' : 'bg-current/50'}`} />
                      {step.duration}
                    </div>

                    {/* Signal pulse for active step */}
                    {isActive && (
                      <motion.div
                        initial={{ scale: 1, opacity: 0.5 }}
                        animate={{ scale: 2, opacity: 0 }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                        className={`absolute inset-0 rounded-2xl ${colors.border}`}
                      />
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Arrow indicators for desktop */}
          <div className="hidden lg:flex absolute top-16 left-0 right-0 justify-around px-[15%]">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0.3 }}
                animate={{ opacity: i < activeStep ? 1 : 0.3 }}
                className="text-white/20"
              >
                <ArrowRight className="w-5 h-5" />
              </motion.div>
            ))}
          </div>
        </div>

        {/* Data stream animation */}
        <div className="mt-16 relative h-1 overflow-hidden rounded-full bg-white/5">
          <motion.div
            className="absolute inset-y-0 w-32 bg-gradient-to-r from-transparent via-cyan to-transparent"
            animate={{ x: ['-100%', '400%'] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
          />
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="text-center mt-12"
        >
          <a
            href="#console"
            className="inline-flex items-center gap-2 px-8 py-4 bg-cyan text-background font-semibold rounded-xl hover:bg-cyan-400 transition-all shadow-glow-md hover:shadow-glow-lg"
          >
            <Radio className="w-5 h-5" />
            Start Transmitting
          </a>
        </motion.div>
      </div>
    </section>
  );
}

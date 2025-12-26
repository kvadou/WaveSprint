'use client';

import { motion } from 'framer-motion';
import { Check, Zap, Rocket, Building2, RefreshCw, ArrowRight } from 'lucide-react';

const tiers = [
  {
    id: 'mvp',
    name: '24-Hour MVP',
    price: '$1,500',
    priceRange: '$1,500 – $2,500',
    description: 'Rapid prototype of your core concept',
    icon: Zap,
    color: 'cyan',
    popular: false,
    features: [
      'Working prototype in 24 hours',
      'Core functionality implemented',
      'Basic UI/UX design',
      'Cloud deployment included',
      '1 round of revisions',
      'Source code ownership',
    ],
    cta: 'Start MVP',
  },
  {
    id: 'finalize',
    name: 'Finalization Sprint',
    price: '$2,500',
    priceRange: '$2,500 – $4,000',
    description: '1–2 weeks of refinement and polish',
    icon: Rocket,
    color: 'purple',
    popular: true,
    features: [
      'Everything in 24-Hour MVP',
      'Full feature completion',
      'Polished UI/UX design',
      'User authentication',
      'Database optimization',
      'Multiple revision rounds',
      'Documentation included',
    ],
    cta: 'Get Started',
  },
  {
    id: 'full',
    name: 'Full Production',
    price: '$7,500',
    priceRange: '$7,500 – $25,000',
    description: 'Complete, scalable production app',
    icon: Building2,
    color: 'pink',
    popular: false,
    features: [
      'Everything in Finalization',
      'Production-grade architecture',
      'Advanced integrations',
      'Admin dashboard',
      'Analytics & monitoring',
      'Performance optimization',
      'Security hardening',
      '30 days support included',
    ],
    cta: 'Contact Us',
  },
  {
    id: 'maintenance',
    name: 'Maintenance & Ops',
    price: '$399',
    priceRange: '$399 – $1,499/mo',
    description: 'Ongoing support and updates',
    icon: RefreshCw,
    color: 'emerald',
    popular: false,
    features: [
      'Priority bug fixes',
      'Feature updates',
      'Performance monitoring',
      'Security patches',
      'Uptime guarantee',
      'Direct communication',
    ],
    cta: 'Learn More',
    isMonthly: true,
  },
];

const getColorClasses = (color: string) => {
  const colors: Record<string, { bg: string; border: string; text: string; glow: string }> = {
    cyan: {
      bg: 'bg-cyan',
      border: 'border-cyan/30',
      text: 'text-cyan',
      glow: 'shadow-[0_0_40px_rgba(34,211,238,0.15)]',
    },
    purple: {
      bg: 'bg-purple',
      border: 'border-purple/30',
      text: 'text-purple',
      glow: 'shadow-[0_0_40px_rgba(139,92,246,0.15)]',
    },
    pink: {
      bg: 'bg-pink',
      border: 'border-pink/30',
      text: 'text-pink',
      glow: 'shadow-[0_0_40px_rgba(236,72,153,0.15)]',
    },
    emerald: {
      bg: 'bg-emerald-500',
      border: 'border-emerald-500/30',
      text: 'text-emerald-400',
      glow: 'shadow-[0_0_40px_rgba(16,185,129,0.15)]',
    },
  };
  return colors[color] || colors.cyan;
};

export function Pricing() {
  return (
    <section id="pricing" className="section-container relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background-secondary/30 to-background" />

      <div className="relative max-w-7xl mx-auto">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-purple/10 border border-purple/20 text-purple text-sm font-medium mb-6">
            Pricing
          </span>
          <h2 className="section-title text-text mb-4">
            Transparent{' '}
            <span className="gradient-text">Pricing</span>
          </h2>
          <p className="section-subtitle mx-auto text-center">
            No hidden fees. No surprises. Pick what fits your needs.
          </p>
        </motion.div>

        {/* Pricing grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {tiers.map((tier, index) => {
            const colors = getColorClasses(tier.color);

            return (
              <motion.div
                key={tier.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={`relative ${tier.popular ? 'lg:-mt-4 lg:mb-4' : ''}`}
              >
                {/* Popular badge */}
                {tier.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                    <span className="px-3 py-1 text-xs font-semibold bg-gradient-to-r from-cyan to-purple text-background rounded-full">
                      Most Popular
                    </span>
                  </div>
                )}

                <div
                  className={`h-full p-6 rounded-2xl border transition-all duration-300 ${
                    tier.popular
                      ? `${colors.border} ${colors.glow} bg-background/80`
                      : 'border-white/5 bg-background/40 hover:border-white/10'
                  }`}
                >
                  {/* Icon */}
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${colors.bg}`}
                  >
                    <tier.icon className="w-6 h-6 text-background" />
                  </div>

                  {/* Name & Description */}
                  <h3 className="font-display text-xl font-bold text-text mb-1">
                    {tier.name}
                  </h3>
                  <p className="text-sm text-text-muted mb-4">
                    {tier.description}
                  </p>

                  {/* Price */}
                  <div className="mb-6">
                    <span className={`text-3xl font-display font-bold ${colors.text}`}>
                      {tier.price}
                    </span>
                    {tier.isMonthly && (
                      <span className="text-text-muted text-sm">/mo</span>
                    )}
                    <div className="text-xs text-text-muted mt-1">
                      {tier.priceRange}
                    </div>
                  </div>

                  {/* Features */}
                  <ul className="space-y-3 mb-6">
                    {tier.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2">
                        <Check className={`w-4 h-4 mt-0.5 flex-shrink-0 ${colors.text}`} />
                        <span className="text-sm text-text-muted">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA */}
                  <a
                    href="#console"
                    className={`w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-semibold transition-all ${
                      tier.popular
                        ? `${colors.bg} text-background hover:opacity-90`
                        : 'border border-white/10 text-text hover:border-cyan/30 hover:bg-cyan/5'
                    }`}
                  >
                    {tier.cta}
                    <ArrowRight className="w-4 h-4" />
                  </a>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom note */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="text-center text-text-muted text-sm mt-12"
        >
          All prices are starting points. Final quote depends on project complexity.
          <br />
          Not sure which tier? <a href="#contact" className="text-cyan hover:underline">Let&apos;s chat</a> and figure it out together.
        </motion.p>
      </div>
    </section>
  );
}

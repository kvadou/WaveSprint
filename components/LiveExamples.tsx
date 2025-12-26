'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, ExternalLink, Monitor, Smartphone, Code2 } from 'lucide-react';

const demos = [
  {
    id: 'scheduling',
    title: 'Appointment Scheduler',
    description: 'Full booking system with calendar, SMS reminders, and payments',
    videoUrl: '#', // Placeholder for video embed
    liveUrl: '#',
    industry: 'Healthcare',
    buildTime: '18 hours',
    features: ['Online booking', 'Calendar sync', 'SMS/Email reminders', 'Stripe payments'],
  },
  {
    id: 'dashboard',
    title: 'Operations Dashboard',
    description: 'Real-time KPIs, team management, and reporting',
    videoUrl: '#',
    liveUrl: '#',
    industry: 'Franchise',
    buildTime: '24 hours',
    features: ['Live metrics', 'Multi-location', 'Role-based access', 'Export reports'],
  },
  {
    id: 'crm',
    title: 'Sales CRM',
    description: 'Lead tracking, pipeline management, and automation',
    videoUrl: '#',
    liveUrl: '#',
    industry: 'B2B Sales',
    buildTime: '22 hours',
    features: ['Lead scoring', 'Email sequences', 'Deal pipeline', 'Activity tracking'],
  },
];

export function LiveExamples() {
  const [activeDemo, setActiveDemo] = useState(demos[0]);
  const [viewMode, setViewMode] = useState<'desktop' | 'mobile'>('desktop');

  return (
    <section className="section-container relative overflow-hidden bg-background-secondary/30">
      {/* Background pattern */}
      <div className="absolute inset-0 grid-background opacity-20" />

      <div className="relative max-w-7xl mx-auto">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium mb-6">
            Live Demos
          </span>
          <h2 className="section-title text-text mb-4">
            See It{' '}
            <span className="gradient-text">In Action</span>
          </h2>
          <p className="section-subtitle mx-auto text-center">
            Interactive demos of actual MVPs. Click around, explore the features.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Demo selector */}
          <div className="space-y-3">
            {demos.map((demo) => (
              <motion.button
                key={demo.id}
                onClick={() => setActiveDemo(demo)}
                whileHover={{ x: 4 }}
                className={`w-full p-4 rounded-xl border text-left transition-all ${
                  activeDemo.id === demo.id
                    ? 'border-cyan/30 bg-cyan/5 shadow-glow-sm'
                    : 'border-white/5 bg-background/40 hover:border-white/10'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      activeDemo.id === demo.id
                        ? 'bg-cyan text-background'
                        : 'bg-white/5 text-text-muted'
                    }`}
                  >
                    <Code2 className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3
                      className={`font-semibold mb-1 ${
                        activeDemo.id === demo.id ? 'text-text' : 'text-text-muted'
                      }`}
                    >
                      {demo.title}
                    </h3>
                    <p className="text-sm text-text-muted truncate">
                      {demo.description}
                    </p>
                    <div className="flex items-center gap-3 mt-2">
                      <span className="text-xs text-cyan">{demo.industry}</span>
                      <span className="text-xs text-text-muted">
                        Built in {demo.buildTime}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.button>
            ))}
          </div>

          {/* Demo viewer */}
          <div className="lg:col-span-2">
            <motion.div
              key={activeDemo.id}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="relative"
            >
              {/* Browser chrome */}
              <div className="rounded-t-xl bg-background-secondary border border-white/10 border-b-0 p-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-pink/60" />
                    <div className="w-3 h-3 rounded-full bg-amber-400/60" />
                    <div className="w-3 h-3 rounded-full bg-emerald-400/60" />
                  </div>
                  <div className="flex-1 mx-4">
                    <div className="h-7 rounded-md bg-background/50 flex items-center justify-center px-3">
                      <span className="text-xs text-text-muted truncate">
                        demo.wavesprint.ai/{activeDemo.id}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setViewMode('desktop')}
                      className={`p-1.5 rounded ${
                        viewMode === 'desktop'
                          ? 'bg-cyan/20 text-cyan'
                          : 'text-text-muted hover:text-text'
                      }`}
                    >
                      <Monitor className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setViewMode('mobile')}
                      className={`p-1.5 rounded ${
                        viewMode === 'mobile'
                          ? 'bg-cyan/20 text-cyan'
                          : 'text-text-muted hover:text-text'
                      }`}
                    >
                      <Smartphone className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Demo viewport */}
              <div
                className={`relative rounded-b-xl border border-t-0 border-white/10 overflow-hidden transition-all duration-300 ${
                  viewMode === 'mobile' ? 'max-w-[375px] mx-auto' : ''
                }`}
              >
                <div className="aspect-video bg-gradient-to-br from-background to-background-secondary flex items-center justify-center">
                  {/* Placeholder for video/iframe */}
                  <div className="text-center">
                    <button className="group relative">
                      <div className="w-20 h-20 rounded-full bg-cyan/10 flex items-center justify-center mb-4 group-hover:bg-cyan/20 transition-colors">
                        <Play className="w-8 h-8 text-cyan ml-1" />
                      </div>
                      <div className="absolute inset-0 rounded-full animate-ping bg-cyan/20" />
                    </button>
                    <p className="text-text-muted text-sm">
                      Click to watch demo
                    </p>
                    <p className="text-text-muted/50 text-xs mt-1">
                      (Video embed placeholder)
                    </p>
                  </div>
                </div>
              </div>

              {/* Feature tags */}
              <div className="mt-4 flex flex-wrap gap-2">
                {activeDemo.features.map((feature) => (
                  <span
                    key={feature}
                    className="px-3 py-1.5 text-sm bg-white/5 border border-white/10 rounded-lg text-text-muted"
                  >
                    {feature}
                  </span>
                ))}
              </div>

              {/* Actions */}
              <div className="mt-6 flex items-center gap-4">
                <a
                  href={activeDemo.liveUrl}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-cyan text-background font-semibold rounded-lg hover:bg-cyan-400 transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  Try Live Demo
                </a>
                <a
                  href="#console"
                  className="inline-flex items-center gap-2 px-5 py-2.5 border border-white/10 text-text-muted font-medium rounded-lg hover:border-cyan/30 hover:text-text transition-all"
                >
                  Build Something Like This
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

'use client';

import { motion } from 'framer-motion';
import { ExternalLink, Clock, Layers, ArrowUpRight } from 'lucide-react';

const projects = [
  {
    id: 1,
    title: 'MedBooker Pro',
    category: 'Healthcare',
    description: 'Complete appointment scheduling system for a multi-location med spa chain. Includes online booking, SMS reminders, and staff management.',
    image: '/portfolio/medbooker.png',
    placeholder: 'bg-gradient-to-br from-emerald-500/20 to-cyan-500/20',
    tech: ['Next.js', 'PostgreSQL', 'Twilio', 'Stripe'],
    timeline: '24 hours MVP → 2 weeks full build',
    metrics: '40% reduction in no-shows',
    link: '#',
  },
  {
    id: 2,
    title: 'FranchiseHub',
    category: 'Franchise Operations',
    description: 'Centralized dashboard for franchise operators to monitor P&L, scheduling, and performance across 12 locations in real-time.',
    image: '/portfolio/franchisehub.png',
    placeholder: 'bg-gradient-to-br from-purple-500/20 to-pink-500/20',
    tech: ['React', 'Node.js', 'Redis', 'Chart.js'],
    timeline: '48 hours MVP → 3 weeks full build',
    metrics: 'Managing $3M+ revenue',
    link: '#',
  },
  {
    id: 3,
    title: 'LeadFlow CRM',
    category: 'Sales Automation',
    description: 'Custom CRM with automated lead scoring, email sequences, and pipeline visualization for a B2B sales team of 25.',
    image: '/portfolio/leadflow.png',
    placeholder: 'bg-gradient-to-br from-amber-500/20 to-orange-500/20',
    tech: ['Vue.js', 'Supabase', 'Resend', 'OpenAI'],
    timeline: '36 hours MVP → 10 days full build',
    metrics: '2x conversion rate',
    link: '#',
  },
  {
    id: 4,
    title: 'TutorMatch',
    category: 'Education',
    description: 'Two-sided marketplace connecting tutors with students. Includes video calls, scheduling, payments, and progress tracking.',
    image: '/portfolio/tutormatch.png',
    placeholder: 'bg-gradient-to-br from-blue-500/20 to-indigo-500/20',
    tech: ['Next.js', 'Prisma', 'Stripe Connect', 'Daily.co'],
    timeline: '24 hours MVP → 4 weeks full build',
    metrics: '500+ active users',
    link: '#',
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: 'easeOut',
    },
  },
};

export function Portfolio() {
  return (
    <section id="portfolio" className="section-container relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 grid-background opacity-50" />
      <div className="absolute top-1/4 -right-48 w-96 h-96 bg-purple/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 -left-48 w-96 h-96 bg-cyan/10 rounded-full blur-3xl" />

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
            Recent Work
          </span>
          <h2 className="section-title text-text mb-4">
            Built in Days,{' '}
            <span className="gradient-text">Not Months</span>
          </h2>
          <p className="section-subtitle mx-auto text-center">
            Real projects delivered to real clients. From concept to production-ready app.
          </p>
        </motion.div>

        {/* Projects grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="grid md:grid-cols-2 gap-6 lg:gap-8"
        >
          {projects.map((project) => (
            <motion.div
              key={project.id}
              variants={itemVariants}
              className="group relative"
            >
              <div className="feature-card h-full flex flex-col">
                {/* Image placeholder */}
                <div className={`relative h-48 lg:h-56 rounded-xl overflow-hidden mb-6 ${project.placeholder}`}>
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />

                  {/* Fake browser chrome */}
                  <div className="absolute top-3 left-3 flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-pink/60" />
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-400/60" />
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-400/60" />
                  </div>

                  {/* Project title overlay */}
                  <div className="absolute bottom-4 left-4 right-4">
                    <span className="text-xs font-medium text-cyan uppercase tracking-wider">
                      {project.category}
                    </span>
                    <h3 className="font-display text-2xl font-bold text-text mt-1">
                      {project.title}
                    </h3>
                  </div>

                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-cyan/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <div className="p-3 rounded-full bg-background/80 backdrop-blur-sm border border-white/10">
                      <ArrowUpRight className="w-5 h-5 text-cyan" />
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 flex flex-col">
                  <p className="text-text-muted mb-4 flex-1">
                    {project.description}
                  </p>

                  {/* Tech stack */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.tech.map((tech) => (
                      <span
                        key={tech}
                        className="px-2.5 py-1 text-xs font-medium bg-white/5 border border-white/10 rounded-md text-text-muted"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  {/* Metrics */}
                  <div className="flex items-center justify-between pt-4 border-t border-white/5">
                    <div className="flex items-center gap-2 text-sm text-text-muted">
                      <Clock className="w-4 h-4 text-cyan" />
                      <span>{project.timeline}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Layers className="w-4 h-4 text-purple" />
                      <span className="text-purple font-medium">{project.metrics}</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="text-center mt-12"
        >
          <a
            href="#console"
            className="inline-flex items-center gap-2 px-6 py-3 bg-transparent border border-cyan/30 text-cyan rounded-lg font-medium hover:bg-cyan/10 hover:border-cyan/60 transition-all"
          >
            <span>Start Your Project</span>
            <ExternalLink className="w-4 h-4" />
          </a>
        </motion.div>
      </div>
    </section>
  );
}

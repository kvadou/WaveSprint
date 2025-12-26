'use client';

import { motion } from 'framer-motion';
import { Code2, Briefcase, Rocket, Award, ArrowRight, Linkedin, Twitter, Github } from 'lucide-react';

const credentials = [
  {
    icon: Briefcase,
    title: '15+ Years',
    description: 'Building software products',
  },
  {
    icon: Code2,
    title: 'Full-Stack',
    description: 'From database to deployment',
  },
  {
    icon: Rocket,
    title: '50+ Apps',
    description: 'Shipped to production',
  },
  {
    icon: Award,
    title: 'Ex-FAANG',
    description: 'Enterprise experience',
  },
];

const techStack = [
  'React', 'Next.js', 'Node.js', 'TypeScript',
  'PostgreSQL', 'Prisma', 'Tailwind', 'AWS',
  'Stripe', 'OpenAI', 'Vercel', 'Supabase',
];

export function MeetTheBuilder() {
  return (
    <section className="section-container relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background-secondary/50 to-background" />

      <div className="relative max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Image/Visual side */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            {/* Photo placeholder */}
            <div className="relative aspect-square max-w-md mx-auto lg:mx-0">
              {/* Decorative elements */}
              <div className="absolute -inset-4 bg-gradient-to-br from-cyan/20 via-purple/20 to-pink/20 rounded-3xl blur-2xl opacity-40" />

              <div className="relative h-full rounded-2xl overflow-hidden border border-white/10 bg-gradient-to-br from-background-secondary to-background">
                {/* Placeholder visual */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-32 h-32 mx-auto rounded-full bg-gradient-to-br from-cyan to-purple flex items-center justify-center mb-4">
                      <Code2 className="w-16 h-16 text-background" />
                    </div>
                    <p className="text-text-muted text-sm">
                      [Your Photo Here]
                    </p>
                  </div>
                </div>

                {/* Grid overlay */}
                <div className="absolute inset-0 grid-background opacity-30" />

                {/* Corner accents */}
                <div className="absolute top-4 left-4 w-8 h-8 border-l-2 border-t-2 border-cyan/30" />
                <div className="absolute bottom-4 right-4 w-8 h-8 border-r-2 border-b-2 border-purple/30" />
              </div>

              {/* Floating badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="absolute -bottom-4 -right-4 lg:bottom-8 lg:-right-8"
              >
                <div className="px-4 py-2 rounded-xl bg-background border border-cyan/30 shadow-glow-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-sm font-medium text-text">
                      Available for projects
                    </span>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Content side */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-pink/10 border border-pink/20 text-pink text-sm font-medium mb-6">
              About
            </span>

            <h2 className="section-title text-text mb-6">
              Meet Your{' '}
              <span className="gradient-text">Builder</span>
            </h2>

            <div className="space-y-4 text-text-muted leading-relaxed mb-8">
              <p>
                I&apos;m a full-stack developer who&apos;s spent 15 years in the trenches—from startups to enterprise, from prototype to scale.
              </p>
              <p>
                WaveSprint exists because I got tired of watching businesses wait months and pay fortunes for apps that should take days. Modern tools and AI have changed the game. I&apos;m here to give you the unfair advantage.
              </p>
              <p className="text-text font-medium">
                You bring the idea. I bring the speed.
              </p>
            </div>

            {/* Credentials grid */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              {credentials.map((cred, index) => (
                <motion.div
                  key={cred.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="p-4 rounded-xl bg-background/50 border border-white/5 hover:border-cyan/20 transition-colors"
                >
                  <cred.icon className="w-5 h-5 text-cyan mb-2" />
                  <div className="font-display font-bold text-text">
                    {cred.title}
                  </div>
                  <div className="text-sm text-text-muted">
                    {cred.description}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Tech stack */}
            <div className="mb-8">
              <h3 className="text-sm font-semibold text-text-muted uppercase tracking-wider mb-3">
                Tech Stack
              </h3>
              <div className="flex flex-wrap gap-2">
                {techStack.map((tech) => (
                  <span
                    key={tech}
                    className="px-3 py-1.5 text-sm bg-white/5 border border-white/10 rounded-lg text-text-muted hover:text-text hover:border-cyan/30 transition-colors"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* Social links */}
            <div className="flex items-center gap-4">
              <a
                href="#"
                className="p-2 rounded-lg bg-white/5 text-text-muted hover:text-cyan hover:bg-cyan/10 transition-all"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="p-2 rounded-lg bg-white/5 text-text-muted hover:text-cyan hover:bg-cyan/10 transition-all"
                aria-label="Twitter"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="p-2 rounded-lg bg-white/5 text-text-muted hover:text-cyan hover:bg-cyan/10 transition-all"
                aria-label="GitHub"
              >
                <Github className="w-5 h-5" />
              </a>

              <div className="flex-1" />

              <a
                href="#console"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-cyan text-background font-semibold rounded-lg hover:bg-cyan-400 transition-colors"
              >
                Let&apos;s Build
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

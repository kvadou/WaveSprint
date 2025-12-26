'use client';

import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';

const testimonials = [
  {
    id: 1,
    quote: "I described my scheduling nightmare at 9am, and by 5pm I had a working prototype. By the end of the week, we were live. This completely changed how I think about building software.",
    author: 'Dr. Sarah Chen',
    title: 'Owner',
    company: 'Glow Medical Spa',
    avatar: null,
    rating: 5,
    highlight: '8 hours to MVP',
  },
  {
    id: 2,
    quote: "We'd been quoted $80k and 6 months by traditional agencies. WaveSprint delivered a better product in 3 weeks for a fraction of the cost. The speed is real.",
    author: 'Marcus Rodriguez',
    title: 'COO',
    company: 'FastFit Franchises',
    avatar: null,
    rating: 5,
    highlight: '90% cost savings',
  },
  {
    id: 3,
    quote: "Finally, someone who speaks business, not just code. They understood our workflow problems immediately and built exactly what we needed—nothing more, nothing less.",
    author: 'Jennifer Park',
    title: 'Director of Operations',
    company: 'Elevate Education',
    avatar: null,
    rating: 5,
    highlight: 'Perfect fit solution',
  },
];

export function Testimonials() {
  return (
    <section className="section-container relative overflow-hidden bg-background-secondary/30">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-cyan/20 to-transparent" />
        <div className="absolute top-0 right-1/4 w-px h-full bg-gradient-to-b from-transparent via-purple/20 to-transparent" />
      </div>

      <div className="relative max-w-7xl mx-auto">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-cyan/10 border border-cyan/20 text-cyan text-sm font-medium mb-6">
            Client Stories
          </span>
          <h2 className="section-title text-text mb-4">
            Trusted by{' '}
            <span className="gradient-text">Builders</span>
          </h2>
          <p className="section-subtitle mx-auto text-center">
            Real feedback from real projects. No fluff.
          </p>
        </motion.div>

        {/* Testimonials grid */}
        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="relative group"
            >
              <div className="h-full p-6 lg:p-8 rounded-2xl bg-background/60 backdrop-blur-sm border border-white/5 hover:border-cyan/20 transition-all duration-300">
                {/* Quote icon */}
                <div className="absolute -top-3 -left-3 w-10 h-10 rounded-full bg-gradient-to-br from-cyan to-purple flex items-center justify-center">
                  <Quote className="w-5 h-5 text-background" />
                </div>

                {/* Highlight badge */}
                <div className="mb-6">
                  <span className="inline-block px-3 py-1 rounded-full bg-cyan/10 text-cyan text-xs font-semibold">
                    {testimonial.highlight}
                  </span>
                </div>

                {/* Rating */}
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>

                {/* Quote */}
                <blockquote className="text-text/90 mb-6 leading-relaxed">
                  &ldquo;{testimonial.quote}&rdquo;
                </blockquote>

                {/* Author */}
                <div className="flex items-center gap-3 pt-6 border-t border-white/5">
                  {/* Avatar placeholder */}
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan/20 to-purple/20 flex items-center justify-center">
                    <span className="text-lg font-bold text-text">
                      {testimonial.author.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <div className="font-semibold text-text">
                      {testimonial.author}
                    </div>
                    <div className="text-sm text-text-muted">
                      {testimonial.title}, {testimonial.company}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Social proof bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="mt-16 pt-16 border-t border-white/5"
        >
          <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16">
            <div className="text-center">
              <div className="font-display text-4xl lg:text-5xl font-bold text-cyan mb-1">
                50+
              </div>
              <div className="text-text-muted text-sm">
                Projects Delivered
              </div>
            </div>
            <div className="hidden md:block w-px h-12 bg-white/10" />
            <div className="text-center">
              <div className="font-display text-4xl lg:text-5xl font-bold text-purple mb-1">
                24h
              </div>
              <div className="text-text-muted text-sm">
                Average MVP Time
              </div>
            </div>
            <div className="hidden md:block w-px h-12 bg-white/10" />
            <div className="text-center">
              <div className="font-display text-4xl lg:text-5xl font-bold text-pink mb-1">
                100%
              </div>
              <div className="text-text-muted text-sm">
                Satisfaction Rate
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

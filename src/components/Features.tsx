import React from 'react';
import { motion } from 'motion/react';
import { TrendingUp, Calendar } from 'lucide-react';
import { ScrollReveal } from './effects/ScrollReveal';
import { ScrambleText } from './effects/ScrambleText';
import PinnedImageReveal from './effects/PinnedImageReveal';

// Images for the four main zones
const zoneImages = [
  {
    imageUrl: 'https://images.unsplash.com/photo-1623679072629-3aaa0192a391?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBvZmZpY2UlMjB3b3Jrc3BhY2UlMjBkZXNrfGVufDF8fHx8MTc2NTgxNjg0Nnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    title: 'The Workspace',
    description: 'Master technical skills through coding challenges, bug hunting, and code completion quests. Build your professional expertise through hands-on practice and become a coding expert.',
    gradient: 'from-blue-500 to-cyan-500',
  },
  {
    imageUrl: 'https://images.unsplash.com/photo-1721838449374-722202a68197?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnYW1lJTIwbG91bmdlJTIwZW50ZXJ0YWlubWVudCUyMHJvb218ZW58MXx8fHwxNzY1ODk0ODE0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    title: 'The Game Lounge',
    description: 'Sharpen critical thinking with puzzles, mental math, and logic riddles. Take a break from work stress while building cognitive skills and recovering your mood.',
    gradient: 'from-purple-500 to-pink-500',
  },
  {
    imageUrl: 'https://images.unsplash.com/photo-1431540015161-0bf868a2d407?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMG1lZXRpbmclMjByb29tfGVufDF8fHx8MTc2NTg5NDgxNXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    title: 'The Meeting Room',
    description: 'Build soft skills through timed typing tests, grammar quizzes, and presentation challenges. Excel at communication and collaboration to advance your career.',
    gradient: 'from-green-500 to-emerald-500',
  },
  {
    imageUrl: 'https://images.unsplash.com/photo-1697369680853-ff5490b89008?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBjYWZldGVyaWElMjBjb2ZmZWV8ZW58MXx8fHwxNzY1ODk0ODE1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    title: 'The Cafeteria',
    description: 'Strategically invest in consumables and permanent buffs to optimize your performance. Manage resources wisely to gain competitive advantages and boost your stats.',
    gradient: 'from-yellow-500 to-orange-500',
  },
];

const additionalFeatures = [
  {
    icon: TrendingUp,
    title: 'Mood/Stress Balance',
    description: 'Navigate the dual-bar system - avoid burnout by maintaining work-life balance.',
    gradient: 'from-red-500 to-rose-500',
  },
  {
    icon: Calendar,
    title: 'Monthly Evaluation',
    description: 'Earn salary bonuses or face penalties based on your task completion and skill proficiency.',
    gradient: 'from-indigo-500 to-violet-500',
  },
];

export function Features() {
  return <section id="features" className="relative bg-black overflow-hidden">
      {/* Header Section */}
      <div className="relative py-32 px-6">
        {/* Background */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(59,130,246,0.1),transparent_50%),radial-gradient(circle_at_70%_50%,rgba(168,85,247,0.1),transparent_50%)]" />
        
        <div className="relative max-w-7xl mx-auto">
          <ScrollReveal direction="up">
            <div className="text-center mb-20">
              <h2 className="text-5xl md:text-7xl mb-6">
                <ScrambleText
                  text="Game Features"
                  className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent"
                  speed={60}
                  as="span"
                />
              </h2>
              <p className="text-xl text-gray-400 max-w-3xl mx-auto">
                Four unique zones and dynamic systems to master your career simulation
              </p>
            </div>
          </ScrollReveal>
        </div>
      </div>

      {/* Pinned Image Reveals for Main Zones */}
      {zoneImages.map((zone, index) => (
        <PinnedImageReveal
          key={index}
          imageUrl={zone.imageUrl}
          title={zone.title}
          description={zone.description}
          gradient={zone.gradient}
          reverse={index % 2 === 1}
        />
      ))}

      {/* Additional Features Grid */}
      <div className="relative py-32 px-6">
        {/* Background */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(239,68,68,0.1),transparent_50%),radial-gradient(circle_at_70%_50%,rgba(99,102,241,0.1),transparent_50%)]" />
        
        <div className="relative max-w-7xl mx-auto">
          <ScrollReveal direction="up">
            <div className="text-center mb-16">
              <h3 className="text-4xl md:text-5xl mb-4 bg-gradient-to-r from-red-400 to-indigo-400 bg-clip-text text-transparent">
                Core Systems
              </h3>
              <p className="text-lg text-gray-400 max-w-2xl mx-auto">
                Manage your performance and career progression
              </p>
            </div>
          </ScrollReveal>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {additionalFeatures.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -10, scale: 1.02 }}
                  className="group relative p-8 bg-gradient-to-br from-gray-900/50 to-gray-900/30 border border-gray-800 rounded-3xl backdrop-blur-sm hover:border-gray-700 transition-all duration-300"
                >
                  {/* Glow Effect */}
                  <div className={`absolute inset-0 bg-gradient-to-r ${feature.gradient} opacity-0 group-hover:opacity-10 rounded-3xl transition-opacity duration-300`} />
                  
                  {/* Icon */}
                  <div className={`w-14 h-14 mb-6 rounded-2xl bg-gradient-to-r ${feature.gradient} p-0.5`}>
                    <div className="w-full h-full bg-black rounded-2xl flex items-center justify-center">
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                  </div>

                  {/* Content */}
                  <h3 className="text-2xl mb-4">{feature.title}</h3>
                  <p className="text-gray-400">
                    {feature.description}
                  </p>

                  {/* Hover Indicator */}
                  <motion.div
                    className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${feature.gradient} rounded-b-3xl`}
                    initial={{ scaleX: 0 }}
                    whileHover={{ scaleX: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  ;
}

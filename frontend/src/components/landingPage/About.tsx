import { motion, useScroll, useTransform } from 'motion/react';
import { useRef } from 'react';
import { ScrollReveal } from '../effects/ScrollReveal';
import { ScrambleText } from '../effects/ScrambleText';
import { smoothScrollToElement } from '../../utils/smoothScroll';

export function About() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);

  const handleExploreFeatures = () => {
    smoothScrollToElement('features');
  };

  return (
    <section id="about" ref={ref} className="relative py-32 px-6 bg-black overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-blue-950/10 to-black" />

      {/* <motion.div 
        style={{ y }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-500/10 rounded-full blur-[100px]"
      /> */}

      <div className="relative max-w-7xl mx-auto">
        <motion.div
          style={{ opacity }}
          className="grid md:grid-cols-2 gap-16 items-center"
        >
          {/* Text Content */}
          <ScrollReveal direction="left">
            <div>
              <h2 className="text-5xl md:text-7xl mb-6">
                <ScrambleText
                  text="About Office"
                  className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"
                  speed={60}
                  as="span"
                />
              </h2>
              <p className="text-xl text-gray-300 mb-6">
                Office is an educational RPG that transforms career development into an engaging game experience with quests, skill progression, and strategic resource management.
              </p>
              <p className="text-lg text-gray-400 mb-8">
                Navigate the Workspace for technical challenges, recover in the Game Lounge, master soft skills in the Meeting Room, and strategically invest in the Cafeteria. Balance mood and stress while climbing the corporate ladder.
              </p>
              <div className="flex gap-4">
                <ScrollReveal direction="up" delay={0.2}>
                  <div className="flex-1 p-6 bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-2xl backdrop-blur-sm">
                    <div className="text-4xl mb-2">4</div>
                    <div className="text-gray-400">Office Zones</div>
                  </div>
                </ScrollReveal>
                <ScrollReveal direction="up" delay={0.4}>
                  <div className="flex-1 p-6 bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-2xl backdrop-blur-sm">
                    <div className="text-4xl mb-2">∞</div>
                    <div className="text-gray-400">Career Progression</div>
                  </div>
                </ScrollReveal>
              </div>
              <ScrollReveal direction="up" delay={0.6}>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="mt-8 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full hover:from-blue-400 hover:to-purple-400 transition-all duration-300 shadow-[0_0_30px_rgba(59,130,246,0.5)]"
                  onClick={handleExploreFeatures}
                >
                  Explore Features →
                </motion.button>
              </ScrollReveal>
            </div>
          </ScrollReveal>

          {/* Image/Visual */}
          <ScrollReveal direction="right">
            <div className="relative">
              <div className="relative aspect-square rounded-3xl overflow-hidden border border-blue-500/20">
                <img
                  src="https://images.unsplash.com/photo-1580046939256-c377c5b099f1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjeWJlciUyMHdhcnJpb3IlMjBjaGFyYWN0ZXJ8ZW58MXx8fHwxNzY1ODEwMTc4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                  alt="Gaming Character"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
              </div>

              {/* Floating Badge */}
              <motion.div
                animate={{
                  y: [0, -10, 0],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="absolute -top-6 -right-6 px-6 py-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl shadow-[0_0_30px_rgba(59,130,246,0.6)]"
              >
                <div className="text-2xl">⚡</div>
                <div className="text-sm">Generated by nano banana</div>
              </motion.div>
            </div>
          </ScrollReveal>
        </motion.div>
      </div>
    </section>
  );
}
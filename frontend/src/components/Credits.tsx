import React from 'react';
import { motion } from 'framer-motion';
import { Github, Twitter, Globe, Heart, Sparkles } from 'lucide-react';

const CREDIT_DATA = {
 team: [
    { role: 'Lead Architect', name: 'Pushkar Pan', social: '@myst_blazeio' },
    { role: 'Backend Developer', name: 'Devayudh Chatterjee', social: '@_raziel_206' },
    { role: 'Frontend Developer', name: 'Sayantan Pal', social: '@sayantanpaltheone' },
    { role: 'Designer', name: 'Anushka Bala', social: '@02_anu_anu_28' },
  ]
};

export function Credits() {
  return (
    <div id="credits" className="py-20 px-6 max-w-7xl mx-auto">
      <div className="text-center mb-20">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl md:text-6xl font-black mb-4 tracking-tighter"
        >
          SYSTEM CREDITS
        </motion.h2>
        <p className="text-blue-500 font-mono text-sm tracking-[0.3em] uppercase">
          The minds behind the machine
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-12 mb-32">
        {CREDIT_DATA.team.map((member, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.1 }}
            className="p-8 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 transition-colors group"
          >
            <span className="text-xs font-mono text-gray-500 uppercase tracking-widest mb-4 block">
              {member.role}
            </span>
            <h3 className="text-2xl font-bold mb-2 group-hover:text-blue-400 transition-colors">
              {member.name}
            </h3>
            <div className="flex gap-4 text-gray-500">
              <Github size={18} className="hover:text-white cursor-pointer" />
              <Twitter size={18} className="hover:text-white cursor-pointer" />
            </div>
          </motion.div>
        ))}
      </div>



      <div className="mt-32 text-center text-gray-600 font-mono text-[10px] tracking-[0.4em] uppercase">
        <div className="flex items-center justify-center gap-2 mb-2">
          Made with <Heart size={12} className="text-red-900 fill-red-900 animate-pulse" /> for the future
        </div>
        <p>© 2025 Office Interactive // All Protocols Active</p>
      </div>
    </div>
  );
}

export default Credits;
import { motion } from 'framer-motion';
import { Github, Instagram,} from 'lucide-react';

const CREDIT_DATA = {
  team: [
    { role: 'Lead Architect', name: 'Pushkar Pan', social: 'https://instagram.com/myst_blazeio', href: 'https://github.com/Myst-Blazeio' },
    { role: 'Backend Developer', name: 'Devayudh Chatterjee', social: 'https://instagram.com/_raziel_206', href: 'https://github.com/Raziel206' },
    { role: 'Frontend Developer', name: 'Sayantan Pal', social: 'https://instagram.com/sayantanpaltheone', href: 'https://github.com/sabkabap2006' },
    { role: 'Designer', name: 'Mahima Banerjee', social: 'https://instagram.com/_mahima.banerjee_', href: 'https://github.com/mahimaBanerjee' },
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
          GAME CREDITS
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
              <a
                href={member.href}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-colors"
              >
                <Github size={18} />
              </a>
              <a
                href={member.social}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-colors"
              >
                <Instagram size={18} />
              </a>
            </div>

          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default Credits;
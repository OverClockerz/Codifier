import { motion } from 'motion/react';
import { ArrowRight, Mail } from 'lucide-react';
import { useState } from 'react';

export function CallToAction() {
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Email submitted:', email);
    setEmail('');
  };

  return (
    <section id="contact" className="relative py-32 px-6 bg-black overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-linear-to-br from-blue-600/20 via-purple-600/20 to-pink-600/20" />
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-150 bg-blue-500/20 rounded-full blur-[100px]"
        />
      </div>

      <div className="relative max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="inline-block mb-8"
          >
            <span className="px-6 py-3 bg-linear-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 rounded-full text-blue-300 backdrop-blur-sm">
              🎮 Educational RPG Experience
            </span>
          </motion.div>

          {/* Heading */}
          <h2 className="text-5xl md:text-7xl mb-6 bg-linear-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Ready to Start Your Career?
          </h2>
          
          <p className="text-xl text-gray-300 mb-12 max-w-3xl mx-auto">
            Master technical skills, balance work-life, and climb the corporate ladder. Join the most engaging career simulation game.
          </p>

          {/* Email Form */}
          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
            className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto mb-12"
          >
            <div className="flex-1 relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full pl-12 pr-4 py-4 bg-gray-900/50 border border-gray-800 rounded-full focus:outline-none focus:border-blue-500 text-white placeholder-gray-500 backdrop-blur-sm transition-colors"
                required
              />
            </div>
            <motion.button
              type="submit"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-linear-to-r from-blue-600 to-purple-600 rounded-full hover:from-blue-500 hover:to-purple-500 transition-all duration-300 shadow-[0_0_30px_rgba(59,130,246,0.5)] flex items-center justify-center gap-2 whitespace-nowrap"
            >
              Get Early Access
              <ArrowRight className="w-5 h-5" />
            </motion.button>
          </motion.form>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 max-w-3xl mx-auto">
            {[
              { value: '4', label: 'Office Zones' },
              { value: '∞', label: 'Quests' },
              { value: '100+', label: 'Skill Levels' },
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                viewport={{ once: true }}
                className="p-6 bg-linear-to-br from-gray-900/50 to-gray-900/30 border border-gray-800 rounded-2xl backdrop-blur-sm"
              >
                <div className="text-3xl md:text-4xl mb-2 bg-linear-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  {stat.value}
                </div>
                <div className="text-gray-400">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-1/4 left-10 w-20 h-20 border border-blue-500/30 rounded-full" />
      <div className="absolute bottom-1/4 right-10 w-32 h-32 border border-purple-500/30 rounded-full" />
    </section>
  );
}
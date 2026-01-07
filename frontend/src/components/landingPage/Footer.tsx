import { motion } from 'motion/react';
import { Github, Youtube, Heart } from 'lucide-react';

const footerLinks = {
  Product: [
    { label: 'About', href: '#about' },
    { label: 'Features', href: '#features' },
    { label: 'Credits', href: '#credits' },
    // { label: 'Gallery', href: '#gallery' },
  ],
  Company: [
    { label: 'Github', href: 'https://github.com/OverClockerz/Codifier/' },
    { label: 'Architecture', href: 'https://github.com/OverClockerz/Codifier/' },
    { label: 'Project Files', href: 'https://github.com/OverClockerz/Codifier/' },
  ],
  Resources: [
    { label: 'Documentation', href: 'https://ai.google.dev/gemini-api/docs' },
    // { label: 'Community', href: '#' },
    { label: 'Support', href: 'https://support.google.com/gemini/?hl=en#topic=15280100' },
    { label: 'API', href: 'https://aistudio.google.com/apps' },
  ],
  Legal: [
    { label: 'Privacy', href: 'https://policies.google.com/privacy?hl=en-US' },
    { label: 'Terms', href: 'https://policies.google.com/terms?hl=en' },
    { label: 'Licenses', href: 'https://mit-license.org/' },
  ],
};

const socialLinks = [
  // { icon: Twitter, href: '#', label: 'Twitter' },
  { icon: Github, href: 'https://github.com/OverClockerz/', label: 'GitHub' },
  { icon: Youtube, href: '#', label: 'YouTube' },
  // { icon: Twitch, href: '#', label: 'Twitch' },
];

export function Footer() {
  return (
    <footer className="relative bg-black border-t border-gray-900 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-t from-blue-950/10 to-transparent" />

      <div className="relative max-w-7xl mx-auto px-6 py-16">
        {/* Main Footer Content */}
        <div className="grid md:grid-cols-5 gap-12 mb-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <h3 className="text-3xl mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                OFFICE
              </h3>
              <p className="text-gray-400 text-sm mb-6">
                Level up your career through gamified learning and skill development.
              </p>
              <div className="flex gap-4">
                {socialLinks.map((social, index) => {
                  const Icon = social.icon;
                  return (
                    <motion.a
                      key={index}
                      href={social.href}
                      target="_blank"
                      whileHover={{ scale: 1.1, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      className="w-10 h-10 rounded-full bg-gray-900 border border-gray-800 flex items-center justify-center hover:border-blue-500/50 transition-colors"
                      aria-label={social.label}
                    >
                      <Icon className="w-5 h-5 text-gray-400 hover:text-blue-400 transition-colors" />
                    </motion.a>
                  );
                })}
              </div>
            </motion.div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links], categoryIndex) => (
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: categoryIndex * 0.1 }}
              viewport={{ once: true }}
            >
              <h4 className="mb-4 text-gray-300">{category}</h4>
              <ul className="space-y-3">
                {links.map((link, linkIndex) => {
                  const isExternal = /^https?:\/\//.test(link.href);
                  return (
                    <li key={linkIndex}>
                      <a
                        href={link.href}
                        className="text-gray-400 hover:text-blue-400 transition-colors text-sm"
                        target={isExternal ? "_blank" : undefined}
                        rel={isExternal ? "noopener noreferrer" : undefined}
                      >
                        {link.label}
                      </a>
                    </li>
                  );
                })}
              </ul>
            </motion.div>
          ))}

        </div>

        {/* Bottom Bar */}
        <div className="mt-32 text-center text-gray-600 font-mono text-[10px] tracking-[0.4em] uppercase">
          <div className="flex items-center justify-center gap-2 mb-2">
            Made with <Heart size={12} className="text-red-900 fill-red-900 animate-pulse" /> for the future
          </div>
          <p>© 2025 Office Interactive // All Protocols Active</p>
        </div>
      </div>

      {/* Decorative Gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />
    </footer>
  );
}
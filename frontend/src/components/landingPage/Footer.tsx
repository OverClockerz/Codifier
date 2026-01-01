import { motion } from 'motion/react';
import { Twitter, Github, Youtube, Twitch } from 'lucide-react';

const footerLinks = {
  Product: ['Features', 'Pricing', 'FAQ', 'Roadmap'],
  Company: ['About', 'Blog', 'Careers', 'Press Kit'],
  Resources: ['Documentation', 'Community', 'Support', 'API'],
  Legal: ['Privacy', 'Terms', 'Cookie Policy', 'Licenses'],
};

const socialLinks = [
  { icon: Twitter, href: '#', label: 'Twitter' },
  { icon: Github, href: '#', label: 'GitHub' },
  { icon: Youtube, href: '#', label: 'YouTube' },
  { icon: Twitch, href: '#', label: 'Twitch' },
];

export function Footer() {
  return (
    <footer className="relative bg-black border-t border-gray-900 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-linear-to-t from-blue-950/10 to-transparent" />
      
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
              <h3 className="text-3xl mb-4 bg-linear-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
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
                {links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <a
                      href="#"
                      className="text-gray-400 hover:text-blue-400 transition-colors text-sm"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Bottom Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          viewport={{ once: true }}
          className="pt-8 border-t border-gray-900 flex flex-col md:flex-row justify-between items-center gap-4"
        >
          <p className="text-gray-500 text-sm">
            © 2024 Office. All rights reserved.
          </p>
          <div className="flex gap-6">
            <a href="#" className="text-gray-500 hover:text-blue-400 transition-colors text-sm">
              Privacy Policy
            </a>
            <a href="#" className="text-gray-500 hover:text-blue-400 transition-colors text-sm">
              Terms of Service
            </a>
            <a href="#" className="text-gray-500 hover:text-blue-400 transition-colors text-sm">
              Cookie Settings
            </a>
          </div>
        </motion.div>
      </div>

      {/* Decorative Gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-blue-500/50 to-transparent" />
    </footer>
  );
}
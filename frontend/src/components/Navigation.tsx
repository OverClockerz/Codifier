import { motion, useScroll, useTransform } from 'motion/react';
import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom'; // Added Link and useLocation
import { smoothScrollToElement } from '../utils/smoothScroll';

const navItems = [
  { label: 'Home', id: 'home' },
  { label: 'About', id: 'about' },
  { label: 'Features', id: 'features' },
  { label: 'Gallery', id: 'gallery' },
  { label: 'Contact', id: 'contact' },
];

interface NavigationProps {
  onSignIn?: () => void;
}

export function Navigation({ onSignIn }: NavigationProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  const { scrollY } = useScroll();
  const backgroundColor = useTransform(
    scrollY,
    [0, 100],
    ['rgba(0,0,0,0)', 'rgba(0,0,0,0.8)']
  );

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleNavClick = (id: string) => {
    setIsOpen(false);
    
    // If we are already on the landing page, perform smooth scroll immediately
    if (location.pathname === '/') {
      smoothScrollToElement(id);
    }
    // If we are on another page (Game/Profile), the 'to="/#id"' in the Link component 
    // will handle the navigation, and the LandingPage useEffect will handle the scroll.
  };

  return (
    <>
      <motion.nav
        style={{ backgroundColor }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled ? 'border-b border-gray-800 backdrop-blur-xl' : ''
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* LOGO */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Link
                to="/#home"
                onClick={() => handleNavClick('home')}
                className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent cursor-pointer"
              >
                OFFICE
              </Link>
            </motion.div>

            {/* DESKTOP NAV */}
            <div className="hidden md:flex items-center gap-8">
              {navItems.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <Link
                    to={`/#${item.id}`}
                    onClick={() => handleNavClick(item.id)}
                    className="text-gray-300 hover:text-white relative group cursor-pointer font-medium"
                  >
                    {item.label}
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 group-hover:w-full transition-all duration-300" />
                  </Link>
                </motion.div>
              ))}

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full font-semibold shadow-lg shadow-blue-500/20"
                onClick={onSignIn}
              >
                Sign In
              </motion.button>
            </div>

            {/* MOBILE TOGGLE */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden text-white p-2"
            >
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* MOBILE MENU */}
      <motion.div
        initial={false}
        animate={{ x: isOpen ? 0 : '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="fixed top-0 right-0 bottom-0 w-full md:hidden bg-black/95 backdrop-blur-2xl z-40"
      >
        <div className="flex flex-col items-center justify-center h-full gap-8">
          {navItems.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: isOpen ? 1 : 0, x: isOpen ? 0 : 20 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Link
                to={`/#${item.id}`}
                onClick={() => handleNavClick(item.id)}
                className="text-3xl font-light text-gray-300 hover:text-white tracking-wide"
              >
                {item.label}
              </Link>
            </motion.div>
          ))}

          <motion.button
            whileTap={{ scale: 0.9 }}
            className="mt-4 px-10 py-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full text-xl font-bold"
            onClick={onSignIn}
          >
            Sign In
          </motion.button>
        </div>
      </motion.div>
    </>
  );
}
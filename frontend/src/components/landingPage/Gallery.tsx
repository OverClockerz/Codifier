import { motion } from 'motion/react';
import { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const galleryItems = [
  {
    title: 'Immersive Worlds',
    image: 'https://images.unsplash.com/photo-1643546843357-f365789ba489?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmdXR1cmlzdGljJTIwZ2FtaW5nJTIwY2l0eXNjYXBlfGVufDF8fHx8MTc2NTgxMDE3OHww&ixlib=rb-4.1.0&q=80&w=1080',
  },
  {
    title: 'Epic Adventures',
    image: 'https://images.unsplash.com/photo-1580046939256-c377c5b099f1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjeWJlciUyMHdhcnJpb3IlMjBjaGFyYWN0ZXJ8ZW58MXx8fHwxNzY1ODEwMTc4fDA&ixlib=rb-4.1.0&q=80&w=1080',
  },
  {
    title: 'Digital Frontiers',
    image: 'https://images.unsplash.com/photo-1644088379091-d574269d422f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhYnN0cmFjdCUyMHRlY2hub2xvZ3l8ZW58MXx8fHwxNzY1Njk5MTYzfDA&ixlib=rb-4.1.0&q=80&w=1080',
  },
  {
    title: 'Next-Gen Gaming',
    image: 'https://images.unsplash.com/photo-1726822289749-05455057b5d1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnYW1pbmclMjBwb3J0YWx8ZW58MXx8fHwxNzY1ODEwMTc4fDA&ixlib=rb-4.1.0&q=80&w=1080',
  },
];

export function Gallery() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // --- Scroll Logic ---
  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      // Scroll by approximately one card width + gap (500px + 32px gap)
      const scrollAmount = 532; 
      const currentScroll = scrollContainerRef.current.scrollLeft;
      
      scrollContainerRef.current.scrollTo({
        left: direction === 'left' ? currentScroll - scrollAmount : currentScroll + scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    // ADDED id="gallery" HERE so navigation links can find this section
    <section id="gallery" className="relative py-32 bg-black overflow-hidden group/section">
      
      {/* Header */}
      <div className="mb-12 px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <h2 className="text-5xl md:text-7xl mb-6 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Explore the Universe
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Swipe or use arrows to discover worlds
          </p>
        </motion.div>
      </div>

      {/* --- Navigation Arrows --- */}
      
      {/* Left Arrow */}
      <motion.button
        whileHover={{ scale: 1.1, backgroundColor: "rgba(255, 255, 255, 0.15)" }}
        whileTap={{ scale: 0.9 }}
        onClick={() => scroll('left')}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 z-50 p-4 rounded-full bg-white/5 backdrop-blur-md border border-white/10 text-white shadow-lg hidden md:flex items-center justify-center hover:border-blue-500/50 transition-colors"
        aria-label="Scroll left"
      >
        <ChevronLeft className="w-8 h-8" />
      </motion.button>

      {/* Right Arrow */}
      <motion.button
        whileHover={{ scale: 1.1, backgroundColor: "rgba(255, 255, 255, 0.15)" }}
        whileTap={{ scale: 0.9 }}
        onClick={() => scroll('right')}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 z-50 p-4 rounded-full bg-white/5 backdrop-blur-md border border-white/10 text-white shadow-lg hidden md:flex items-center justify-center hover:border-blue-500/50 transition-colors"
        aria-label="Scroll right"
      >
        <ChevronRight className="w-8 h-8" />
      </motion.button>


      {/* --- Scroll Container --- */}
      <div 
        ref={scrollContainerRef}
        className="flex gap-8 px-6 overflow-x-auto pb-12 snap-x snap-mandatory scrollbar-hide"
        style={{ scrollBehavior: 'smooth' }}
      >
        {galleryItems.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            viewport={{ once: true }}
            className="relative flex-shrink-0 w-[85vw] md:w-[500px] h-[600px] rounded-3xl overflow-hidden border border-gray-800 group cursor-pointer snap-center"
          >
            <img
              src={item.image}
              alt={item.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300" />
            
            <div className="absolute bottom-0 left-0 right-0 p-8">
              <h3 className="text-3xl mb-2 text-white font-bold">{item.title}</h3>
              <div className="w-20 h-1 bg-gradient-to-r from-blue-500 to-purple-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
            </div>

            <div className="absolute inset-0 border-2 border-transparent group-hover:border-blue-500/50 rounded-3xl transition-all duration-300" />
          </motion.div>
        ))}
        
        {/* Spacer */}
        <div className="w-6 flex-shrink-0" />
      </div>

      {/* Hide Scrollbar CSS */}
      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
            display: none;
        }
        .scrollbar-hide {
            -ms-overflow-style: none;
            scrollbar-width: none;
        }
      `}</style>

      {/* Gradient Fades (z-index adjusted to sit below buttons) */}
      <div className="absolute top-0 left-0 bottom-0 w-12 md:w-32 bg-gradient-to-r from-black to-transparent pointer-events-none z-10" />
      <div className="absolute top-0 right-0 bottom-0 w-12 md:w-32 bg-gradient-to-l from-black to-transparent pointer-events-none z-10" />
    </section>
  );
}
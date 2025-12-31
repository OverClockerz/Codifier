import { motion, useScroll, useTransform } from 'motion/react';
import { useRef } from 'react';

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
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const x = useTransform(scrollYProgress, [0, 1], [0, -1000]);

  return (
    <section id="gallery" ref={containerRef} className="relative py-32 bg-black overflow-hidden">
      <div className="mb-20 px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <h2 className="text-5xl md:text-7xl mb-6 bg-linear-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Explore the Universe
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Discover breathtaking gaming experiences across infinite worlds
          </p>
        </motion.div>
      </div>

      {/* Horizontal Scroll Gallery */}
      <div className="relative">
        <motion.div 
          style={{ x }}
          className="flex gap-8 px-6"
        >
          {galleryItems.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.05 }}
              className="relative shrink-0 w-125 h-150 rounded-3xl overflow-hidden border border-gray-800 group cursor-pointer"
            >
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black via-black/50 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300" />
              
              <div className="absolute bottom-0 left-0 right-0 p-8">
                <motion.h3 
                  className="text-3xl mb-2"
                  initial={{ y: 20, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  {item.title}
                </motion.h3>
                <motion.div
                  className="w-20 h-1 bg-linear-to-r from-blue-500 to-purple-500"
                  initial={{ scaleX: 0 }}
                  whileHover={{ scaleX: 1 }}
                  transition={{ duration: 0.3 }}
                />
              </div>

              {/* Glow Border Effect */}
              <div className="absolute inset-0 border-2 border-transparent group-hover:border-blue-500/50 rounded-3xl transition-all duration-300" />
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Gradient Fade on Edges */}
      <div className="absolute top-0 left-0 bottom-0 w-32 bg-linear-to-r from-black to-transparent pointer-events-none z-10" />
      <div className="absolute top-0 right-0 bottom-0 w-32 bg-linear-to-l from-black to-transparent pointer-events-none z-10" />
    </section>
  );
}

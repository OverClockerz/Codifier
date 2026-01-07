import React, { useMemo, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

// Register the GSAP plugin
gsap.registerPlugin(ScrollTrigger);

interface PinnedImageRevealProps {
  imageUrl: string;
  title: string;
  description: string;
  reverse?: boolean;
  gradient?: string;
}

const PinnedImageReveal: React.FC<PinnedImageRevealProps> = ({ 
  imageUrl, 
  title, 
  description, 
  reverse = false,
  gradient = 'from-blue-500 to-cyan-500'
}) => {
  const componentRef = useRef<HTMLDivElement>(null);
  const imageWrapperRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);

  const descriptionWords = useMemo(() => description.split(/\s+/), [description]);

  useGSAP(() => {
    if (!componentRef.current || !imageWrapperRef.current || !titleRef.current) return;

    // Set initial states
    gsap.set(imageWrapperRef.current, { 
      xPercent: reverse ? 100 : -100,
      opacity: 0
    });
    gsap.set(titleRef.current, { 
      opacity: 0,
      y: 30
    });
    gsap.set('.word', { opacity: 0.2 });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: componentRef.current,
        start: 'top top',
        end: '+=2000',
        pin: true,
        scrub: 1,
        anticipatePin: 1,
      },
    });

    // Slide in image
    tl.to(imageWrapperRef.current, {
      xPercent: 0,
      opacity: 1,
      ease: 'power2.out',
      duration: 1,
    });

    // Fade in title
    tl.to(titleRef.current, {
      opacity: 1,
      y: 0,
      ease: 'power2.out',
      duration: 0.5,
    }, '<0.3');

    // Reveal words one by one
    tl.to('.word', {
      opacity: 1,
      ease: 'power1.in',
      stagger: 0.08,
      duration: 0.3,
    }, '<0.4');

  }, { scope: componentRef, dependencies: [descriptionWords, reverse] });

  return (
    <div 
      ref={componentRef} 
      className="h-screen w-full flex items-center justify-center overflow-hidden bg-black"
    >
      <div 
        className={`flex items-center justify-center w-full max-w-7xl px-6 gap-12 ${
          reverse ? 'flex-row-reverse' : 'flex-row'
        }`}
      >
        {/* Image */}
        <div 
          ref={imageWrapperRef} 
          className="flex-1 relative"
        >
          <div className={`absolute inset-0 bg-linear-to-br ${gradient} opacity-20 blur-3xl`} />
          <div className="relative rounded-2xl overflow-hidden border border-gray-800">
            <img 
              src={imageUrl} 
              alt={title} 
              className="w-full h-auto block object-cover"
            />
          </div>
        </div>

        {/* Text Content */}
        <div className="flex-1">
          <h2 
            ref={titleRef}
            className={`text-5xl md:text-6xl mb-6 bg-linear-to-r ${gradient} bg-clip-text text-transparent`}
          >
            {title}
          </h2>
          <p className="text-xl md:text-2xl text-gray-300 leading-relaxed">
            {descriptionWords.map((word, index) => (
              <span 
                key={index} 
                className="word inline-block mr-2"
              >
                {word}
              </span>
            ))}
          </p>
        </div>
      </div>
    </div>
  );
};

export default PinnedImageReveal;

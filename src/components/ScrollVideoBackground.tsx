import { motion, useScroll, useTransform } from "motion/react";

const SCENES = [
  {
    id: "intro",
    src: "/videos/office-1.mp4",
    start: 0,
    end: 0.25,
  },
  {
    id: "workspace",
    src: "/videos/office-2.mp4",
    start: 0.25,
    end: 0.5,
  },
  {
    id: "meeting",
    src: "/videos/office-3.mp4",
    start: 0.5,
    end: 0.75,
  },
  {
    id: "lounge",
    src: "/videos/office-4.mp4",
    start: 0.75,
    end: 1,
  },
];

export function ScrollBackground() {
  const { scrollYProgress } = useScroll();

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {SCENES.map((scene) => {
        const opacity = useTransform(
          scrollYProgress,
          [scene.start, scene.start + 0.05, scene.end - 0.05, scene.end],
          [0, 1, 1, 0]
        );

        const y = useTransform(
          scrollYProgress,
          [scene.start, scene.end],
          [0, -160]
        );

        const scale = useTransform(
          scrollYProgress,
          [scene.start, scene.end],
          [1, 1.1]
        );

        return (
          <motion.div
            key={scene.id}
            style={{ opacity, y, scale }}
            className="absolute inset-0 will-change-transform"
          >
            <video
              src={scene.src}
              autoPlay
              muted
              loop
              playsInline
              className="w-full h-full object-cover"
            />

            {/* Overlay for UI readability */}
            <div className="absolute inset-0 bg-black/60" />
          </motion.div>
        );
      })}
    </div>
  );
}

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from './components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

// Sample video URLs (using free test videos)
const videos = [
  {
    id: 1,
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    title: 'Big Buck Bunny'
  },
  {
    id: 2,
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    title: 'Elephants Dream'
  },
  {
    id: 3,
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    title: 'For Bigger Blazes'
  },
  {
    id: 4,
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    title: 'For Bigger Escapes'
  },
  {
    id: 5,
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
    title: 'For Bigger Fun'
  },
  {
    id: 6,
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
    title: 'For Bigger Joyrides'
  },
  {
    id: 7,
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
    title: 'For Bigger Meltdowns'
  }
];

export default function App() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const isScrollingRef = useRef(false);

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? videos.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === videos.length - 1 ? 0 : prev + 1));
  };

  // Handle scroll/wheel navigation
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      // Prevent action if already scrolling
      if (isScrollingRef.current) return;

      // Determine direction
      if (e.deltaY > 0) {
        // Scrolling down - next video
        handleNext();
      } else if (e.deltaY < 0) {
        // Scrolling up - previous video
        handlePrevious();
      }

      // Set throttle to prevent rapid scrolling
      isScrollingRef.current = true;
      setTimeout(() => {
        isScrollingRef.current = false;
      }, 800); // 800ms cooldown between scrolls
    };

    window.addEventListener('wheel', handleWheel, { passive: true });

    return () => {
      window.removeEventListener('wheel', handleWheel);
    };
  }, [currentIndex]); // Re-attach listener when currentIndex changes

  // Calculate positions for each card relative to current index
  const getCardStyle = (index: number) => {
    const diff = index - currentIndex;
    
    // Only show cards within range of -4 to +4
    if (Math.abs(diff) > 4) return { display: 'none' };

    // Center card
    if (diff === 0) {
      return {
        x: 0,
        y: 0,
        z: 0,
        rotateY: 0,
        scale: 1,
        opacity: 1
      };
    }
    
    // Cards to the right (stacked behind, offset right)
    if (diff > 0) {
      const offsetX = Math.min(diff * 30, 120); // Max 120px offset
      const offsetZ = -diff * 80; // Further back for each card
      const scale = 1 - diff * 0.08; // Smaller for each card
      const opacity = Math.max(0.4, 1 - diff * 0.2);
      
      return {
        x: offsetX,
        y: 0,
        z: offsetZ,
        rotateY: Math.min(diff * 5, 15),
        scale: scale,
        opacity: opacity
      };
    }
    
    // Cards to the left (stacked behind, offset left)
    if (diff < 0) {
      const absDiff = Math.abs(diff);
      const offsetX = -Math.min(absDiff * 30, 120); // Max 120px offset
      const offsetZ = -absDiff * 80; // Further back for each card
      const scale = 1 - absDiff * 0.08; // Smaller for each card
      const opacity = Math.max(0.4, 1 - absDiff * 0.2);
      
      return {
        x: offsetX,
        y: 0,
        z: offsetZ,
        rotateY: -Math.min(absDiff * 5, 15),
        scale: scale,
        opacity: opacity
      };
    }

    return { display: 'none' };
  };

  return (
    <div className="size-full flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 overflow-hidden">
      <div className="relative w-full h-full flex items-center justify-center" style={{ perspective: '1500px' }}>
        {/* Video Cards Stack */}
        <div className="relative w-[360px] h-[640px]">
          <AnimatePresence initial={false}>
            {videos.map((video, index) => {
              const style = getCardStyle(index);
              const isActive = index === currentIndex;
              
              if (style.display === 'none') return null;

              return (
                <motion.div
                  key={video.id}
                  className="absolute inset-0"
                  initial={false}
                  animate={{
                    x: style.x,
                    y: style.y,
                    z: style.z,
                    rotateY: style.rotateY,
                    scale: style.scale,
                    opacity: style.opacity
                  }}
                  transition={{
                    type: 'spring',
                    stiffness: 120,
                    damping: 25,
                    mass: 1
                  }}
                  style={{
                    transformStyle: 'preserve-3d',
                    zIndex: 100 - Math.abs(index - currentIndex)
                  }}
                >
                  {/* Glassmorphism container */}
                  <div className="relative w-full h-full rounded-xl overflow-hidden shadow-2xl backdrop-blur-lg bg-white/10 border border-white/20">
                    {/* Glass effect overlay */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-white/5 to-transparent pointer-events-none z-10"></div>
                    
                    {/* Edge highlight for stacked effect */}
                    <div className="absolute inset-0 rounded-xl border-2 border-white/30 pointer-events-none z-10"></div>
                    
                    {/* Video element */}
                    <video
                      src={video.url}
                      className="w-full h-full object-cover"
                      autoPlay={isActive}
                      muted
                      loop
                      playsInline
                    />
                    
                    {/* Video title overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/60 to-transparent z-20">
                      <h3 className="text-white">{video.title}</h3>
                      <p className="text-white/70">Video {index + 1} of {videos.length}</p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Navigation Buttons */}
        <Button
          onClick={handlePrevious}
          className="absolute left-4 z-[200] w-14 h-14 rounded-full bg-white/20 backdrop-blur-md border border-white/30 hover:bg-white/30 transition-all shadow-xl"
          size="icon"
        >
          <ChevronLeft className="w-7 h-7 text-white" />
        </Button>

        <Button
          onClick={handleNext}
          className="absolute right-4 z-[200] w-14 h-14 rounded-full bg-white/20 backdrop-blur-md border border-white/30 hover:bg-white/30 transition-all shadow-xl"
          size="icon"
        >
          <ChevronRight className="w-7 h-7 text-white" />
        </Button>

        {/* Indicator dots */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-[200] flex gap-2">
          {videos.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentIndex 
                  ? 'bg-white w-8' 
                  : 'bg-white/40 hover:bg-white/60'
              }`}
              aria-label={`Go to video ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

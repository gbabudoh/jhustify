import Image from 'next/image';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, X, Maximize2 } from 'lucide-react';

interface RichMediaGalleryProps {
  images: string[];
}

export default function RichMediaGallery({ images }: RichMediaGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [fullscreen, setFullscreen] = useState(false);

  // If no images provided, use some professional placeholders
  const displayImages = images && images.length > 0 ? images : [
    "https://images.unsplash.com/photo-1542623024-a797a7a4930d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1534452203293-494d7ddbf7e0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
  ];

  const handleNext = () => setCurrentIndex((prev) => (prev + 1) % displayImages.length);
  const handlePrev = () => setCurrentIndex((prev) => (prev - 1 + displayImages.length) % displayImages.length);

  return (
    <div className="space-y-4">
      <div className="relative aspect-video rounded-3xl overflow-hidden bg-gray-100 group">
        <Image 
          src={displayImages[currentIndex]} 
          alt={`Gallery image ${currentIndex + 1}`}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 70vw, 50vw"
          priority
        />
        
        {/* Navigation Controls */}
        <div className="absolute inset-0 flex items-center justify-between px-4 opacity-0 group-hover:opacity-100 transition-opacity z-10">
          <button 
            onClick={handlePrev}
            className="p-2 rounded-full bg-white/80 backdrop-blur-sm text-[#465362] hover:bg-white shadow-lg transition-all"
          >
            <ChevronLeft size={24} />
          </button>
          <button 
            onClick={handleNext}
            className="p-2 rounded-full bg-white/80 backdrop-blur-sm text-[#465362] hover:bg-white shadow-lg transition-all"
          >
            <ChevronRight size={24} />
          </button>
        </div>

        {/* Info & Action Overlays */}
        <div className="absolute top-4 right-4 z-10">
          <button 
            onClick={() => setFullscreen(true)}
            className="p-2 rounded-full bg-black/30 backdrop-blur-sm text-white hover:bg-black/50 transition-all"
          >
            <Maximize2 size={18} />
          </button>
        </div>

        <div className="absolute bottom-4 left-4 bg-black/30 backdrop-blur-md px-3 py-1 rounded-full text-white text-xs font-medium z-10">
          {currentIndex + 1} / {displayImages.length}
        </div>
      </div>

      {/* Thumbnails */}
      <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
        {displayImages.map((img, idx) => (
          <button 
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={`relative w-20 h-20 flex-shrink-0 rounded-xl overflow-hidden border-2 transition-all ${
              currentIndex === idx ? 'border-[#5BB318] ring-2 ring-[#C2EABD]' : 'border-transparent opacity-60 hover:opacity-100'
            }`}
          >
            <Image 
              src={img} 
              alt={`Thumbnail ${idx + 1}`} 
              fill 
              className="object-cover"
              sizes="80px"
            />
          </button>
        ))}
      </div>

      {/* Fullscreen Modal */}
      <AnimatePresence>
        {fullscreen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4"
          >
            <button 
              onClick={() => setFullscreen(false)}
              className="absolute top-6 right-6 text-white hover:text-[#C2EABD] transition-colors z-[110]"
            >
              <X size={32} />
            </button>
            <div className="relative w-full h-full">
              <Image 
                src={displayImages[currentIndex]} 
                fill
                className="object-contain"
                alt="Fullscreen view"
                sizes="100vw"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

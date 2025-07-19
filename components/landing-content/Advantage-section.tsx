"use client";

import Image from "next/image";
import { motion, useAnimation } from "framer-motion";
import { advantageItems } from "../../data/advantage";
import { useEffect, useState } from "react";

export default function AdvantageSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const controls = useAnimation();
  const [visibleCards, setVisibleCards] = useState(3); // Dynamic card count based on screen size
  const extendedItems = [...advantageItems, ...advantageItems.slice(0, visibleCards)];

  // Handle responsive card count
  useEffect(() => {
    const updateVisibleCards = () => {
      if (window.innerWidth < 640) {
        setVisibleCards(1);
      } else if (window.innerWidth < 1024) {
        setVisibleCards(2);
      } else {
        setVisibleCards(3);
      }
    };

    updateVisibleCards();
    window.addEventListener('resize', updateVisibleCards);
    return () => window.removeEventListener('resize', updateVisibleCards);
  }, []);

  // Auto-scroll effect
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex(prev => (prev + 1) % advantageItems.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [advantageItems.length]);

  // Staggered card animations
  useEffect(() => {
    controls.start({
      opacity: 1,
      y: 0,
      transition: { staggerChildren: 0.1 }
    });
  }, [controls]);

  return (
    <section id="benefits" className="py-12 md:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden">
      <div className="text-center mb-8 md:mb-12">
        <motion.h2 
          className="text-3xl sm:text-4xl md:text-5xl font-bold font-playfair text-dark-blue mb-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          The Buy Exchange Advantage
        </motion.h2>
        <motion.p 
          className="text-light-gray max-w-3xl mx-auto text-sm sm:text-base px-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          Buy Exchange B2B Services covers a wide range of Study Abroad and Forex solutions, including
        </motion.p>
      </div>

      <div className="relative">
        {/* Background subtle gradient animation */}
        <motion.div 
          className="absolute inset-0 -z-10 bg-gradient-to-r from-blue-50/20 to-white/20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5 }}
        />

        <motion.div
          className="flex gap-4 sm:gap-6 md:gap-8 overflow-x-visible"
          animate={controls}
        >
          {extendedItems.slice(activeIndex, activeIndex + visibleCards).map((item, index) => (
            <motion.div
              key={`card-${activeIndex}-${index}`}
              className="bg-off-white shadow-lg shadow-blue-500/20 p-6 sm:p-8 rounded-lg flex-1 min-w-[calc(100%-32px)] sm:min-w-0"
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ 
                opacity: 1, 
                y: 0, 
                scale: 1,
                transition: { 
                  type: "spring",
                  damping: 10,
                  stiffness: 100,
                  delay: index * 0.15
                }
              }}
              whileHover={{
                y: -5,
                boxShadow: "0 10px 25px -5px rgba(59, 130, 246, 0.25)",
                transition: { duration: 0.3 }
              }}
            >
              <motion.div 
                className="mb-3 sm:mb-4 relative w-8 h-8 sm:w-10 sm:h-10"
                whileHover={{ scale: 1.1 }}
              >
                <Image
                  src={item.imageSrc || "/placeholder.svg"}
                  alt={item.title}
                  width={40}
                  height={40}
                  className="object-contain"
                />
              </motion.div>
              <motion.h3 
                className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3"
                whileHover={{ color: "#2563eb" }}
              >
                {item.title}
              </motion.h3>
              <motion.p 
                className="text-light-gray text-xs sm:text-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 + index * 0.1 }}
              >
                {item.description}
              </motion.p>
            </motion.div>
          ))}
        </motion.div>

        {/* Navigation dots */}
        <motion.div 
          className="flex justify-center mt-6 md:mt-8 gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          {advantageItems.map((_, index) => (
            <button
              key={index}
              onClick={() => setActiveIndex(index)}
              className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-colors ${activeIndex % advantageItems.length === index ? 'bg-dark-blue' : 'bg-gray-300'}`}
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
"use client";

import Image from "next/image";
import { motion, useAnimation,  } from "framer-motion";
import { advantageItems } from "../../data/advantage";
import { useEffect, useState } from "react";

export default function AdvantageSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const controls = useAnimation();
  const visibleCards = 3;
  const extendedItems = [...advantageItems, ...advantageItems.slice(0, visibleCards)];

  // Auto-scroll effect
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex(prev => (prev + 1) % advantageItems.length);
    }, 4000); // Change card every 4 seconds

    return () => clearInterval(interval);
  }, []);

  // Staggered card animations
  useEffect(() => {
    controls.start({
      opacity: 1,
      y: 0,
      transition: { staggerChildren: 0.1 }
    });
  }, [controls]);

  return (
    <section className="py-16 px-4 max-w-7xl mx-auto overflow-hidden">
      <div className="text-center mb-12">
        <motion.h2 
          className="text-4xl md:text-5xl font-bold font-playfair text-dark-blue mb-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          The Buy Exchange Advantage
        </motion.h2>
        <motion.p 
          className="text-light-gray max-w-3xl mx-auto"
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
          className="flex gap-8"
          animate={controls}
        >
          {extendedItems.slice(activeIndex, activeIndex + visibleCards).map((item, index) => (
            <motion.div
              key={`card-${activeIndex}-${index}`}
              className="bg-off-white shadow-lg shadow-blue-500/20 p-8 rounded-lg flex-1 min-w-0"
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
                className="mb-4 relative w-10 h-10"
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
                className="text-xl font-semibold mb-3"
                whileHover={{ color: "#2563eb" }}
              >
                {item.title}
              </motion.h3>
              <motion.p 
                className="text-light-gray"
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
          className="flex justify-center mt-8 gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          {advantageItems.map((_, index) => (
            <button
              key={index}
              onClick={() => setActiveIndex(index)}
              className={`w-3 h-3 rounded-full transition-colors ${activeIndex % advantageItems.length === index ? 'bg-dark-blue' : 'bg-gray-300'}`}
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
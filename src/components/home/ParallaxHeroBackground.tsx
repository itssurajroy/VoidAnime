'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import Image from 'next/image';

interface Props {
  bgImage: string;
  title: string;
}

export function ParallaxHeroBackground({ bgImage, title }: Props) {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 800], [0, 200]);
  const opacity = useTransform(scrollY, [0, 400], [0.6, 0.1]);

  return (
    <motion.div className="absolute inset-0" style={{ y, opacity }}>
      <Image 
        src={bgImage} 
        alt={title} 
        fill 
        priority 
        className="object-cover object-center transform scale-105" 
      />
    </motion.div>
  );
}

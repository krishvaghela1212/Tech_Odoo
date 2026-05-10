import React, { useEffect } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react'
import { MapPin, Plane, Compass, Navigation, Globe } from 'lucide-react'

export default function CinematicBackground() {
  const mouseX = useMotionValue(0.5)
  const mouseY = useMotionValue(0.5)

  const springX = useSpring(mouseX, { stiffness: 100, damping: 30 })
  const springY = useSpring(mouseY, { stiffness: 100, damping: 30 })

  const moveX1 = useTransform(springX, [0, 1], [20, -20])
  const moveY1 = useTransform(springY, [0, 1], [20, -20])
  
  const moveX2 = useTransform(springX, [0, 1], [-40, 40])
  const moveY2 = useTransform(springY, [0, 1], [-40, 40])
  
  const rotateX = useTransform(springY, [0, 1], [8, -8])
  const rotateY = useTransform(springX, [0, 1], [-8, 8])

  useEffect(() => {
    const handleMouseMove = (e) => {
      mouseX.set(e.clientX / window.innerWidth)
      mouseY.set(e.clientY / window.innerHeight)
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [mouseX, mouseY])

  const travelIcons = [MapPin, Plane, Compass, Navigation, Globe]

  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none bg-[var(--color-bg)]">
      {/* Background Topo Map Layer */}
      <motion.div 
        style={{ x: moveX1, y: moveY1, scale: 1.15 }}
        className="absolute inset-0 opacity-[0.12] grayscale contrast-150 brightness-75"
      >
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/world-map.png')] bg-center bg-no-repeat bg-cover"></div>
      </motion.div>

      {/* Floating Travel Elements (The "Project Relation") */}
      <div className="absolute inset-0 z-10 overflow-hidden">
        {[...Array(12)].map((_, i) => {
          const Icon = travelIcons[i % travelIcons.length]
          return (
            <motion.div
              key={i}
              initial={{ 
                x: Math.random() * 100 + "%", 
                y: Math.random() * 100 + "%",
                opacity: 0,
                scale: Math.random() * 0.5 + 0.5
              }}
              animate={{
                y: [null, "-=60", "+=60"],
                opacity: [0, 0.25, 0],
                rotate: [0, 15, -15, 0]
              }}
              style={{
                x: useTransform(springX, [0, 1], [Math.random() * 100, Math.random() * -100]),
                y: useTransform(springY, [0, 1], [Math.random() * 100, Math.random() * -100]),
              }}
              transition={{
                duration: Math.random() * 15 + 15,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="absolute text-[var(--color-primary)]/40 filter blur-[0.5px]"
            >
              <Icon size={Math.random() * 40 + 20} strokeWidth={1} />
            </motion.div>
          )
        })}
      </div>

      {/* Glowing Flight Path "Loops" */}
      <motion.svg 
        style={{ x: moveX2, y: moveY2, rotateX, rotateY }}
        className="absolute inset-0 w-full h-full opacity-[0.05]"
      >
        <circle cx="20%" cy="30%" r="200" fill="none" stroke="var(--color-primary)" strokeWidth="1" strokeDasharray="10 20" />
        <circle cx="80%" cy="70%" r="300" fill="none" stroke="var(--color-primary)" strokeWidth="1" strokeDasharray="15 30" />
        <path d="M 100 100 Q 400 600 800 200" fill="none" stroke="var(--color-primary)" strokeWidth="1" strokeDasharray="5 15" />
      </motion.svg>

      {/* 3D Navigation Grid */}
      <motion.div 
        style={{ x: moveX2, y: moveY2, rotateX, rotateY, scale: 1.25 }}
        className="absolute inset-0 opacity-[0.06]"
      >
        <div className="w-full h-full" style={{ 
          backgroundImage: 'linear-gradient(var(--color-primary) 1px, transparent 1px), linear-gradient(90deg, var(--color-primary) 1px, transparent 1px)',
          backgroundSize: '100px 100px'
        }}></div>
      </motion.div>

      {/* Cinematic Depth Overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-bg)] via-transparent to-[var(--color-bg)] opacity-80"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,var(--color-bg)_110%)] opacity-70"></div>
    </div>
  )
}

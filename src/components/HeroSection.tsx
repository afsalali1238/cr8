// src/components/HeroSection.tsx
'use client'
import { motion } from 'framer-motion'
import Link from 'next/link'
import SearchInput from './SearchInput'

export default function HeroSection() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } }
  }

  return (
    <section className="relative overflow-hidden pt-16 pb-24">
      {/* Background blobs */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-clay/5 rounded-full -mr-64 -mt-64 blur-3xl" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-sand/20 rounded-full -ml-48 -mb-48 blur-3xl" />

      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
        
        {/* Hero text */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="relative z-10"
        >
          <motion.h1 
            variants={itemVariants}
            className="font-display text-4xl lg:text-6xl text-ink mb-6 leading-[1.1]"
          >
            Handmade.<br />
            <span className="text-clay">Heartfelt.</span><br />
            Human.
          </motion.h1>

          <motion.p 
            variants={itemVariants}
            className="text-charcoal text-lg leading-relaxed mb-8 max-w-md"
          >
            Discover unique art and crafts made by independent artists near you. 
            Every piece has a story. Every purchase supports a maker directly.
          </motion.p>

          <motion.div variants={itemVariants} className="mb-10 max-w-md">
            <SearchInput />
            <p className="text-[10px] text-muted mt-2 ml-2 italic">
              Try "ceramics", "Kochi", or "painting"
            </p>
          </motion.div>

          <motion.div variants={itemVariants} className="flex flex-wrap gap-3">
            <Link
              href="/artists"
              className="px-6 py-3 rounded-full bg-clay text-white font-medium hover:bg-clay-light 
                         transition-colors shadow-lg shadow-clay/20 active:scale-95"
            >
              Browse Artists
            </Link>
            <Link
              href="/map"
              className="px-6 py-3 rounded-full border-2 border-clay text-clay font-medium 
                         hover:bg-clay hover:text-white transition-colors active:scale-95"
            >
              🗺 View Map
            </Link>
          </motion.div>

          {/* social proof numbers */}
          <motion.div variants={itemVariants} className="flex gap-8 mt-12">
            <div>
              <p className="font-display text-3xl text-clay">10+</p>
              <p className="text-xs text-muted uppercase tracking-wide">Artists</p>
            </div>
            <div>
              <p className="font-display text-3xl text-clay">6</p>
              <p className="text-xs text-muted uppercase tracking-wide">Categories</p>
            </div>
            <div>
              <p className="font-display text-3xl text-clay">Kerala</p>
              <p className="text-xs text-muted uppercase tracking-wide">Starting From</p>
            </div>
          </motion.div>
        </motion.div>

        {/* Hero image collage */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" as const }}
          className="hidden md:grid grid-cols-2 gap-3 h-[480px] relative"
        >
          <div className="col-span-1 flex flex-col gap-3">
            <div className="rounded-2xl bg-sand-dark flex-1 overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1565193298357-3f360742cc4e?auto=format&fit=crop&q=80&w=800" 
                alt="Handmade pottery" 
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" 
              />
            </div>
            <div className="rounded-2xl bg-sand h-36 overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1547826039-bfc35e0f1ea8?auto=format&fit=crop&q=80&w=800" 
                alt="Artist painting" 
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" 
              />
            </div>
          </div>
          <div className="col-span-1 flex flex-col gap-3">
            <div className="rounded-2xl bg-sand h-36 overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1611085583191-a3b1a6a939db?auto=format&fit=crop&q=80&w=800" 
                alt="Handmade jewellery" 
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" 
              />
            </div>
            <div className="rounded-2xl bg-sand-dark flex-1 overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1536176561669-612921102426?auto=format&fit=crop&q=80&w=800" 
                alt="Macrame and textile craft" 
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" 
              />
            </div>
          </div>
          
          {/* subtle floating badge */}
          <motion.div 
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -bottom-6 -right-6 bg-cream border border-sand-dark p-4 rounded-2xl shadow-xl z-20"
          >
            <p className="text-[10px] uppercase tracking-widest font-bold text-clay">Direct from Makers</p>
            <p className="text-xs text-ink">Supporting Local Art 🇮🇳</p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

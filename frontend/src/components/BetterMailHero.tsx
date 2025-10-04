import { motion } from 'motion/react';
import { Button } from './ui/button';
import { Mail, ArrowRight } from 'lucide-react';

export function BetterMailHero() {
  return (
    <div className="relative w-full min-h-screen overflow-hidden">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 opacity-90">
        <motion.div
          className="absolute inset-0 bg-gradient-to-tr from-cyan-400 via-blue-500 to-purple-600"
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      </div>

      {/* Animated mesh gradients */}
      <motion.div
        className="absolute top-0 left-0 w-[600px] h-[600px] bg-gradient-radial from-blue-400/60 to-transparent rounded-full blur-3xl"
        animate={{
          x: [0, 200, 0],
          y: [0, 100, 0],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-gradient-radial from-purple-400/60 to-transparent rounded-full blur-3xl"
        animate={{
          x: [0, -200, 0],
          y: [0, -100, 0],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute top-1/2 left-1/2 w-[500px] h-[500px] bg-gradient-radial from-pink-400/40 to-transparent rounded-full blur-3xl"
        animate={{
          x: [-100, 100, -100],
          y: [-50, 50, -50],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Floating geometric shapes */}
      <div className="absolute inset-0">
        {/* Circle 1 */}
        <motion.div
          className="absolute top-1/4 left-1/4 w-32 h-32 border-2 border-white/30 rounded-full backdrop-blur-sm bg-white/10"
          animate={{
            y: [0, -40, 0],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Circle 2 */}
        <motion.div
          className="absolute top-1/2 right-1/4 w-40 h-40 border-2 border-white/20 rounded-full backdrop-blur-sm bg-white/5"
          animate={{
            y: [0, 50, 0],
            x: [0, 30, 0],
            rotate: [0, -180, -360],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Square */}
        <motion.div
          className="absolute bottom-1/3 left-1/3 w-24 h-24 border-2 border-white/25 backdrop-blur-sm bg-white/10 rounded-lg"
          animate={{
            rotate: [0, 90, 180, 270, 360],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "linear",
          }}
        />

        {/* Diamond */}
        <motion.div
          className="absolute top-1/3 right-1/3 w-20 h-20 border-2 border-white/30 backdrop-blur-sm bg-white/10 rotate-45"
          animate={{
            y: [0, -30, 0],
            rotate: [45, 225, 405],
          }}
          transition={{
            duration: 7,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Small circles scattered */}
        <motion.div
          className="absolute top-[15%] right-[20%] w-16 h-16 bg-white/20 rounded-full backdrop-blur-sm"
          animate={{
            scale: [1, 1.4, 1],
            opacity: [0.2, 0.5, 0.2],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        <motion.div
          className="absolute bottom-[30%] right-[45%] w-12 h-12 bg-white/15 rounded-full backdrop-blur-sm"
          animate={{
            scale: [1, 1.6, 1],
            opacity: [0.15, 0.4, 0.15],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
        />

        <motion.div
          className="absolute top-[60%] left-[15%] w-14 h-14 bg-white/25 rounded-full backdrop-blur-sm"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.25, 0.45, 0.25],
          }}
          transition={{
            duration: 7,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.5,
          }}
        />
      </div>

      {/* Grid overlay for tech feel */}
      <div className="absolute inset-0 opacity-5">
        <div className="grid grid-cols-12 grid-rows-12 h-full w-full">
          {Array.from({ length: 144 }).map((_, i) => (
            <div key={i} className="border border-white/30" />
          ))}
        </div>
      </div>

      {/* Hero content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen px-8">
        <div className="max-w-6xl mx-auto text-center">
          {/* Logo icon with animation */}
          <motion.div
            className="flex justify-center mb-16"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ 
              duration: 1,
              type: "spring",
              stiffness: 100
            }}
          >
            <div className="relative">
              <motion.div
                className="absolute inset-0 bg-white/20 rounded-full blur-3xl"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.3, 0.5, 0.3],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
              <div className="relative backdrop-blur-md bg-white/20 border-2 border-white/40 rounded-3xl p-10">
                <Mail className="w-24 h-24 text-white" strokeWidth={1.5} />
              </div>
            </div>
          </motion.div>

          {/* Title */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-8"
          >
            <h1 className="text-white text-8xl">
              BetterMail
            </h1>
          </motion.div>

          {/* Subtitle */}
          <motion.p
            className="text-white/90 text-3xl mb-16 max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Experience email like never before.
          </motion.p>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                size="lg"
                className="group bg-white text-purple-600 hover:bg-white/90 px-16 py-10 rounded-2xl shadow-2xl text-3xl"
              >
                <span className="flex items-center gap-4">
                  Get Started
                  <ArrowRight className="w-8 h-8 transition-transform group-hover:translate-x-1" />
                </span>
              </Button>
            </motion.div>
          </motion.div>

          {/* Trust indicators */}
          <motion.div
            className="mt-16 flex flex-wrap justify-center items-center gap-8 text-white/70 text-xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <span>No credit card required</span>
            <span>•</span>
            <span>Free to start</span>
          </motion.div>
        </div>
      </div>

      {/* Light rays effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-b from-white/10 via-transparent to-transparent pointer-events-none"
        animate={{
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Decorative corner elements */}
      <motion.div
        className="absolute top-8 left-8 w-32 h-32 border-t-2 border-l-2 border-white/30 rounded-tl-3xl"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, delay: 1.2 }}
      />
      <motion.div
        className="absolute bottom-8 right-8 w-32 h-32 border-b-2 border-r-2 border-white/30 rounded-br-3xl"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, delay: 1.2 }}
      />
    </div>
  );
}

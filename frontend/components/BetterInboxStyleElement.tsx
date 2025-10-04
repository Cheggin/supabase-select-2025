import { motion } from 'motion/react';

export function BetterInboxStyleElement() {
  return (
    <div className="relative w-full max-w-4xl h-96 overflow-hidden rounded-3xl">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 opacity-80">
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
        className="absolute top-0 left-0 w-96 h-96 bg-gradient-radial from-blue-400/60 to-transparent rounded-full blur-3xl"
        animate={{
          x: [0, 100, 0],
          y: [0, 50, 0],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-radial from-purple-400/60 to-transparent rounded-full blur-3xl"
        animate={{
          x: [0, -100, 0],
          y: [0, -50, 0],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Floating geometric shapes */}
      <div className="absolute inset-0">
        {/* Circle 1 */}
        <motion.div
          className="absolute top-1/4 left-1/4 w-24 h-24 border-2 border-white/30 rounded-full backdrop-blur-sm bg-white/10"
          animate={{
            y: [0, -30, 0],
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
          className="absolute top-1/2 right-1/4 w-32 h-32 border-2 border-white/20 rounded-full backdrop-blur-sm bg-white/5"
          animate={{
            y: [0, 40, 0],
            x: [0, 20, 0],
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
          className="absolute bottom-1/3 left-1/3 w-20 h-20 border-2 border-white/25 backdrop-blur-sm bg-white/10 rounded-lg"
          animate={{
            rotate: [0, 90, 180, 270, 360],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "linear",
          }}
        />

        {/* Diamond */}
        <motion.div
          className="absolute top-1/3 right-1/3 w-16 h-16 border-2 border-white/30 backdrop-blur-sm bg-white/10 rotate-45"
          animate={{
            y: [0, -20, 0],
            rotate: [45, 225, 405],
          }}
          transition={{
            duration: 7,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Small circles */}
        <motion.div
          className="absolute top-1/5 right-1/5 w-12 h-12 bg-white/20 rounded-full backdrop-blur-sm"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        <motion.div
          className="absolute bottom-1/4 right-1/2 w-10 h-10 bg-white/15 rounded-full backdrop-blur-sm"
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.15, 0.35, 0.15],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
        />
      </div>

      {/* Grid overlay for tech feel */}
      <div className="absolute inset-0 opacity-10">
        <div className="grid grid-cols-12 grid-rows-12 h-full w-full">
          {Array.from({ length: 144 }).map((_, i) => (
            <div key={i} className="border border-white/20" />
          ))}
        </div>
      </div>

      {/* Glassmorphic card overlay */}
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div
          className="relative backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl p-8 shadow-2xl"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
        >
          <motion.div
            className="text-center"
            animate={{
              opacity: [0.8, 1, 0.8],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <h2 className="text-white mb-2">BetterInbox</h2>
            <p className="text-white/80">Email reimagined</p>
          </motion.div>

          {/* Animated accent lines */}
          <motion.div
            className="absolute -top-1 -left-1 w-20 h-20 border-t-2 border-l-2 border-white/40 rounded-tl-2xl"
            animate={{
              opacity: [0.4, 0.8, 0.4],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute -bottom-1 -right-1 w-20 h-20 border-b-2 border-r-2 border-white/40 rounded-br-2xl"
            animate={{
              opacity: [0.4, 0.8, 0.4],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1,
            }}
          />
        </motion.div>
      </div>

      {/* Light rays effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-b from-white/10 via-transparent to-transparent"
        animate={{
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </div>
  );
}

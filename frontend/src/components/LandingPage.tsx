import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail } from 'lucide-react';

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/20 to-pink-50/20 overflow-hidden relative">
      {/* Animated Background Shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Large Purple Polygon */}
        <motion.div
          className="absolute -top-32 -right-32 w-96 h-96 opacity-15"
          animate={{
            rotate: [0, 360],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          <svg viewBox="0 0 200 200" className="w-full h-full">
            <polygon
              points="100,10 180,60 160,140 40,140 20,60"
              fill="url(#purpleGradient)"
            />
            <defs>
              <linearGradient id="purpleGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{ stopColor: "#a855f7", stopOpacity: 1 }} />
                <stop offset="100%" style={{ stopColor: "#ec4899", stopOpacity: 1 }} />
              </linearGradient>
            </defs>
          </svg>
        </motion.div>

        {/* Pink Triangle */}
        <motion.div
          className="absolute top-1/4 -left-20 w-64 h-64 opacity-10"
          animate={{
            y: [0, 30, 0],
            rotate: [0, 10, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <svg viewBox="0 0 200 200" className="w-full h-full">
            <polygon points="100,20 180,180 20,180" fill="#ec4899" />
          </svg>
        </motion.div>

        {/* Purple Hexagon */}
        <motion.div
          className="absolute bottom-20 right-1/4 w-48 h-48 opacity-12"
          animate={{
            rotate: [0, -180, -360],
            scale: [1, 0.9, 1],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          <svg viewBox="0 0 200 200" className="w-full h-full">
            <polygon
              points="100,10 170,50 170,130 100,170 30,130 30,50"
              fill="#a855f7"
            />
          </svg>
        </motion.div>

        {/* Small Pink Pentagon */}
        <motion.div
          className="absolute top-1/2 right-20 w-32 h-32 opacity-12"
          animate={{
            x: [0, 20, 0],
            y: [0, -20, 0],
            rotate: [0, 45, 0],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <svg viewBox="0 0 200 200" className="w-full h-full">
            <polygon
              points="100,10 190,75 155,165 45,165 10,75"
              fill="#ec4899"
            />
          </svg>
        </motion.div>

        {/* Purple Diamond */}
        <motion.div
          className="absolute bottom-1/3 left-1/4 w-40 h-40 opacity-10"
          animate={{
            rotate: [0, 90, 180, 270, 360],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          <svg viewBox="0 0 200 200" className="w-full h-full">
            <polygon points="100,10 190,100 100,190 10,100" fill="#a855f7" />
          </svg>
        </motion.div>

        {/* Additional floating shapes for depth */}
        <motion.div
          className="absolute top-3/4 left-1/2 w-24 h-24 opacity-8"
          animate={{
            x: [0, -30, 0],
            y: [0, 20, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <svg viewBox="0 0 200 200" className="w-full h-full">
            <polygon points="100,20 180,180 20,180" fill="#ec4899" />
          </svg>
        </motion.div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Header */}
        <header className="container mx-auto px-6 py-8">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center shadow-md">
              <Mail className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-semibold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              BetterMail
            </span>
          </div>
        </header>

        {/* Hero Section */}
        <main className="container mx-auto px-6 flex-1 flex items-center justify-center">
          <div className="max-w-4xl mx-auto text-center py-12">
            <motion.div
              className="mb-8 flex justify-center"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
            >
              <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg">
                <Mail className="w-10 h-10 text-white" />
              </div>
            </motion.div>

            <motion.h1
              className="text-5xl md:text-6xl lg:text-7xl font-bold mb-8 bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 bg-clip-text text-transparent leading-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              Email that works
              <br />
              the way you do
            </motion.h1>

            <motion.p
              className="text-lg md:text-xl text-slate-600 mb-10 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              A modern email styling tool powered by AI. Create beautiful, professional email templates in seconds with just a description.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <button
                onClick={() => navigate('/app')}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700
                         text-white px-10 py-4 text-lg rounded-lg shadow-lg hover:shadow-xl
                         transition-all duration-300 transform hover:scale-105 font-medium"
              >
                Get Started
              </button>
            </motion.div>
          </div>
        </main>

        {/* Footer */}
        <footer className="container mx-auto px-6 py-8 text-center text-slate-500">
          <p className="text-sm">© 2025 BetterMail. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
}
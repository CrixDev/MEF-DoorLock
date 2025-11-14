import { motion } from 'framer-motion';

/**
 * Header Component
 * 
 * Displays project title and team members information
 */
export const Header = () => {
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="w-full bg-slate-800/50 backdrop-blur-sm border-b border-slate-700 shadow-lg"
    >
      <div className="max-w-7xl mx-auto px-4 py-4 sm:py-6">
        {/* Project Title */}
        <motion.h1 
          className="text-2xl sm:text-3xl font-bold text-center mb-3 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent"
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Máquina de Estado Finito - Puerta Inteligente
        </motion.h1>
        
        <p className="text-slate-400 text-center text-sm sm:text-base mb-4">
          Matemáticas Computacionales
        </p>

        {/* Team Members */}
        <motion.div 
          className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-8 text-slate-300"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-blue-500"></div>
            <div className="text-center sm:text-left">
              <span className="font-medium text-white">Cristian Eduardo Devora Mendez</span>
              <span className="text-slate-400 ml-2">252287</span>
            </div>
          </div>
          
          <div className="hidden sm:block w-px h-8 bg-slate-600"></div>
          
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-purple-500"></div>
            <div className="text-center sm:text-left">
              <span className="font-medium text-white">German Alberto Morelli Gil</span>
              <span className="text-slate-400 ml-2">262730</span>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.header>
  );
};

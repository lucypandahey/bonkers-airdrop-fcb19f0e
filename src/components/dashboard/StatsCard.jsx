import React from 'react';
import { motion } from 'framer-motion';

export default function StatsCard({ 
  title, 
  value, 
  icon: Icon, 
  subtitle, 
  gradient,
  delay = 0,
  usdValue // New prop for USD equivalent
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      className="relative group"
    >
      <div className="absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl blur-sm"
           style={{ background: gradient }} />
      
      <div className="relative bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 hover:border-white/30 transition-all duration-300">
        <div className="flex items-center justify-between mb-4">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-r ${gradient}`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
        </div>
        
        <div className="space-y-1">
          <p className="text-white/60 text-sm font-medium">{title}</p>
          <p className="text-3xl font-bold text-white">{value}</p>
          {subtitle && (
            <p className="text-white/40 text-xs">{subtitle}</p>
          )}
          {usdValue && (
            <p className="text-white/60 text-sm">≈ ${usdValue}</p>
          )}
        </div>
      </div>
    </motion.div>
  );
}
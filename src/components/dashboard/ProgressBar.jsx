import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Clock, Zap } from 'lucide-react';

export default function ProgressBar({ user }) {
  const [timeLeft, setTimeLeft] = useState(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const updateProgress = () => {
      if (!user?.last_claim_date) {
        setProgress(100);
        setTimeLeft(null);
        return;
      }

      const lastClaim = new Date(user.last_claim_date);
      const nextClaim = new Date(lastClaim.getTime() + 24 * 60 * 60 * 1000);
      const now = new Date();
      const totalTime = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
      const timeElapsed = now - lastClaim;
      const timeRemaining = nextClaim - now;

      if (timeRemaining <= 0) {
        setProgress(100);
        setTimeLeft(null);
      } else {
        const progressPercent = (timeElapsed / totalTime) * 100;
        setProgress(Math.min(progressPercent, 100));
        
        const hours = Math.floor(timeRemaining / (1000 * 60 * 60));
        const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);
        
        setTimeLeft({ hours, minutes, seconds });
      }
    };

    updateProgress();
    const interval = setInterval(updateProgress, 1000);
    
    return () => clearInterval(interval);
  }, [user]);

  const canClaim = progress >= 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 mb-6"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
            canClaim ? 'bg-green-500' : 'bg-orange-500'
          }`}>
            {canClaim ? <Zap className="w-5 h-5 text-white" /> : <Clock className="w-5 h-5 text-white" />}
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Next Airdrop</h3>
            <p className="text-white/60 text-sm">
              {canClaim ? 'Ready to claim!' : 'Charging up...'}
            </p>
          </div>
        </div>
        
        {timeLeft && (
          <div className="text-right">
            <div className="text-2xl font-bold text-white font-mono">
              {String(timeLeft.hours).padStart(2, '0')}:
              {String(timeLeft.minutes).padStart(2, '0')}:
              {String(timeLeft.seconds).padStart(2, '0')}
            </div>
            <p className="text-white/60 text-sm">remaining</p>
          </div>
        )}
      </div>

      <div className="relative">
        <div className="w-full bg-white/10 rounded-full h-3 overflow-hidden">
          <motion.div
            className={`h-full rounded-full transition-all duration-1000 ${
              canClaim 
                ? 'bg-gradient-to-r from-green-400 to-green-600' 
                : 'bg-gradient-to-r from-orange-400 to-orange-600'
            }`}
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
        
        <div className="flex justify-between text-xs text-white/60 mt-2">
          <span>Last claim</span>
          <span className="font-medium">{Math.round(progress)}% charged</span>
          <span>24h cycle</span>
        </div>
      </div>

      {canClaim && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="mt-4 text-center"
        >
          <div className="inline-flex items-center space-x-2 bg-green-500/20 text-green-400 px-4 py-2 rounded-full border border-green-500/30">
            <Zap className="w-4 h-4" />
            <span className="font-semibold">Airdrop Ready!</span>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
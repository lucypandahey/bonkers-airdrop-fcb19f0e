import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Zap, Check, Loader2 } from 'lucide-react';
import { User } from '@/api/entities';

export default function ClaimButton({ user, onClaim }) {
  const [claiming, setClaiming] = useState(false);
  const [claimed, setClaimed] = useState(false);

  const canClaim = () => {
    if (!user?.last_claim_date) return true;
    const lastClaim = new Date(user.last_claim_date);
    const now = new Date();
    const hoursSinceClaim = (now - lastClaim) / (1000 * 60 * 60);
    return hoursSinceClaim >= 24;
  };

  const getTimeUntilNextClaim = () => {
    if (!user?.last_claim_date) return null;
    const lastClaim = new Date(user.last_claim_date);
    const nextClaim = new Date(lastClaim.getTime() + 24 * 60 * 60 * 1000);
    const now = new Date();
    const timeLeft = nextClaim - now;
    
    if (timeLeft <= 0) return null;
    
    const hours = Math.floor(timeLeft / (1000 * 60 * 60));
    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${hours}h ${minutes}m`;
  };

  const handleClaim = async () => {
    if (!canClaim() || claiming) return;
    
    setClaiming(true);
    try {
      const dailyBonus = 100;
      const referralBonus = (user?.total_referrals || 0) * 10;
      const totalClaim = dailyBonus + referralBonus;
      
      await User.updateMyUserData({
        airdrop_balance: (user?.airdrop_balance || 0) + totalClaim,
        last_claim_date: new Date().toISOString().split('T')[0]
      });
      
      setClaimed(true);
      setTimeout(() => setClaimed(false), 3000);
      
      if (onClaim) onClaim();
    } catch (error) {
      console.error('Error claiming airdrop:', error);
    } finally {
      setClaiming(false);
    }
  };

  const timeLeft = getTimeUntilNextClaim();

  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 0.3 }}
      className="relative"
    >
      {canClaim() ? (
        <Button
          onClick={handleClaim}
          disabled={claiming || claimed}
          className={`w-full h-14 text-lg font-bold rounded-2xl transition-all duration-300 ${
            claimed
              ? 'bg-green-500 hover:bg-green-500'
              : 'bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 shadow-lg shadow-purple-500/25'
          }`}
        >
          {claiming ? (
            <div className="flex items-center space-x-2">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Claiming...</span>
            </div>
          ) : claimed ? (
            <div className="flex items-center space-x-2">
              <Check className="w-5 h-5" />
              <span>Claimed!</span>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <Zap className="w-5 h-5" />
              <span>Claim Daily Airdrop</span>
            </div>
          )}
        </Button>
      ) : (
        <Button
          disabled
          className="w-full h-14 text-lg font-bold rounded-2xl bg-white/10 text-white/50 cursor-not-allowed"
        >
          <div className="flex items-center space-x-2">
            <Zap className="w-5 h-5" />
            <span>Next claim in {timeLeft}</span>
          </div>
        </Button>
      )}
      
      <div className="mt-3 text-center">
        <p className="text-white/60 text-sm">
          Daily: <span className="text-white font-semibold">100 BONK</span>
          {user?.total_referrals > 0 && (
            <> + Bonus: <span className="text-cyan-400 font-semibold">{user.total_referrals * 10} BONK</span></>
          )}
        </p>
      </div>
    </motion.div>
  );
}
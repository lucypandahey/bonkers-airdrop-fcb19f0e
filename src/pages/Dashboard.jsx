import React, { useState, useEffect } from "react";
import { User } from "@/api/entities";
import { Referral } from "@/api/entities";
import { motion } from "framer-motion";
import { 
  Coins, 
  Users, 
  TrendingUp, 
  Gift,
  Share2,
  Trophy,
  Target,
  DollarSign,
  ArrowUpDown
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

import StatsCard from "../components/dashboard/StatsCard";
import ClaimButton from "../components/dashboard/ClaimButton";
import ProgressBar from "../components/dashboard/ProgressBar";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [recentReferrals, setRecentReferrals] = useState([]);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const currentUser = await User.me();
      
      // Initialize user data if not set
      const userData = {
        airdrop_balance: currentUser.airdrop_balance || 100,
        total_referrals: currentUser.total_referrals || 0,
        total_earned: currentUser.total_earned || 0,
        referral_code: currentUser.referral_code || generateReferralCode(currentUser.full_name),
        usdt_balance: currentUser.usdt_balance || 0
      };
      
      // Update user if any fields are missing
      if (!currentUser.referral_code || currentUser.airdrop_balance === undefined || currentUser.usdt_balance === undefined) {
        await User.updateMyUserData(userData);
      }
      
      setUser({ ...currentUser, ...userData });

      // Load recent referrals
      const referrals = await Referral.filter(
        { referrer_email: currentUser.email },
        '-created_date',
        5
      );
      setRecentReferrals(referrals);
      
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateReferralCode = (name) => {
    const cleanName = name.replace(/\s+/g, '').substring(0, 6).toUpperCase();
    const randomNum = Math.floor(Math.random() * 1000);
    return `${cleanName}${randomNum}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400"></div>
      </div>
    );
  }

  const statsData = [
    {
      title: "Airdrop Balance",
      value: `${user?.airdrop_balance || 0}`,
      subtitle: "BONK Tokens",
      icon: Coins,
      gradient: "from-yellow-500 to-orange-500",
      usdValue: ((user?.airdrop_balance || 0) * 0.01).toFixed(2)
    },
    {
      title: "USDT Balance", 
      value: `$${(user?.usdt_balance || 0).toFixed(2)}`,
      subtitle: "Ready to withdraw",
      icon: DollarSign,
      gradient: "from-green-500 to-emerald-500"
    },
    {
      title: "Total Referrals",
      value: user?.total_referrals || 0,
      subtitle: "Active referrals",
      icon: Users,
      gradient: "from-purple-500 to-pink-500"
    },
    {
      title: "Tokens Earned",
      value: `${user?.total_earned || 0}`,
      subtitle: "From referrals",
      icon: TrendingUp,
      gradient: "from-cyan-500 to-blue-500",
      usdValue: ((user?.total_earned || 0) * 0.01).toFixed(2)
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent mb-4">
          Welcome to Bonkers
        </h1>
        <p className="text-white/60 text-lg md:text-xl max-w-2xl mx-auto">
          The most viral Web3 airdrop platform. Claim daily rewards and earn more through referrals.
        </p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statsData.map((stat, index) => (
          <StatsCard
            key={stat.title}
            {...stat}
            delay={index * 0.1}
          />
        ))}
      </div>

      {/* Progress Bar */}
      <ProgressBar user={user} />

      {/* Main Action Area */}
      <div className="grid lg:grid-cols-3 gap-6 mb-8">
        {/* Claim Section */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 border border-white/20"
        >
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-xl flex items-center justify-center">
              <Gift className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">Daily Airdrop</h3>
              <p className="text-white/60 text-sm">Claim your free tokens</p>
            </div>
          </div>

          <ClaimButton user={user} onClaim={loadUserData} />
        </motion.div>

        {/* Swap Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 border border-white/20"
        >
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
              <ArrowUpDown className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">Swap to USDT</h3>
              <p className="text-white/60 text-sm">Convert BONK to stable coin</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <p className="text-white/60 text-sm mb-2">Exchange Rate</p>
              <p className="text-xl font-bold text-white">
                1 BONK = $0.01
              </p>
              <p className="text-green-400 text-sm">100:1 ratio</p>
            </div>

            <Link to={createPageUrl("Swap")} className="block">
              <Button className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 rounded-xl h-12">
                <ArrowUpDown className="w-4 h-4 mr-2" />
                Start Swapping
              </Button>
            </Link>
          </div>
        </motion.div>

        {/* Referral Section */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 border border-white/20"
        >
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-purple-500 rounded-xl flex items-center justify-center">
              <Share2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">Invite & Earn</h3>
              <p className="text-white/60 text-sm">Get 50 BONK per referral</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <p className="text-white/60 text-sm mb-2">Your referral code</p>
              <p className="text-lg font-bold text-white font-mono">
                {user?.referral_code || 'Loading...'}
              </p>
            </div>

            <Link to={createPageUrl("Referrals")} className="block">
              <Button className="w-full bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 rounded-xl h-12">
                <Share2 className="w-4 h-4 mr-2" />
                Start Referring
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="grid md:grid-cols-2 gap-6 mb-8"
      >
        <Link to={createPageUrl("Tasks")} className="block">
          <div className="bg-gradient-to-r from-orange-500/20 to-red-500/20 backdrop-blur-xl rounded-2xl p-6 border border-orange-500/30 hover:border-orange-500/50 transition-all duration-300 group">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Target className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Complete Tasks</h3>
                <p className="text-white/60">Earn bonus BONK tokens</p>
              </div>
            </div>
          </div>
        </Link>

        <Link to={createPageUrl("Leaderboard")} className="block">
          <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 backdrop-blur-xl rounded-2xl p-6 border border-yellow-500/30 hover:border-yellow-500/50 transition-all duration-300 group">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Trophy className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Leaderboard</h3>
                <p className="text-white/60">See top performers</p>
              </div>
            </div>
          </div>
        </Link>
      </div>

      {/* Recent Activity */}
      {recentReferrals.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20"
        >
          <h3 className="text-2xl font-bold text-white mb-6">Recent Referrals</h3>
          <div className="space-y-4">
            {recentReferrals.map((referral, index) => (
              <div key={referral.id} className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10">
                <div>
                  <p className="text-white font-medium">{referral.referred_email}</p>
                  <p className="text-white/60 text-sm">
                    {new Date(referral.created_date).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-cyan-400 font-bold">+{referral.bonus_tokens} BONK</p>
                  <p className={`text-xs ${referral.status === 'rewarded' ? 'text-green-400' : 'text-yellow-400'}`}>
                    {referral.status}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
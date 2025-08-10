import React, { useState, useEffect } from "react";
import { User } from "@/api/entities";
import { motion } from "framer-motion";
import { Trophy, Medal, Award, Crown, Users, TrendingUp } from "lucide-react";

export default function Leaderboard() {
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('referrals');

  useEffect(() => {
    loadLeaderboard();
  }, [activeTab]);

  const loadLeaderboard = async () => {
    try {
      const currentUser = await User.me();
      setCurrentUser(currentUser);

      const sortField = activeTab === 'referrals' ? '-total_referrals' : '-total_earned';
      const allUsers = await User.list(sortField, 50);
      
      // Filter users who have activity and set defaults
      const activeUsers = allUsers
        .map(user => ({
          ...user,
          total_referrals: user.total_referrals || 0,
          total_earned: user.total_earned || 0
        }))
        .filter(user => user.total_referrals > 0 || user.total_earned > 0);
      
      setUsers(activeUsers);
    } catch (error) {
      console.error('Error loading leaderboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRankIcon = (rank) => {
    switch (rank) {
      case 1: return <Crown className="w-6 h-6 text-yellow-400" />;
      case 2: return <Trophy className="w-6 h-6 text-gray-300" />;
      case 3: return <Medal className="w-6 h-6 text-orange-400" />;
      default: return <Award className="w-5 h-5 text-white/40" />;
    }
  };

  const getRankBg = (rank) => {
    switch (rank) {
      case 1: return "bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border-yellow-500/50";
      case 2: return "bg-gradient-to-r from-gray-400/20 to-gray-500/20 border-gray-400/50";
      case 3: return "bg-gradient-to-r from-orange-500/20 to-red-500/20 border-orange-500/50";
      default: return "bg-white/5 border-white/10";
    }
  };

  const getCurrentUserRank = () => {
    if (!currentUser) return null;
    const rank = users.findIndex(user => user.email === currentUser.email) + 1;
    return rank > 0 ? rank : null;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent mb-4">
          Leaderboard
        </h1>
        <p className="text-white/60 text-lg">
          See who's dominating the airdrop game!
        </p>
      </motion.div>

      {/* Toggle Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex justify-center mb-8"
      >
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-2 border border-white/20">
          <button
            onClick={() => setActiveTab('referrals')}
            className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 flex items-center space-x-2 ${
              activeTab === 'referrals'
                ? 'bg-purple-600 text-white shadow-lg'
                : 'text-white/60 hover:text-white'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Top Referrers</span>
          </button>
          <button
            onClick={() => setActiveTab('earnings')}
            className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 flex items-center space-x-2 ${
              activeTab === 'earnings'
                ? 'bg-purple-600 text-white shadow-lg'
                : 'text-white/60 hover:text-white'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            <span>Top Earners</span>
          </button>
        </div>
      </motion.div>

      {/* Current User Rank */}
      {getCurrentUserRank() && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-xl rounded-2xl p-6 border border-purple-500/30 mb-8"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold">YOU</span>
              </div>
              <div>
                <p className="text-white font-bold">Your Rank</p>
                <p className="text-white/60">#{getCurrentUserRank()}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-white">
                {activeTab === 'referrals' ? currentUser?.total_referrals || 0 : currentUser?.total_earned || 0}
              </p>
              <p className="text-white/60">
                {activeTab === 'referrals' ? 'referrals' : 'BONK earned'}
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {users.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-center py-12"
        >
          <Trophy className="w-16 h-16 text-white/20 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-white mb-2">No Rankings Yet</h3>
          <p className="text-white/60">Be the first to make a referral and claim the top spot!</p>
        </motion.div>
      ) : (
        <>
          {/* Top 3 Podium */}
          {users.length >= 3 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="grid grid-cols-3 gap-4 mb-8"
            >
              {/* 2nd Place */}
              <div className="bg-gradient-to-r from-gray-400/20 to-gray-500/20 backdrop-blur-xl rounded-2xl p-6 border border-gray-400/30 text-center order-1">
                <div className="w-16 h-16 bg-gradient-to-r from-gray-400 to-gray-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Trophy className="w-8 h-8 text-white" />
                </div>
                <p className="text-white font-bold text-lg mb-1">{users[1]?.full_name}</p>
                <p className="text-3xl font-bold text-white mb-2">
                  {activeTab === 'referrals' ? users[1]?.total_referrals : users[1]?.total_earned}
                </p>
                <p className="text-white/60 text-sm">#2</p>
              </div>

              {/* 1st Place */}
              <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 backdrop-blur-xl rounded-2xl p-6 border border-yellow-500/30 text-center order-2 transform scale-105">
                <div className="w-20 h-20 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Crown className="w-10 h-10 text-white" />
                </div>
                <p className="text-white font-bold text-xl mb-1">{users[0]?.full_name}</p>
                <p className="text-4xl font-bold text-white mb-2">
                  {activeTab === 'referrals' ? users[0]?.total_referrals : users[0]?.total_earned}
                </p>
                <p className="text-yellow-400 font-bold">#1 CHAMPION</p>
              </div>

              {/* 3rd Place */}
              <div className="bg-gradient-to-r from-orange-500/20 to-red-500/20 backdrop-blur-xl rounded-2xl p-6 border border-orange-500/30 text-center order-3">
                <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Medal className="w-8 h-8 text-white" />
                </div>
                <p className="text-white font-bold text-lg mb-1">{users[2]?.full_name}</p>
                <p className="text-3xl font-bold text-white mb-2">
                  {activeTab === 'referrals' ? users[2]?.total_referrals : users[2]?.total_earned}
                </p>
                <p className="text-white/60 text-sm">#3</p>
              </div>
            </motion.div>
          )}

          {/* Full Leaderboard */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 overflow-hidden"
          >
            <div className="p-6 border-b border-white/10">
              <h2 className="text-2xl font-bold text-white">Full Rankings</h2>
            </div>
            
            <div className="max-h-96 overflow-y-auto">
              {users.map((user, index) => {
                const rank = index + 1;
                const isCurrentUser = user.email === currentUser?.email;
                
                return (
                  <motion.div
                    key={user.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + index * 0.05 }}
                    className={`flex items-center justify-between p-4 border-b border-white/5 last:border-b-0 ${
                      isCurrentUser ? 'bg-purple-500/20' : 'hover:bg-white/5'
                    } ${getRankBg(rank)}`}
                  >
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center justify-center w-8 h-8">
                        {getRankIcon(rank)}
                      </div>
                      <div className="w-8 text-white/60 font-bold">#{rank}</div>
                      <div>
                        <p className={`font-bold ${isCurrentUser ? 'text-purple-300' : 'text-white'}`}>
                          {user.full_name} {isCurrentUser && '(You)'}
                        </p>
                        <p className="text-white/60 text-sm">
                          {activeTab === 'referrals' 
                            ? `${user.total_earned || 0} BONK earned`
                            : `${user.total_referrals || 0} referrals`
                          }
                        </p>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <p className="text-2xl font-bold text-white">
                        {activeTab === 'referrals' ? user.total_referrals : user.total_earned}
                      </p>
                      <p className="text-white/60 text-sm">
                        {activeTab === 'referrals' ? 'referrals' : 'BONK'}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </>
      )}
    </div>
  );
}
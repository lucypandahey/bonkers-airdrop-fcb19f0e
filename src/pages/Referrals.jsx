import React, { useState, useEffect } from "react";
import { User } from "@/api/entities";
import { Referral } from "@/api/entities";
import { motion } from "framer-motion";
import { 
  Copy, 
  Share2, 
  Users, 
  ExternalLink,
  Check,
  Twitter,
  Send
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

export default function Referrals() {
  const [user, setUser] = useState(null);
  const [referrals, setReferrals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const currentUser = await User.me();
      setUser(currentUser);

      const userReferrals = await Referral.filter(
        { referrer_email: currentUser.email },
        '-created_date'
      );
      setReferrals(userReferrals);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getReferralLink = () => {
    if (!user?.referral_code) return '';
    return `${window.location.origin}?ref=${user.referral_code}`;
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(getReferralLink());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const shareOnTwitter = () => {
    const text = `🎉 Join me on Bonkers - the hottest Web3 airdrop platform! Get free BONK tokens daily and earn more through referrals! 🚀\n\nUse my code: ${user?.referral_code}\n\n`;
    const url = getReferralLink();
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
    window.open(twitterUrl, '_blank');
  };

  const shareOnTelegram = () => {
    const text = `🎉 Join me on Bonkers - the hottest Web3 airdrop platform! Get free BONK tokens daily and earn more through referrals! 🚀\n\nUse my code: ${user?.referral_code}\n\n${getReferralLink()}`;
    const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(getReferralLink())}&text=${encodeURIComponent(text)}`;
    window.open(telegramUrl, '_blank');
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
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
          Refer & Earn
        </h1>
        <p className="text-white/60 text-lg">
          Share your referral link and earn 50 BONK for each friend who joins!
        </p>
      </motion.div>

      {/* Referral Stats */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 text-center"
        >
          <Users className="w-8 h-8 text-purple-400 mx-auto mb-3" />
          <p className="text-3xl font-bold text-white">{user?.total_referrals || 0}</p>
          <p className="text-white/60">Total Referrals</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 text-center"
        >
          <div className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full flex items-center justify-center mx-auto mb-3">
            <span className="text-sm font-bold text-white">₿</span>
          </div>
          <p className="text-3xl font-bold text-white">{user?.total_earned || 0}</p>
          <p className="text-white/60">BONK Earned</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 text-center"
        >
          <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-cyan-400 rounded-full flex items-center justify-center mx-auto mb-3">
            <span className="text-sm font-bold text-white">50</span>
          </div>
          <p className="text-3xl font-bold text-white">50</p>
          <p className="text-white/60">BONK per Referral</p>
        </motion.div>
      </div>

      {/* Referral Link Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 mb-8"
      >
        <h2 className="text-2xl font-bold text-white mb-6 text-center">Your Referral Link</h2>
        
        <div className="space-y-6">
          <div className="bg-white/5 rounded-xl p-4 border border-white/10">
            <p className="text-white/60 text-sm mb-2">Referral Code</p>
            <p className="text-2xl font-bold text-white font-mono text-center">
              {user?.referral_code}
            </p>
          </div>

          <div className="flex gap-2">
            <Input
              value={getReferralLink()}
              readOnly
              className="bg-white/5 border-white/20 text-white flex-1 rounded-xl"
            />
            <Button
              onClick={copyToClipboard}
              className={`px-4 rounded-xl transition-all duration-200 ${
                copied 
                  ? 'bg-green-500 hover:bg-green-500' 
                  : 'bg-purple-600 hover:bg-purple-700'
              }`}
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            </Button>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <Button
              onClick={shareOnTwitter}
              className="bg-blue-600 hover:bg-blue-700 rounded-xl h-12 flex items-center justify-center space-x-2"
            >
              <Twitter className="w-5 h-5" />
              <span>Share on Twitter</span>
              <ExternalLink className="w-4 h-4" />
            </Button>
            
            <Button
              onClick={shareOnTelegram}
              className="bg-cyan-600 hover:bg-cyan-700 rounded-xl h-12 flex items-center justify-center space-x-2"
            >
              <Send className="w-5 h-5" />
              <span>Share on Telegram</span>
              <ExternalLink className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Referral History */}
      {referrals.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20"
        >
          <h2 className="text-2xl font-bold text-white mb-6">Referral History</h2>
          
          <div className="space-y-4">
            {referrals.map((referral, index) => (
              <motion.div
                key={referral.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + index * 0.1 }}
                className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                    <Users className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-white font-medium">{referral.referred_email}</p>
                    <p className="text-white/60 text-sm">
                      Joined {new Date(referral.created_date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                
                <div className="text-right">
                  <p className="text-cyan-400 font-bold text-lg">+{referral.bonus_tokens} BONK</p>
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                    referral.status === 'rewarded' 
                      ? 'bg-green-500/20 text-green-400' 
                      : referral.status === 'confirmed'
                      ? 'bg-blue-500/20 text-blue-400'
                      : 'bg-yellow-500/20 text-yellow-400'
                  }`}>
                    {referral.status}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
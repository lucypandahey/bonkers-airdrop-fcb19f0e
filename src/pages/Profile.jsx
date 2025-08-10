import React, { useState, useEffect } from "react";
import { User } from "@/api/entities";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  User as UserIcon, 
  Wallet, 
  Twitter, 
  Send,
  Save,
  LogOut,
  Settings
} from "lucide-react";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    wallet_address: '',
    twitter_handle: '',
    telegram_username: ''
  });

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const currentUser = await User.me();
      setUser(currentUser);
      setFormData({
        wallet_address: currentUser.wallet_address || '',
        twitter_handle: currentUser.twitter_handle || '',
        telegram_username: currentUser.telegram_username || ''
      });
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await User.updateMyUserData(formData);
      setUser(prev => ({ ...prev, ...formData }));
    } catch (error) {
      console.error('Error saving profile:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    try {
      await User.logout();
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400"></div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent mb-4">
          Your Profile
        </h1>
        <p className="text-white/60 text-lg">
          Manage your account settings and preferences
        </p>
      </motion.div>

      {/* Profile Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 mb-8"
      >
        <div className="flex items-center space-x-6">
          <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full flex items-center justify-center">
            <UserIcon className="w-10 h-10 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">{user?.full_name}</h2>
            <p className="text-white/60">{user?.email}</p>
            <p className="text-purple-300 font-medium mt-1">
              Member since {new Date(user?.created_date).toLocaleDateString()}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Account Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid md:grid-cols-3 gap-4 mb-8"
      >
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 text-center">
          <div className="text-3xl font-bold text-white">{user?.airdrop_balance || 0}</div>
          <div className="text-white/60">BONK Balance</div>
        </div>
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 text-center">
          <div className="text-3xl font-bold text-white">{user?.total_referrals || 0}</div>
          <div className="text-white/60">Total Referrals</div>
        </div>
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 text-center">
          <div className="text-3xl font-bold text-white">{user?.total_earned || 0}</div>
          <div className="text-white/60">BONK Earned</div>
        </div>
      </motion.div>

      {/* Settings Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 mb-8"
      >
        <div className="flex items-center space-x-3 mb-6">
          <Settings className="w-6 h-6 text-white" />
          <h3 className="text-2xl font-bold text-white">Account Settings</h3>
        </div>

        <div className="space-y-6">
          <div>
            <Label className="text-white/80 flex items-center space-x-2 mb-2">
              <Wallet className="w-4 h-4" />
              <span>Wallet Address</span>
            </Label>
            <Input
              value={formData.wallet_address}
              onChange={(e) => handleInputChange('wallet_address', e.target.value)}
              placeholder="0x..."
              className="bg-white/5 border-white/20 text-white rounded-xl"
            />
            <p className="text-white/40 text-sm mt-1">
              Add your wallet address to receive airdrop tokens
            </p>
          </div>

          <div>
            <Label className="text-white/80 flex items-center space-x-2 mb-2">
              <Twitter className="w-4 h-4" />
              <span>Twitter Handle</span>
            </Label>
            <Input
              value={formData.twitter_handle}
              onChange={(e) => handleInputChange('twitter_handle', e.target.value)}
              placeholder="@yourusername"
              className="bg-white/5 border-white/20 text-white rounded-xl"
            />
          </div>

          <div>
            <Label className="text-white/80 flex items-center space-x-2 mb-2">
              <Send className="w-4 h-4" />
              <span>Telegram Username</span>
            </Label>
            <Input
              value={formData.telegram_username}
              onChange={(e) => handleInputChange('telegram_username', e.target.value)}
              placeholder="@yourusername"
              className="bg-white/5 border-white/20 text-white rounded-xl"
            />
          </div>

          <Button
            onClick={handleSave}
            disabled={saving}
            className="w-full bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 rounded-xl h-12"
          >
            <Save className="w-4 h-4 mr-2" />
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </motion.div>

      {/* Account Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20"
      >
        <h3 className="text-2xl font-bold text-white mb-6">Account Actions</h3>
        
        <div className="space-y-4">
          <div className="bg-white/5 rounded-xl p-4 border border-white/10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white font-medium">Your Referral Code</p>
                <p className="text-white/60 text-sm">Share this code to earn referral bonuses</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-purple-300 font-mono">
                  {user?.referral_code}
                </p>
              </div>
            </div>
          </div>

          <Button
            onClick={handleLogout}
            variant="outline"
            className="w-full border-red-500/50 text-red-400 hover:bg-red-500/20 rounded-xl h-12"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </motion.div>
    </div>
  );
}

import React, { useState, useEffect } from "react";
import { User } from "@/api/entities";
import { Transaction } from "@/api/entities";
import { motion } from "framer-motion";
import { 
  ArrowUpDown, 
  Wallet, 
  History,
  TrendingUp,
  DollarSign,
  ExternalLink
} from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

import WalletConnection from "../components/swap/WalletConnection";
import SwapInterface from "../components/swap/SwapInterface";
import WithdrawInterface from "../components/swap/WithdrawInterface";

export default function Swap() {
  const [user, setUser] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('swap');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const currentUser = await User.me();
      
      // Initialize user data if not set
      const userData = {
        usdt_balance: currentUser.usdt_balance || 0,
        wallet_connected: currentUser.wallet_connected || false,
        ...currentUser
      };
      
      setUser(userData);

      // Load transaction history
      const userTransactions = await Transaction.filter(
        { user_email: currentUser.email },
        '-created_date',
        20
      );
      setTransactions(userTransactions);
      
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleWalletConnect = (address) => {
    setUser(prev => ({
      ...prev,
      wallet_address: address,
      wallet_connected: !!address
    }));
  };

  const formatTransactionType = (transaction) => {
    if (transaction.transaction_type === 'swap') {
      return `Swap ${transaction.from_currency} → ${transaction.to_currency}`;
    } else if (transaction.transaction_type === 'withdrawal') {
      return `Withdraw ${transaction.from_currency}`;
    }
    return transaction.transaction_type;
  };

  const getTransactionIcon = (transaction) => {
    if (transaction.transaction_type === 'swap') {
      return <ArrowUpDown className="w-4 h-4" />;
    } else if (transaction.transaction_type === 'withdrawal') {
      return <Wallet className="w-4 h-4" />;
    }
    return <History className="w-4 h-4" />;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text text-transparent mb-4">
          Swap & Withdraw
        </h1>
        <p className="text-white/60 text-lg">
          Convert your BONK tokens to USDT and withdraw to your wallet
        </p>
      </motion.div>

      {/* Balance Overview */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20"
        >
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold">B</span>
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">BONK Balance</h3>
              <p className="text-white/60 text-sm">Available for swapping</p>
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-3xl font-bold text-white">
              {(user?.airdrop_balance || 0).toLocaleString()}
            </p>
            <p className="text-white/60 text-sm">
              ≈ ${((user?.airdrop_balance || 0) * 0.01).toFixed(2)} USD
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20"
        >
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">USDT Balance</h3>
              <p className="text-white/60 text-sm">Ready for withdrawal</p>
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-3xl font-bold text-white">
              ${(user?.usdt_balance || 0).toFixed(4)}
            </p>
            <p className="text-green-400 text-sm font-medium">
              <TrendingUp className="w-3 h-3 inline mr-1" />
              Stable value
            </p>
          </div>
        </motion.div>
      </div>

      {/* Main Interface */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3 bg-white/10 backdrop-blur-xl border border-white/20">
            <TabsTrigger 
              value="swap"
              className="data-[state=active]:bg-purple-600 data-[state=active]:text-white"
            >
              <ArrowUpDown className="w-4 h-4 mr-2" />
              Swap
            </TabsTrigger>
            <TabsTrigger 
              value="withdraw"
              className="data-[state=active]:bg-green-600 data-[state=active]:text-white"
            >
              <Wallet className="w-4 h-4 mr-2" />
              Withdraw
            </TabsTrigger>
            <TabsTrigger 
              value="history"
              className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
            >
              <History className="w-4 h-4 mr-2" />
              History
            </TabsTrigger>
          </TabsList>

          <TabsContent value="swap" className="mt-8">
            <div className="grid lg:grid-cols-2 gap-8">
              <SwapInterface user={user} onSwapComplete={loadData} />
              <WalletConnection user={user} onWalletConnect={handleWalletConnect} />
            </div>
          </TabsContent>

          <TabsContent value="withdraw" className="mt-8">
            <div className="grid lg:grid-cols-2 gap-8">
              <WithdrawInterface user={user} onWithdrawComplete={loadData} />
              <WalletConnection user={user} onWalletConnect={handleWalletConnect} />
            </div>
          </TabsContent>

          <TabsContent value="history" className="mt-8">
            <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 overflow-hidden">
              <div className="p-6 border-b border-white/10">
                <h3 className="text-xl font-bold text-white">Transaction History</h3>
                <p className="text-white/60 text-sm">Your recent swaps and withdrawals</p>
              </div>
              
              {transactions.length === 0 ? (
                <div className="p-8 text-center">
                  <History className="w-12 h-12 text-white/20 mx-auto mb-4" />
                  <p className="text-white/60">No transactions yet</p>
                  <p className="text-white/40 text-sm">Start by swapping some BONK tokens!</p>
                </div>
              ) : (
                <div className="divide-y divide-white/5">
                  {transactions.map((transaction, index) => (
                    <motion.div
                      key={transaction.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="p-6 hover:bg-white/5 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            transaction.transaction_type === 'swap' ? 'bg-purple-500/20' :
                            transaction.transaction_type === 'withdrawal' ? 'bg-green-500/20' : 'bg-blue-500/20'
                          }`}>
                            {getTransactionIcon(transaction)}
                          </div>
                          <div>
                            <p className="text-white font-medium">
                              {formatTransactionType(transaction)}
                            </p>
                            <p className="text-white/60 text-sm">
                              {new Date(transaction.created_date).toLocaleDateString()} at{' '}
                              {new Date(transaction.created_date).toLocaleTimeString()}
                            </p>
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <p className="text-white font-bold">
                            {transaction.transaction_type === 'swap' ? 
                              `${transaction.amount_from.toLocaleString()} ${transaction.from_currency} → $${transaction.amount_to.toFixed(4)}` :
                              `$${transaction.amount_from.toFixed(4)} ${transaction.from_currency}`
                            }
                          </p>
                          <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                            transaction.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                            transaction.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                            'bg-red-500/20 text-red-400'
                          }`}>
                            {transaction.status}
                          </span>
                        </div>
                      </div>
                      
                      {transaction.transaction_hash && (
                        <div className="mt-3 pl-14">
                          <button
                            onClick={() => window.open(`https://etherscan.io/tx/${transaction.transaction_hash}`, '_blank')}
                            className="text-cyan-400 hover:text-cyan-300 text-sm flex items-center space-x-1"
                          >
                            <span>View on Etherscan</span>
                            <ExternalLink className="w-3 h-3" />
                          </button>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
}

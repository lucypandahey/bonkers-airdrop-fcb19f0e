import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Send, 
  AlertTriangle,
  ExternalLink,
  CheckCircle
} from 'lucide-react';
import { User } from '@/api/entities';
import { Transaction } from '@/api/entities';

const MIN_WITHDRAWAL = 5; // Minimum $5 USDT withdrawal

export default function WithdrawInterface({ user, onWithdrawComplete }) {
  const [amount, setAmount] = useState('');
  const [withdrawing, setWithdrawing] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const validateWithdrawal = (withdrawAmount) => {
    if (!withdrawAmount || isNaN(withdrawAmount)) {
      return 'Please enter a valid amount';
    }
    
    if (parseFloat(withdrawAmount) < MIN_WITHDRAWAL) {
      return `Minimum withdrawal amount is $${MIN_WITHDRAWAL}`;
    }
    
    if (parseFloat(withdrawAmount) > (user?.usdt_balance || 0)) {
      return 'Insufficient USDT balance';
    }
    
    if (!user?.wallet_connected || !user?.wallet_address) {
      return 'Please connect your wallet first';
    }
    
    return null;
  };

  const handleWithdraw = async () => {
    const validationError = validateWithdrawal(amount);
    if (validationError) {
      setError(validationError);
      return;
    }

    setWithdrawing(true);
    setError('');
    
    try {
      const withdrawAmount = parseFloat(amount);
      
      // Simulate blockchain transaction hash
      const txHash = `0x${Math.random().toString(16).substr(2, 64)}`;
      
      // Create withdrawal transaction
      await Transaction.create({
        user_email: user.email,
        transaction_type: 'withdrawal',
        from_currency: 'USDT',
        to_currency: 'USDT',
        amount_from: withdrawAmount,
        amount_to: withdrawAmount,
        wallet_address: user.wallet_address,
        transaction_hash: txHash,
        status: 'completed'
      });
      
      // Update user balance
      await User.updateMyUserData({
        usdt_balance: (user.usdt_balance || 0) - withdrawAmount
      });
      
      setSuccess(`Successfully withdrawn $${withdrawAmount} USDT to your wallet!`);
      setAmount('');
      
      if (onWithdrawComplete) {
        onWithdrawComplete();
      }
      
      // Clear success message after 5 seconds
      setTimeout(() => setSuccess(''), 5000);
      
    } catch (error) {
      setError('Withdrawal failed. Please try again.');
      console.error('Withdrawal error:', error);
    } finally {
      setWithdrawing(false);
    }
  };

  const setMaxAmount = () => {
    const maxAmount = user?.usdt_balance || 0;
    setAmount(maxAmount.toFixed(4));
  };

  return (
    <Card className="bg-white/10 backdrop-blur-xl border-white/20">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 text-white">
          <Send className="w-5 h-5" />
          <span>Withdraw USDT</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Wallet Info */}
        <div className="bg-green-500/10 rounded-xl p-4 border border-green-500/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-400 font-medium">Withdrawal Address</p>
              <p className="text-white/80 font-mono text-sm">
                {user?.wallet_address ? 
                  `${user.wallet_address.slice(0, 6)}...${user.wallet_address.slice(-4)}` :
                  'No wallet connected'
                }
              </p>
            </div>
            {user?.wallet_address && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => window.open(`https://etherscan.io/address/${user.wallet_address}`, '_blank')}
                className="text-green-400 hover:text-green-300"
              >
                <ExternalLink className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>

        {/* Amount Section */}
        <div className="bg-white/5 rounded-xl p-4 border border-white/10">
          <div className="flex justify-between items-center mb-2">
            <span className="text-white/60 text-sm">Amount to withdraw</span>
            <span className="text-white/60 text-sm">
              Available: ${(user?.usdt_balance || 0).toFixed(4)}
            </span>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-green-500 rounded-full flex items-center justify-center">
                <span className="text-xs font-bold text-white">$</span>
              </div>
              <span className="text-white font-semibold">USDT</span>
            </div>
            
            <Input
              type="number"
              placeholder="0"
              value={amount}
              onChange={(e) => {
                setAmount(e.target.value);
                setError('');
                setSuccess('');
              }}
              className="bg-transparent border-none text-right text-xl font-bold text-white placeholder-white/30 focus:ring-0"
            />
          </div>
          
          <div className="flex justify-end mt-2">
            <Button
              onClick={setMaxAmount}
              variant="ghost"
              size="sm"
              className="text-cyan-400 hover:text-cyan-300 h-6 px-2"
            >
              MAX
            </Button>
          </div>
        </div>

        {/* Success Message */}
        {success && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-green-500/10 border border-green-500/20 rounded-xl p-4"
          >
            <div className="flex items-center space-x-2 text-green-400">
              <CheckCircle className="w-4 h-4" />
              <span className="text-sm">{success}</span>
            </div>
          </motion.div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4">
            <div className="flex items-center space-x-2 text-red-400">
              <AlertTriangle className="w-4 h-4" />
              <span className="text-sm">{error}</span>
            </div>
          </div>
        )}

        {/* Withdrawal Info */}
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
          <div className="text-blue-400 text-sm space-y-1">
            <p>• Minimum withdrawal: ${MIN_WITHDRAWAL}</p>
            <p>• Network: Ethereum (ERC-20)</p>
            <p>• Processing time: 1-5 minutes</p>
            <p>• Gas fees covered by platform</p>
          </div>
        </div>

        {/* Withdraw Button */}
        <Button
          onClick={handleWithdraw}
          disabled={withdrawing || !amount || !!validateWithdrawal(amount)}
          className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 rounded-xl h-12 text-lg font-semibold"
        >
          {withdrawing ? (
            <div className="flex items-center space-x-2">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
              <span>Processing withdrawal...</span>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <Send className="w-5 h-5" />
              <span>Withdraw to Wallet</span>
            </div>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
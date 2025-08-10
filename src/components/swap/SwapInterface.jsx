import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  ArrowUpDown, 
  ArrowDown, 
  AlertTriangle,
  Info,
  TrendingUp
} from 'lucide-react';
import { User } from '@/api/entities';
import { Transaction } from '@/api/entities';

const EXCHANGE_RATE = 0.01; // 100 BONK = 1 USDT
const MIN_SWAP = 1000; // Minimum 1000 BONK
const FEE_PERCENTAGE = 0.1; // 10% fee

export default function SwapInterface({ user, onSwapComplete }) {
  const [fromAmount, setFromAmount] = useState('');
  const [toAmount, setToAmount] = useState('');
  const [swapping, setSwapping] = useState(false);
  const [error, setError] = useState('');

  const calculateSwap = (bonkAmount) => {
    if (!bonkAmount || isNaN(bonkAmount)) return { usdt: 0, fee: 0, net: 0 };
    
    const usdtGross = bonkAmount * EXCHANGE_RATE;
    const fee = usdtGross * FEE_PERCENTAGE;
    const usdtNet = usdtGross - fee;
    
    return {
      usdt: usdtGross,
      fee: fee,
      net: usdtNet
    };
  };

  const handleFromAmountChange = (value) => {
    setFromAmount(value);
    setError('');
    
    if (value && !isNaN(value)) {
      const calc = calculateSwap(parseFloat(value));
      setToAmount(calc.net.toFixed(4));
    } else {
      setToAmount('');
    }
  };

  const validateSwap = (amount) => {
    if (!amount || isNaN(amount)) {
      return 'Please enter a valid amount';
    }
    
    if (parseFloat(amount) < MIN_SWAP) {
      return `Minimum swap amount is ${MIN_SWAP.toLocaleString()} BONK`;
    }
    
    if (parseFloat(amount) > (user?.airdrop_balance || 0)) {
      return 'Insufficient BONK balance';
    }
    
    return null;
  };

  const handleSwap = async () => {
    const validationError = validateSwap(fromAmount);
    if (validationError) {
      setError(validationError);
      return;
    }

    setSwapping(true);
    
    try {
      const bonkAmount = parseFloat(fromAmount);
      const calc = calculateSwap(bonkAmount);
      
      // Create transaction record
      await Transaction.create({
        user_email: user.email,
        transaction_type: 'swap',
        from_currency: 'BONK',
        to_currency: 'USDT',
        amount_from: bonkAmount,
        amount_to: calc.net,
        fee_amount: calc.fee,
        exchange_rate: EXCHANGE_RATE,
        status: 'completed'
      });
      
      // Update user balances
      await User.updateMyUserData({
        airdrop_balance: (user.airdrop_balance || 0) - bonkAmount,
        usdt_balance: (user.usdt_balance || 0) + calc.net
      });
      
      // Reset form
      setFromAmount('');
      setToAmount('');
      
      if (onSwapComplete) {
        onSwapComplete();
      }
      
    } catch (error) {
      setError('Swap failed. Please try again.');
      console.error('Swap error:', error);
    } finally {
      setSwapping(false);
    }
  };

  const setMaxAmount = () => {
    const maxAmount = user?.airdrop_balance || 0;
    setFromAmount(maxAmount.toString());
    handleFromAmountChange(maxAmount.toString());
  };

  const swapDetails = calculateSwap(parseFloat(fromAmount) || 0);

  return (
    <Card className="bg-white/10 backdrop-blur-xl border-white/20">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 text-white">
          <ArrowUpDown className="w-5 h-5" />
          <span>Swap BONK to USDT</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* From Section */}
        <div className="bg-white/5 rounded-xl p-4 border border-white/10">
          <div className="flex justify-between items-center mb-2">
            <span className="text-white/60 text-sm">From</span>
            <span className="text-white/60 text-sm">
              Balance: {(user?.airdrop_balance || 0).toLocaleString()} BONK
            </span>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full flex items-center justify-center">
                <span className="text-xs font-bold text-white">B</span>
              </div>
              <span className="text-white font-semibold">BONK</span>
            </div>
            
            <Input
              type="number"
              placeholder="0"
              value={fromAmount}
              onChange={(e) => handleFromAmountChange(e.target.value)}
              className="bg-transparent border-none text-right text-xl font-bold text-white placeholder-white/30 focus:ring-0"
            />
          </div>
          
          <div className="flex justify-between items-center mt-2">
            <Button
              onClick={setMaxAmount}
              variant="ghost"
              size="sm"
              className="text-cyan-400 hover:text-cyan-300 h-6 px-2"
            >
              MAX
            </Button>
            <span className="text-white/60 text-sm">
              ≈ ${((parseFloat(fromAmount) || 0) * EXCHANGE_RATE).toFixed(4)}
            </span>
          </div>
        </div>

        {/* Arrow */}
        <div className="flex justify-center">
          <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center">
            <ArrowDown className="w-5 h-5 text-white/60" />
          </div>
        </div>

        {/* To Section */}
        <div className="bg-white/5 rounded-xl p-4 border border-white/10">
          <div className="flex justify-between items-center mb-2">
            <span className="text-white/60 text-sm">To (after 10% fee)</span>
            <span className="text-white/60 text-sm">
              Balance: ${(user?.usdt_balance || 0).toFixed(4)}
            </span>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-green-500 rounded-full flex items-center justify-center">
                <span className="text-xs font-bold text-white">$</span>
              </div>
              <span className="text-white font-semibold">USDT</span>
            </div>
            
            <div className="flex-1 text-right">
              <span className="text-xl font-bold text-white">
                {toAmount || '0'}
              </span>
            </div>
          </div>
        </div>

        {/* Swap Details */}
        {fromAmount && !isNaN(fromAmount) && parseFloat(fromAmount) > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="bg-blue-500/10 rounded-xl p-4 border border-blue-500/20"
          >
            <div className="flex items-center space-x-2 mb-3">
              <Info className="w-4 h-4 text-blue-400" />
              <span className="text-blue-400 font-medium">Swap Details</span>
            </div>
            
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-white/60">Exchange Rate</span>
                <span className="text-white">1 BONK = $0.01</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/60">USDT (before fee)</span>
                <span className="text-white">${swapDetails.usdt.toFixed(4)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/60">Processing Fee (10%)</span>
                <span className="text-red-400">-${swapDetails.fee.toFixed(4)}</span>
              </div>
              <div className="border-t border-white/10 pt-2 flex justify-between font-semibold">
                <span className="text-white">You'll receive</span>
                <span className="text-green-400">${swapDetails.net.toFixed(4)}</span>
              </div>
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

        {/* Minimum Swap Warning */}
        <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4">
          <div className="flex items-center space-x-2 text-yellow-400">
            <AlertTriangle className="w-4 h-4" />
            <span className="text-sm">
              Minimum swap: {MIN_SWAP.toLocaleString()} BONK • 10% processing fee applies
            </span>
          </div>
        </div>

        {/* Swap Button */}
        <Button
          onClick={handleSwap}
          disabled={swapping || !fromAmount || !!validateSwap(fromAmount)}
          className="w-full bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 rounded-xl h-12 text-lg font-semibold"
        >
          {swapping ? (
            <div className="flex items-center space-x-2">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
              <span>Swapping...</span>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5" />
              <span>Swap to USDT</span>
            </div>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
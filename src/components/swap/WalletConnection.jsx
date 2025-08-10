import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { 
  Wallet, 
  Check, 
  AlertCircle, 
  Copy,
  ExternalLink
} from 'lucide-react';
import { User } from '@/api/entities';

export default function WalletConnection({ user, onWalletConnect }) {
  const [connecting, setConnecting] = useState(false);
  const [error, setError] = useState('');
  const [walletAddress, setWalletAddress] = useState(user?.wallet_address || '');

  const connectWallet = async () => {
    setConnecting(true);
    setError('');
    
    try {
      // Check if MetaMask is installed
      if (typeof window.ethereum === 'undefined') {
        throw new Error('Please install MetaMask to connect your wallet');
      }

      // Request account access
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts'
      });

      if (accounts.length === 0) {
        throw new Error('No accounts found. Please unlock your wallet.');
      }

      const address = accounts[0];
      
      // Update user wallet info
      await User.updateMyUserData({
        wallet_address: address,
        wallet_connected: true
      });
      
      setWalletAddress(address);
      if (onWalletConnect) {
        onWalletConnect(address);
      }
      
    } catch (error) {
      setError(error.message);
      console.error('Wallet connection error:', error);
    } finally {
      setConnecting(false);
    }
  };

  const disconnectWallet = async () => {
    try {
      await User.updateMyUserData({
        wallet_address: '',
        wallet_connected: false
      });
      
      setWalletAddress('');
      if (onWalletConnect) {
        onWalletConnect('');
      }
    } catch (error) {
      console.error('Error disconnecting wallet:', error);
    }
  };

  const copyAddress = () => {
    navigator.clipboard.writeText(walletAddress);
  };

  const openInExplorer = () => {
    window.open(`https://etherscan.io/address/${walletAddress}`, '_blank');
  };

  const formatAddress = (address) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  if (walletAddress) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-green-500/10 backdrop-blur-xl rounded-2xl p-6 border border-green-500/20"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
              <Check className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Wallet Connected</h3>
              <p className="text-white/60 text-sm">Ready for transactions</p>
            </div>
          </div>
        </div>

        <div className="bg-white/5 rounded-xl p-4 border border-white/10 mb-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/60 text-sm mb-1">Connected Address</p>
              <p className="text-white font-mono text-lg">{formatAddress(walletAddress)}</p>
            </div>
            <div className="flex space-x-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={copyAddress}
                className="text-white/60 hover:text-white"
              >
                <Copy className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={openInExplorer}
                className="text-white/60 hover:text-white"
              >
                <ExternalLink className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        <Button
          onClick={disconnectWallet}
          variant="outline"
          className="w-full border-red-500/50 text-red-400 hover:bg-red-500/20"
        >
          Disconnect Wallet
        </Button>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20"
    >
      <div className="text-center">
        <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <Wallet className="w-8 h-8 text-white" />
        </div>
        
        <h3 className="text-xl font-bold text-white mb-2">Connect Wallet</h3>
        <p className="text-white/60 mb-6">
          Connect your Web3 wallet to swap and withdraw USDT
        </p>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 mb-4">
            <div className="flex items-center space-x-2 text-red-400">
              <AlertCircle className="w-4 h-4" />
              <span className="text-sm">{error}</span>
            </div>
          </div>
        )}

        <Button
          onClick={connectWallet}
          disabled={connecting}
          className="w-full bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 rounded-xl h-12"
        >
          {connecting ? (
            <div className="flex items-center space-x-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
              <span>Connecting...</span>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <Wallet className="w-4 h-4" />
              <span>Connect MetaMask</span>
            </div>
          )}
        </Button>

        <p className="text-white/40 text-xs mt-4">
          Don't have MetaMask? <a href="https://metamask.io" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline">Download here</a>
        </p>
      </div>
    </motion.div>
  );
}
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Twitter, 
  MessageSquare, 
  ExternalLink, 
  Check, 
  Clock, 
  X,
  Loader2
} from 'lucide-react';

const TASK_ICONS = {
  twitter_connect: Twitter,
  whatsapp_verify: MessageSquare,
  telegram_join: MessageSquare
};

const TASK_COLORS = {
  twitter_connect: 'from-blue-500 to-blue-600',
  whatsapp_verify: 'from-green-500 to-green-600',
  telegram_join: 'from-cyan-500 to-cyan-600'
};

export default function TaskCard({ 
  task, 
  userTask, 
  onStartTask, 
  onVerifyTask,
  loading 
}) {
  const [isProcessing, setIsProcessing] = useState(false);
  const Icon = TASK_ICONS[task.type] || MessageSquare;
  const colorGradient = TASK_COLORS[task.type] || 'from-purple-500 to-purple-600';

  const getStatus = () => {
    if (!userTask) return 'not_started';
    return userTask.status;
  };

  const getStatusBadge = () => {
    const status = getStatus();
    
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
          <Check className="w-3 h-3 mr-1" />
          Completed
        </Badge>;
      case 'pending':
        return <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
          <Clock className="w-3 h-3 mr-1" />
          Pending Verification
        </Badge>;
      case 'verified':
        return <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
          <Check className="w-3 h-3 mr-1" />
          Verified
        </Badge>;
      case 'rejected':
        return <Badge className="bg-red-500/20 text-red-400 border-red-500/30">
          <X className="w-3 h-3 mr-1" />
          Rejected
        </Badge>;
      default:
        return null;
    }
  };

  const getActionButton = () => {
    const status = getStatus();
    
    if (status === 'completed' || status === 'verified') {
      return (
        <Button disabled className="w-full bg-green-500/20 text-green-400 cursor-not-allowed rounded-xl">
          <Check className="w-4 h-4 mr-2" />
          Completed
        </Button>
      );
    }
    
    if (status === 'pending') {
      return (
        <Button 
          onClick={() => onVerifyTask(task.type)}
          disabled={loading}
          variant="outline" 
          className="w-full border-yellow-500/50 text-yellow-400 hover:bg-yellow-500/20 rounded-xl"
        >
          {loading ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <Clock className="w-4 h-4 mr-2" />
          )}
          Check Verification
        </Button>
      );
    }
    
    return (
      <Button
        onClick={() => onStartTask(task.type)}
        disabled={loading}
        className={`w-full bg-gradient-to-r ${colorGradient} hover:opacity-90 rounded-xl`}
      >
        {loading ? (
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
        ) : (
          <>
            <Icon className="w-4 h-4 mr-2" />
            {task.action_text}
            <ExternalLink className="w-4 h-4 ml-2" />
          </>
        )}
      </Button>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      className={`bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 transition-all duration-300 ${
        getStatus() === 'completed' || getStatus() === 'verified' 
          ? 'bg-green-500/5 border-green-500/20' 
          : ''
      }`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${colorGradient} flex items-center justify-center`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">{task.title}</h3>
            <p className="text-white/60 text-sm">{task.description}</p>
          </div>
        </div>
        {getStatusBadge()}
      </div>

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <span className="text-2xl font-bold text-yellow-400">{task.reward}</span>
          <span className="text-white/60">BONK</span>
        </div>
        
        {task.difficulty && (
          <div className="flex items-center space-x-1">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className={`w-2 h-2 rounded-full ${
                  i < task.difficulty ? 'bg-orange-400' : 'bg-white/20'
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {task.requirements && (
        <div className="mb-4">
          <p className="text-white/60 text-xs mb-2">Requirements:</p>
          <ul className="text-white/80 text-sm space-y-1">
            {task.requirements.map((req, index) => (
              <li key={index} className="flex items-center space-x-2">
                <div className="w-1 h-1 bg-white/60 rounded-full" />
                <span>{req}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {getActionButton()}

      {task.verification_note && getStatus() === 'pending' && (
        <div className="mt-3 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-xl">
          <p className="text-yellow-400 text-xs">{task.verification_note}</p>
        </div>
      )}
    </motion.div>
  );
}
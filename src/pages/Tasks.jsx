import React, { useState, useEffect } from "react";
import { User } from "@/api/entities";
import { Task } from "@/api/entities";
import { motion } from "framer-motion";
import { Trophy, Target, Gift } from "lucide-react";
import TaskCard from "../components/tasks/TaskCard";

const AVAILABLE_TASKS = [
  {
    type: 'twitter_connect',
    title: 'Connect Twitter',
    description: 'Link your Twitter account to earn bonus tokens',
    reward: 20,
    action_text: 'Connect Twitter',
    difficulty: 1,
    requirements: [
      'Must have an active Twitter account',
      'Account must be at least 30 days old',
      'Complete Twitter OAuth process'
    ],
    verification_note: 'Verification happens automatically after Twitter connection'
  },
  {
    type: 'whatsapp_verify',
    title: 'WhatsApp Verification',
    description: 'Verify your WhatsApp number for additional security',
    reward: 30,
    action_text: 'Verify WhatsApp',
    difficulty: 2,
    requirements: [
      'Valid WhatsApp number',
      'Ability to receive WhatsApp messages',
      'Manual verification by admin'
    ],
    verification_note: 'Admin verification can take up to 24 hours. Please be patient!'
  },
  {
    type: 'telegram_join',
    title: 'Join Telegram',
    description: 'Join our official Telegram community',
    reward: 15,
    action_text: 'Join Telegram',
    difficulty: 1,
    requirements: [
      'Telegram account required',
      'Join and stay in the group',
      'Participate in community discussions'
    ]
  }
];

export default function Tasks() {
  const [user, setUser] = useState(null);
  const [userTasks, setUserTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingTask, setProcessingTask] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const currentUser = await User.me();
      setUser(currentUser);

      const tasks = await Task.filter(
        { user_email: currentUser.email },
        '-created_date'
      );
      setUserTasks(tasks);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getUserTask = (taskType) => {
    return userTasks.find(task => task.task_type === taskType);
  };

  const handleStartTask = async (taskType) => {
    setProcessingTask(taskType);
    
    try {
      if (taskType === 'twitter_connect') {
        // Simulate Twitter OAuth flow
        const twitterUrl = `https://twitter.com/oauth/authorize?oauth_token=dummy&redirect_uri=${encodeURIComponent(window.location.origin + '/tasks?twitter_callback=1')}`;
        
        // Create pending task
        await Task.create({
          user_email: user.email,
          task_type: taskType,
          status: 'pending',
          reward_tokens: 20,
          task_data: { redirect_url: twitterUrl }
        });
        
        // Open Twitter OAuth in new window
        window.open(twitterUrl, '_blank', 'width=600,height=600');
        
      } else if (taskType === 'whatsapp_verify') {
        // Create WhatsApp verification task
        const phoneNumber = prompt('Please enter your WhatsApp number (with country code):');
        if (phoneNumber) {
          await Task.create({
            user_email: user.email,
            task_type: taskType,
            status: 'pending',
            reward_tokens: 30,
            task_data: { phone_number: phoneNumber }
          });
        }
        
      } else if (taskType === 'telegram_join') {
        // Open Telegram group
        const telegramUrl = 'https://t.me/bonkers_airdrop';
        window.open(telegramUrl, '_blank');
        
        await Task.create({
          user_email: user.email,
          task_type: taskType,
          status: 'pending',
          reward_tokens: 15,
          task_data: { telegram_group: telegramUrl }
        });
      }
      
      await loadData();
    } catch (error) {
      console.error('Error starting task:', error);
    } finally {
      setProcessingTask(null);
    }
  };

  const handleVerifyTask = async (taskType) => {
    setProcessingTask(taskType);
    
    try {
      const userTask = getUserTask(taskType);
      if (!userTask) return;

      if (taskType === 'twitter_connect') {
        // Simulate Twitter verification check
        await Task.update(userTask.id, {
          status: 'completed',
          completed_date: new Date().toISOString()
        });
        
        // Update user balance
        await User.updateMyUserData({
          airdrop_balance: (user.airdrop_balance || 0) + 20,
          total_earned: (user.total_earned || 0) + 20
        });
        
      } else if (taskType === 'whatsapp_verify') {
        // This would stay pending until admin approves
        // For demo, we'll simulate it being verified after a moment
        setTimeout(async () => {
          try {
            await Task.update(userTask.id, {
              status: 'verified',
              completed_date: new Date().toISOString()
            });
            
            await User.updateMyUserData({
              airdrop_balance: (user.airdrop_balance || 0) + 30,
              total_earned: (user.total_earned || 0) + 30
            });
            
            await loadData();
          } catch (error) {
            console.error('Error updating WhatsApp task:', error);
          }
        }, 2000);
        
      } else if (taskType === 'telegram_join') {
        await Task.update(userTask.id, {
          status: 'completed',
          completed_date: new Date().toISOString()
        });
        
        await User.updateMyUserData({
          airdrop_balance: (user.airdrop_balance || 0) + 15,
          total_earned: (user.total_earned || 0) + 15
        });
      }
      
      await loadData();
    } catch (error) {
      console.error('Error verifying task:', error);
    } finally {
      setProcessingTask(null);
    }
  };

  const getCompletedTasks = () => {
    return userTasks.filter(task => 
      task.status === 'completed' || task.status === 'verified'
    ).length;
  };

  const getTotalRewards = () => {
    return userTasks
      .filter(task => task.status === 'completed' || task.status === 'verified')
      .reduce((total, task) => total + (task.reward_tokens || 0), 0);
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
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
          Complete Tasks
        </h1>
        <p className="text-white/60 text-lg">
          Earn extra BONK tokens by completing these simple tasks
        </p>
      </motion.div>

      {/* Stats Overview */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 text-center"
        >
          <Target className="w-8 h-8 text-purple-400 mx-auto mb-3" />
          <p className="text-3xl font-bold text-white">{getCompletedTasks()}/{AVAILABLE_TASKS.length}</p>
          <p className="text-white/60">Tasks Completed</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 text-center"
        >
          <Gift className="w-8 h-8 text-yellow-400 mx-auto mb-3" />
          <p className="text-3xl font-bold text-white">{getTotalRewards()}</p>
          <p className="text-white/60">BONK Earned</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 text-center"
        >
          <Trophy className="w-8 h-8 text-cyan-400 mx-auto mb-3" />
          <p className="text-3xl font-bold text-white">
            {AVAILABLE_TASKS.reduce((sum, task) => sum + task.reward, 0)}
          </p>
          <p className="text-white/60">Total Available</p>
        </motion.div>
      </div>

      {/* Progress Bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 mb-8"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-white">Progress</h3>
          <span className="text-white/60">
            {Math.round((getCompletedTasks() / AVAILABLE_TASKS.length) * 100)}% Complete
          </span>
        </div>
        
        <div className="w-full bg-white/10 rounded-full h-3 overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-purple-400 to-pink-400 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${(getCompletedTasks() / AVAILABLE_TASKS.length) * 100}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />
        </div>
      </motion.div>

      {/* Available Tasks */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {AVAILABLE_TASKS.map((task, index) => (
          <motion.div
            key={task.type}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 + index * 0.1 }}
          >
            <TaskCard
              task={task}
              userTask={getUserTask(task.type)}
              onStartTask={handleStartTask}
              onVerifyTask={handleVerifyTask}
              loading={processingTask === task.type}
            />
          </motion.div>
        ))}
      </div>

      {/* Coming Soon Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="mt-12 text-center"
      >
        <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-xl rounded-2xl p-8 border border-purple-500/30">
          <h3 className="text-2xl font-bold text-white mb-4">More Tasks Coming Soon!</h3>
          <p className="text-white/60 mb-6">
            We're constantly adding new ways for you to earn BONK tokens. Stay tuned for exciting new challenges and rewards!
          </p>
          <div className="flex justify-center space-x-4 text-white/40">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-white/40 rounded-full animate-pulse" />
              <span>Instagram Follow</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-white/40 rounded-full animate-pulse animation-delay-1000" />
              <span>Discord Join</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-white/40 rounded-full animate-pulse animation-delay-2000" />
              <span>YouTube Subscribe</span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
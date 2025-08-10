
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { 
  Home, 
  Users, 
  Trophy, 
  User as UserIcon,
  Coins,
  Zap,
  Target,
  ArrowUpDown
} from "lucide-react";

export default function Layout({ children, currentPageName }) {
  const location = useLocation();

  const navigationItems = [
    { name: "Dashboard", url: createPageUrl("Dashboard"), icon: Home },
    { name: "Tasks", url: createPageUrl("Tasks"), icon: Target },
    { name: "Swap", url: createPageUrl("Swap"), icon: ArrowUpDown },
    { name: "Referrals", url: createPageUrl("Referrals"), icon: Users },
    { name: "Leaderboard", url: createPageUrl("Leaderboard"), icon: Trophy },
    { name: "Profile", url: createPageUrl("Profile"), icon: UserIcon },
  ];

  const isActive = (url) => location.pathname === url;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
        <div className="absolute bottom-1/4 left-1/2 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-4000"></div>
      </div>

      {/* Main content */}
      <div className="relative z-10">
        {/* Header */}
        <header className="border-b border-white/10 backdrop-blur-xl bg-white/5">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <Link to={createPageUrl("Dashboard")} className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-xl flex items-center justify-center">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                    Bonkers
                  </h1>
                  <p className="text-xs text-white/60">Web3 Airdrop Platform</p>
                </div>
              </Link>

              {/* Desktop Navigation */}
              <nav className="hidden lg:flex space-x-1">
                {navigationItems.map((item) => (
                  <Link
                    key={item.name}
                    to={item.url}
                    className={`px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 flex items-center space-x-2 ${
                      isActive(item.url)
                        ? "bg-white/20 text-white shadow-lg backdrop-blur-sm"
                        : "text-white/70 hover:text-white hover:bg-white/10"
                    }`}
                  >
                    <item.icon className="w-4 h-4" />
                    <span>{item.name}</span>
                  </Link>
                ))}
              </nav>

              {/* Airdrop indicator */}
              <div className="hidden sm:flex items-center space-x-2 bg-gradient-to-r from-purple-500/20 to-cyan-500/20 backdrop-blur-sm rounded-full px-4 py-2 border border-white/10">
                <Coins className="w-4 h-4 text-yellow-400" />
                <span className="text-sm font-semibold text-white">Live Airdrop</span>
              </div>
            </div>
          </div>
        </header>

        {/* Mobile Navigation */}
        <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-slate-900/90 backdrop-blur-xl border-t border-white/10 z-50">
          <div className="flex justify-around py-1 px-2">
            {navigationItems.map((item) => (
              <Link
                key={item.name}
                to={item.url}
                className={`flex flex-col items-center py-2 px-2 rounded-lg transition-all duration-200 ${
                  isActive(item.url)
                    ? "text-cyan-400"
                    : "text-white/60 hover:text-white"
                }`}
              >
                <item.icon className="w-4 h-4 mb-1" />
                <span className="text-xs font-medium">{item.name}</span>
              </Link>
            ))}
          </div>
        </nav>

        {/* Page content */}
        <main className="pb-20 lg:pb-8">
          {children}
        </main>
      </div>

      <style jsx>{`
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}

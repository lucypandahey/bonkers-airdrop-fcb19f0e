import Layout from "./Layout.jsx";

import Dashboard from "./Dashboard";

import Referrals from "./Referrals";

import Leaderboard from "./Leaderboard";

import Profile from "./Profile";

import Tasks from "./Tasks";

import Swap from "./Swap";

import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';

const PAGES = {
    
    Dashboard: Dashboard,
    
    Referrals: Referrals,
    
    Leaderboard: Leaderboard,
    
    Profile: Profile,
    
    Tasks: Tasks,
    
    Swap: Swap,
    
}

function _getCurrentPage(url) {
    if (url.endsWith('/')) {
        url = url.slice(0, -1);
    }
    let urlLastPart = url.split('/').pop();
    if (urlLastPart.includes('?')) {
        urlLastPart = urlLastPart.split('?')[0];
    }

    const pageName = Object.keys(PAGES).find(page => page.toLowerCase() === urlLastPart.toLowerCase());
    return pageName || Object.keys(PAGES)[0];
}

// Create a wrapper component that uses useLocation inside the Router context
function PagesContent() {
    const location = useLocation();
    const currentPage = _getCurrentPage(location.pathname);
    
    return (
        <Layout currentPageName={currentPage}>
            <Routes>            
                
                    <Route path="/" element={<Dashboard />} />
                
                
                <Route path="/Dashboard" element={<Dashboard />} />
                
                <Route path="/Referrals" element={<Referrals />} />
                
                <Route path="/Leaderboard" element={<Leaderboard />} />
                
                <Route path="/Profile" element={<Profile />} />
                
                <Route path="/Tasks" element={<Tasks />} />
                
                <Route path="/Swap" element={<Swap />} />
                
            </Routes>
        </Layout>
    );
}

export default function Pages() {
    return (
        <Router>
            <PagesContent />
        </Router>
    );
}
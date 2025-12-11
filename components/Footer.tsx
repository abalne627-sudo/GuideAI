
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-neutral-dark text-neutral-content mt-12 py-6">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <p className="text-sm text-gray-300">&copy; {new Date().getFullYear()} GuideAI. All rights reserved.</p>
        <p className="text-xs text-gray-400 mt-1">Your AI-Powered Career & Stream Advisor</p>
      </div>
    </footer>
  );
};

export default Footer;

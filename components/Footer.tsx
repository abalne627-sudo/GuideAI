
import React from 'react';

interface FooterProps {
  onBibliographyClick?: () => void;
}

const Footer: React.FC<FooterProps> = ({ onBibliographyClick }) => {
  return (
    <footer className="bg-neutral-dark text-neutral-content mt-12 py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <p className="text-sm text-gray-300">&copy; {new Date().getFullYear()} NextStep. All rights reserved.</p>
        <p className="text-xs text-gray-400 mt-1 mb-4">Your AI-Powered Career & Stream Advisor</p>
        {onBibliographyClick && (
          <button 
            onClick={onBibliographyClick}
            className="text-xs text-blue-400 hover:text-blue-300 hover:underline transition"
          >
            Sources & References
          </button>
        )}
      </div>
    </footer>
  );
};

export default Footer;

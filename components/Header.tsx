
import React from 'react';

interface HeaderProps {
  onHomeClick?: () => void;
}

const NextStepLogo = ({ width = 200, height = 100 }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 720 200"
      width={width}
      height={height}
      role="img"
      aria-label="NextStep logo"
    >
      <defs>
        <style>{`
          .blue-light { fill: #2f80ed; }
          .blue-dark { fill: #1f4f8a; }
          .text { font-family: Arial, Helvetica, sans-serif; font-weight: 600; }
        `}</style>
      </defs>

      {/* Steps */}
      <rect x="40" y="110" width="40" height="40" className="blue-light" />
      <rect x="80" y="90" width="40" height="60" className="blue-light" />
      <rect x="120" y="70" width="40" height="80" className="blue-light" />

      {/* Arrow */}
      <path
        d="M55 85
           C90 55, 120 50, 150 40
           L145 32
           L170 38
           L155 60
           L150 52
           C115 65, 85 70, 60 95 Z"
        className="blue-light"
      />

      {/* Text */}
      <text
        x="200"
        y="125"
        fontSize="72"
        className="text blue-dark"
      >
        NextStep
      </text>
    </svg>
  );
};


const Header: React.FC<HeaderProps> = ({ onHomeClick }) => {
  return (
    <header className="glass sticky top-0 z-50 border-b border-slate-200 shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div 
            className={`flex items-center group transition-transform ${onHomeClick ? 'cursor-pointer active:scale-95' : ''}`}
            onClick={onHomeClick}
            role={onHomeClick ? "button" : undefined}
            tabIndex={onHomeClick ? 0 : undefined}
          >
          <NextStepLogo />
          </div>
          
          <div className="hidden sm:flex items-center space-x-6">
             <span className="text-xs font-semibold uppercase tracking-widest text-text-muted">Empowering Potential</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

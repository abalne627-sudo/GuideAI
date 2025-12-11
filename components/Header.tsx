
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-primary shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-white mr-2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.306 3 12c0 4.556 4.03 8.25 9 8.25z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5h.01M12 12.75h.01M12 9h.01M7.5 16.5h.01M7.5 12.75h.01M7.5 9h.01M16.5 16.5h.01M16.5 12.75h.01M16.5 9h.01" />
            </svg>
            <h1 className="text-2xl font-bold text-white font-roboto-slab">GuideAI</h1>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;


import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  titleClassName?: string;
  onClick?: () => void;
  ariaLabel?: string;
}

const Card: React.FC<CardProps> = ({ children, className = '', title, titleClassName = '', onClick, ariaLabel }) => {
  const baseClasses = "bg-white rounded-lg shadow-lg p-4 sm:p-6";
  const clickableClasses = onClick ? "cursor-pointer hover:shadow-xl transition-shadow" : "";

  return (
    <div
      className={`${baseClasses} ${clickableClasses} ${className}`}
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => (e.key === 'Enter' || e.key === ' ') && onClick() : undefined}
      aria-label={ariaLabel || title}
    >
      {title && (
        <h3 className={`text-lg font-semibold text-neutral-dark mb-3 ${titleClassName}`}>
          {title}
        </h3>
      )}
      {children}
    </div>
  );
};

export default Card;

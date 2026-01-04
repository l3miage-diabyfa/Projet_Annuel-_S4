import React from 'react';
import Link from 'next/link';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps {
  children: React.ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: React.ReactNode;
  className?: string;
  fullWidth?: boolean;
  href: string;
}

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  icon,
  className = '',
  fullWidth = false,
  href,
}: ButtonProps) {
  const baseClasses = 'rounded-lg font-medium transition-colors inline-flex items-center justify-center';
  
  const variantClasses = {
    primary: 'text-black hover:opacity-90',
    secondary: 'text-gray-700 hover:text-gray-900',
    outline: 'border border-black text-black hover:bg-black hover:text-white',
    ghost: 'text-gray-700 hover:text-gray-900 hover:bg-gray-50',
  };

  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };

  const widthClass = fullWidth ? 'w-full' : '';

  const primaryBgStyle = variant === 'primary' ? { backgroundColor: '#FFE552' } : {};

  return (
    <Link
      href={href}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${widthClass} ${className}`}
      style={primaryBgStyle}
    >
      {children}
      {icon && <span className="ml-2">{icon}</span>}
    </Link>
  );
}

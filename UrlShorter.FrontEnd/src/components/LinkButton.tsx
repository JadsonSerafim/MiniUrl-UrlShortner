import React from 'react'
import { Link } from 'react-router-dom';

interface LinkButtonProps {
    to: string;
    variant?: 'primary' | 'secondary' | 'ghost';
    className?: string;
    size?: 'sm' | 'md' | 'lg';
    children: React.ReactNode;
}

const variantStyles = {
    primary: 'bg-primary-600 text-white hover:bg-primary-700',
    secondary: 'border border-gray-700 text-gray-300 hover:border-gray-500 hover:text-white',
    ghost: 'text-gray-400 hover:text-white hover:bg-gray-800'
}

const sizeStyles = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg'
}

const LinkButton = ({ to, variant = 'primary', size = 'md', children, className }: LinkButtonProps) => {
    return (
        <Link
            className={`
                rounded-lg cursor-pointer transition-all duration-200
                ${variantStyles[variant]}
                ${sizeStyles[size]}
                ${className || ''}
            `}
            to={to}>
            {children}
        </Link>
    )
}

export default LinkButton;
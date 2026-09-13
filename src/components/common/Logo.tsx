import React from 'react'
import { Link } from 'react-router-dom'
import officialLogo from '@/assets/logo.png'

interface LogoProps {
  className?: string
  size?: 'sm' | 'md' | 'lg'
  showTagline?: boolean
  linkToHome?: boolean
  lightMode?: boolean
}

export const Logo: React.FC<LogoProps> = ({
  className = '',
  size = 'md',
  linkToHome = true,
}) => {
  const heights = {
    sm: 'h-9',
    md: 'h-12',
    lg: 'h-16',
  }

  const logoContent = (
    <div className={`inline-flex items-center gap-2.5 select-none ${className}`}>
      <img
        src={officialLogo}
        alt="Menu du Jour - De vos meilleurs restos"
        className={`${heights[size]} w-auto object-contain drop-shadow-xs transition-transform hover:scale-105 duration-200`}
        onError={(e) => {
          e.currentTarget.src = '/logo.png'
        }}
      />
    </div>
  )

  if (linkToHome) {
    return (
      <Link to="/" className="inline-flex items-center focus:outline-none">
        {logoContent}
      </Link>
    )
  }

  return logoContent
}

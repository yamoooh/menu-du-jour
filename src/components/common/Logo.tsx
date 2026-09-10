import React from 'react'
import { Link } from 'react-router-dom'

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
  showTagline = true,
  linkToHome = true,
  lightMode = false,
}) => {
  const heights = {
    sm: 'h-10',
    md: 'h-12',
    lg: 'h-16',
  }

  const logoContent = (
    <div className={`inline-flex items-center gap-3 select-none ${className}`}>
      {/* SVG Icon Box from Stitch */}
      <div className="relative shrink-0 flex items-center justify-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 60 60"
          className={`${heights[size]} w-auto drop-shadow-sm`}
          fill="none"
        >
          <rect width="48" height="48" x="6" y="6" rx="14" fill={lightMode ? '#ffffff' : '#0f172a'} />
          <path
            d="M22 18v24M38 18v24M22 26h16M22 34h16"
            stroke="#ea580c"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <circle cx="30" cy="18" r="3.5" fill="#ea580c" />
        </svg>
      </div>

      {/* Typography */}
      <div className="flex flex-col leading-none">
        <span className={`font-extrabold tracking-tight ${size === 'lg' ? 'text-2xl' : size === 'sm' ? 'text-lg' : 'text-xl'} ${lightMode ? 'text-white' : 'text-slate-900'}`}>
          Menu<span className="text-orange-600"> du Jour</span>
        </span>
        {showTagline && (
          <span className={`font-semibold tracking-widest text-[9px] uppercase mt-1 ${lightMode ? 'text-slate-300' : 'text-slate-500'}`}>
            PLATEFORME SAAS
          </span>
        )}
      </div>
    </div>
  )

  if (linkToHome) {
    return (
      <Link to="/" className="focus:outline-hidden group">
        {logoContent}
      </Link>
    )
  }

  return logoContent
}

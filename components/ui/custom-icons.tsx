import React from 'react'

interface IconProps {
  className?: string
  size?: number
  animated?: boolean
}

export const FlightIcon = ({ className = "", size = 24, animated = false }: IconProps) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    className={`${className} ${animated ? 'transition-all duration-300 hover:scale-110 hover:rotate-12' : ''}`}
  >
    <defs>
      <linearGradient id="flightGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="currentColor" />
        <stop offset="100%" stopColor="currentColor" stopOpacity="0.7" />
      </linearGradient>
    </defs>
    <path 
      d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" 
      fill="url(#flightGradient)" 
      className="drop-shadow-sm"
    />
    <circle cx="12" cy="12" r="1" fill="currentColor" opacity="0.8" className="animate-pulse" />
    <path d="M12 8l2-2M12 16l2 2" stroke="currentColor" strokeWidth="1" opacity="0.6" strokeLinecap="round" />
  </svg>
)

export const CreditCardIcon = ({ className = "", size = 24, animated = false }: IconProps) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    className={`${className} ${animated ? 'transition-all duration-300 hover:scale-105 hover:-rotate-3' : ''}`}
  >
    <defs>
      <linearGradient id="cardGradient" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="currentColor" />
        <stop offset="100%" stopColor="currentColor" stopOpacity="0.8" />
      </linearGradient>
    </defs>
    <rect x="2" y="4" width="20" height="16" rx="3" stroke="currentColor" strokeWidth="2" fill="url(#cardGradient)" fillOpacity="0.1"/>
    <rect x="2" y="8" width="20" height="3" fill="currentColor" rx="1"/>
    <rect x="4" y="14" width="4" height="2" rx="1" fill="currentColor" opacity="0.8"/>
    <rect x="10" y="14" width="6" height="2" rx="1" fill="currentColor" opacity="0.6"/>
    <circle cx="18" cy="6" r="1.5" fill="currentColor" opacity="0.7"/>
    <circle cx="16" cy="6" r="1" fill="currentColor" opacity="0.5"/>
    <path d="M6 17l1-1 1 1" stroke="currentColor" strokeWidth="1" opacity="0.4" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

export const ChampagneIcon = ({ className = "", size = 24, animated = false }: IconProps) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    className={`${className} ${animated ? 'transition-all duration-300 hover:scale-110 hover:rotate-6' : ''}`}
  >
    <defs>
      <linearGradient id="champagneGradient" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="currentColor" stopOpacity="0.3" />
        <stop offset="100%" stopColor="currentColor" />
      </linearGradient>
    </defs>
    <path d="M7 2h10v5c0 3.31-2.69 6-6 6s-6-2.69-6-6V2z" stroke="currentColor" strokeWidth="2" fill="url(#champagneGradient)" fillOpacity="0.2"/>
    <rect x="10" y="13" width="4" height="9" stroke="currentColor" strokeWidth="2" fill="url(#champagneGradient)" fillOpacity="0.1"/>
    <ellipse cx="12" cy="20" rx="4" ry="1" fill="currentColor" opacity="0.8"/>
    <rect x="8" y="20" width="8" height="2" rx="1" fill="currentColor"/>
    <circle cx="9" cy="4" r="1" fill="currentColor" className="animate-bounce" style={{animationDelay: '0s', animationDuration: '2s'}}/>
    <circle cx="15" cy="5" r="0.5" fill="currentColor" className="animate-bounce" style={{animationDelay: '0.5s', animationDuration: '2s'}}/>
    <circle cx="12" cy="6" r="0.5" fill="currentColor" className="animate-bounce" style={{animationDelay: '1s', animationDuration: '2s'}}/>
    <circle cx="11" cy="3" r="0.3" fill="currentColor" opacity="0.6" className="animate-pulse"/>
    <circle cx="14" cy="4" r="0.3" fill="currentColor" opacity="0.6" className="animate-pulse"/>
  </svg>
)

export const GlobeIcon = ({ className = "", size = 24, animated = false }: IconProps) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    className={`${className} ${animated ? 'transition-all duration-300 hover:scale-110' : ''}`}
  >
    <defs>
      <linearGradient id="globeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="currentColor" />
        <stop offset="100%" stopColor="currentColor" stopOpacity="0.7" />
      </linearGradient>
    </defs>
    {/* Main globe circle */}
    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="url(#globeGradient)" fillOpacity="0.1"/>
    
    {/* Latitude lines */}
    <path d="M2 12h20" stroke="currentColor" strokeWidth="1.5" opacity="0.8"/>
    <path d="M4 8h16" stroke="currentColor" strokeWidth="1" opacity="0.6"/>
    <path d="M4 16h16" stroke="currentColor" strokeWidth="1" opacity="0.6"/>
    
    {/* Longitude lines */}
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" 
          stroke="currentColor" strokeWidth="1.5" fill="none" opacity="0.8"/>
    <path d="M12 2a10 10 0 0 0-6 10 10 10 0 0 0 6 10" 
          stroke="currentColor" strokeWidth="1" fill="none" opacity="0.6"/>
    <path d="M12 2a10 10 0 0 1 6 10 10 10 0 0 1-6 10" 
          stroke="currentColor" strokeWidth="1" fill="none" opacity="0.6"/>
    
    {/* Simple continent shapes */}
    <path d="M8 7c1 0 2 1 3 1s2-1 3-1" stroke="currentColor" strokeWidth="1.5" opacity="0.7" fill="none" strokeLinecap="round"/>
    <path d="M7 10c2 0 3 1 5 1s3-1 5-1" stroke="currentColor" strokeWidth="1.5" opacity="0.7" fill="none" strokeLinecap="round"/>
    <path d="M9 14c1 0 2 1 3 1s2-1 3-1" stroke="currentColor" strokeWidth="1.5" opacity="0.7" fill="none" strokeLinecap="round"/>
  </svg>
)

export const LightbulbIcon = ({ className = "", size = 24, animated = false }: IconProps) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    className={`${className} ${animated ? 'transition-all duration-300 hover:scale-110' : ''}`}
  >
    <defs>
      <radialGradient id="bulbGradient" cx="50%" cy="30%">
        <stop offset="0%" stopColor="currentColor" stopOpacity="0.8" />
        <stop offset="100%" stopColor="currentColor" stopOpacity="0.3" />
      </radialGradient>
    </defs>
    <path d="M12 3c3.31 0 6 2.69 6 6 0 2.97-2.16 5.43-5 5.91V17H11v-2.09C8.16 14.43 6 11.97 6 9c0-3.31 2.69-6 6-6z" stroke="currentColor" strokeWidth="2" fill="url(#bulbGradient)" fillOpacity="0.2"/>
    <rect x="9" y="17" width="6" height="2" rx="1" fill="currentColor" opacity="0.7"/>
    <rect x="9" y="19" width="6" height="2" rx="1" fill="currentColor"/>
    <circle cx="12" cy="8" r="2" fill="currentColor" opacity="0.4" className={animated ? 'animate-pulse' : ''}/>
    <path d="M12 6l1-1M12 6l-1-1M10 8l-1-1M14 8l1-1" stroke="currentColor" strokeWidth="1.5" opacity="0.6" strokeLinecap="round"/>
    <circle cx="12" cy="8" r="0.5" fill="currentColor" className={animated ? 'animate-ping' : ''} style={{animationDuration: '2s'}}/>
  </svg>
)

export const CompassIcon = ({ className = "", size = 24, animated = false }: IconProps) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    className={`${className} ${animated ? 'transition-all duration-300 hover:scale-105' : ''}`}
  >
    <defs>
      <radialGradient id="compassGradient" cx="50%" cy="50%">
        <stop offset="0%" stopColor="currentColor" stopOpacity="0.2" />
        <stop offset="100%" stopColor="currentColor" />
      </radialGradient>
    </defs>
    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="url(#compassGradient)" fillOpacity="0.1"/>
    <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="1" opacity="0.3" fill="none"/>
    <polygon points="16.24,7.76 14.12,14.12 7.76,16.24 9.88,9.88" fill="currentColor" className={animated ? 'hover:rotate-45 transition-transform duration-500' : ''}/>
    <circle cx="12" cy="12" r="2" fill="currentColor" className="drop-shadow-sm"/>
    <path d="M12 2v2M12 20v2M2 12h2M20 12h2" stroke="currentColor" strokeWidth="1" opacity="0.4"/>
    <path d="M18.36 5.64l-1.41 1.41M7.05 16.95l-1.41 1.41M18.36 18.36l-1.41-1.41M7.05 7.05l-1.41-1.41" stroke="currentColor" strokeWidth="1" opacity="0.3"/>
    <circle cx="12" cy="8" r="0.5" fill="currentColor" opacity="0.6"/>
  </svg>
)

export const CheckIcon = ({ className = "", size = 24, animated = false }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={`${className} ${animated ? 'transition-all duration-300 hover:scale-110' : ''}`}>
    <circle cx="12" cy="12" r="10" fill="currentColor"/>
    <path d="M9 12l2 2 4-4" stroke="white" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

export const ArchitectureIcon = ({ className = "", size = 24, animated = false }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={`${className} ${animated ? 'transition-all duration-300 hover:scale-105' : ''}`}>
    <path d="M3 21h18M3 21V7l9-4 9 4v14M7 21V11h2v10M11 21V11h2v10M15 21V11h2v10" stroke="currentColor" strokeWidth="2" fill="none"/>
    <path d="M5 7h14" stroke="currentColor" strokeWidth="2"/>
  </svg>
)

export const DesignIcon = ({ className = "", size = 24, animated = false }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={`${className} ${animated ? 'transition-all duration-300 hover:scale-110 hover:rotate-12' : ''}`}>
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill="currentColor"/>
  </svg>
)

export const RocketIcon = ({ className = "", size = 24, animated = false }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={`${className} ${animated ? 'transition-all duration-300 hover:scale-110 hover:-translate-y-1' : ''}`}>
    <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" stroke="currentColor" strokeWidth="2" fill="none"/>
    <path d="M12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" stroke="currentColor" strokeWidth="2" fill="none"/>
    <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0M15 9v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" stroke="currentColor" strokeWidth="2" fill="none"/>
  </svg>
)

export const TargetIcon = ({ className = "", size = 24, animated = false }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={`${className} ${animated ? 'transition-all duration-300 hover:scale-105' : ''}`}>
    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none"/>
    <circle cx="12" cy="12" r="6" stroke="currentColor" strokeWidth="2" fill="none"/>
    <circle cx="12" cy="12" r="2" fill="currentColor"/>
  </svg>
)

export const BrainIcon = ({ className = "", size = 24, animated = false }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={`${className} ${animated ? 'transition-all duration-300 hover:scale-105' : ''}`}>
    <path d="M9.5 2A2.5 2.5 0 0 0 7 4.5v.55a2.5 2.5 0 0 0-1.5 2.27A2.5 2.5 0 0 0 3 9.82v4.36A2.5 2.5 0 0 0 5.5 17h.05A2.5 2.5 0 0 0 8 19.5h8a2.5 2.5 0 0 0 2.45-2h.05A2.5 2.5 0 0 0 21 14.18V9.82A2.5 2.5 0 0 0 18.5 7.32 2.5 2.5 0 0 0 17 5.05V4.5A2.5 2.5 0 0 0 14.5 2h-5z" stroke="currentColor" strokeWidth="2" fill="none"/>
    <path d="M9 9s1.5-1 3-1 3 1 3 1M9 15s1.5-1 3-1 3 1 3 1" stroke="currentColor" strokeWidth="1.5" fill="none"/>
  </svg>
)

export const LightningIcon = ({ className = "", size = 24, animated = false }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={`${className} ${animated ? 'transition-all duration-300 hover:scale-110' : ''}`}>
    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" fill="currentColor"/>
  </svg>
)

export const ToolsIcon = ({ className = "", size = 24, animated = false }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={`${className} ${animated ? 'transition-all duration-300 hover:scale-105 hover:rotate-12' : ''}`}>
    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" stroke="currentColor" strokeWidth="2" fill="none"/>
  </svg>
)

export const ChartIcon = ({ className = "", size = 24, animated = false }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={`${className} ${animated ? 'transition-all duration-300 hover:scale-105' : ''}`}>
    <path d="M3 3v18h18" stroke="currentColor" strokeWidth="2" fill="none"/>
    <path d="M7 16l4-4 4 4 6-6" stroke="currentColor" strokeWidth="2" fill="none"/>
    <circle cx="7" cy="16" r="2" fill="currentColor"/>
    <circle cx="11" cy="12" r="2" fill="currentColor"/>
    <circle cx="15" cy="16" r="2" fill="currentColor"/>
    <circle cx="21" cy="10" r="2" fill="currentColor"/>
  </svg>
) 
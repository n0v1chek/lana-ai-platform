interface CatLogoProps {
  className?: string;
  size?: number;
}

export function CatLogo({ className = "", size = 24 }: CatLogoProps) {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      className={className}
    >
      {/* Neural network dots */}
      <circle cx="8" cy="30" r="2" fill="white" opacity="0.5"/>
      <circle cx="92" cy="30" r="2" fill="white" opacity="0.5"/>
      <circle cx="5" cy="50" r="1.5" fill="white" opacity="0.3"/>
      <circle cx="95" cy="50" r="1.5" fill="white" opacity="0.3"/>
      
      {/* Neural lines */}
      <line x1="8" y1="30" x2="15" y2="15" stroke="white" strokeWidth="0.8" opacity="0.3"/>
      <line x1="92" y1="30" x2="85" y2="15" stroke="white" strokeWidth="0.8" opacity="0.3"/>
      
      {/* Cat face */}
      <circle cx="50" cy="55" r="35" fill="white" opacity="0.95"/>
      {/* Left ear */}
      <path d="M20 45 L15 15 L40 35 Z" fill="white"/>
      {/* Right ear */}
      <path d="M80 45 L85 15 L60 35 Z" fill="white"/>
      {/* Left eye - digital glow */}
      <ellipse cx="35" cy="52" rx="6" ry="8" fill="#8b5cf6"/>
      <circle cx="35" cy="51" r="2.5" fill="#c4b5fd"/>
      {/* Right eye - digital glow */}
      <ellipse cx="65" cy="52" rx="6" ry="8" fill="#8b5cf6"/>
      <circle cx="65" cy="51" r="2.5" fill="#c4b5fd"/>
      {/* Nose */}
      <path d="M50 64 L46 60 L54 60 Z" fill="#ffa5b4"/>
      {/* Mouth */}
      <path d="M50 64 Q45 70 40 67" stroke="#8b5cf6" strokeWidth="2" fill="none" strokeLinecap="round"/>
      <path d="M50 64 Q55 70 60 67" stroke="#8b5cf6" strokeWidth="2" fill="none" strokeLinecap="round"/>
      {/* Moon - centered on forehead */}
      <path d="M55 28 Q47 28 47 36 Q47 44 55 44 Q51 41 51 36 Q51 31 55 28" fill="#fbbf24"/>
      
      {/* AI sparkles near ears */}
      <circle cx="12" cy="12" r="1.5" fill="#fbbf24"/>
      <circle cx="88" cy="12" r="1.5" fill="#fbbf24"/>
    </svg>
  );
}

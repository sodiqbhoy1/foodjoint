"use client";

export default function FoodJointLogoSimple({ size = 40, className = "" }) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 100 100" 
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Background circle with gradient */}
      <defs>
        <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#CA2C33" />
          <stop offset="100%" stopColor="#A01E24" />
        </linearGradient>
        <linearGradient id="textGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="white" />
          <stop offset="100%" stopColor="#F8F8F8" />
        </linearGradient>
      </defs>
      
      <circle cx="50" cy="50" r="48" fill="url(#bgGradient)" stroke="white" strokeWidth="2"/>
      
      {/* Central food icon - stylized plate with steam */}
      <g transform="translate(50, 35)">
        {/* Plate */}
        <ellipse cx="0" cy="15" rx="20" ry="6" fill="white" opacity="0.9"/>
        <ellipse cx="0" cy="13" rx="18" ry="5" fill="white"/>
        
        {/* Food on plate */}
        <circle cx="-8" cy="10" r="3" fill="#FF6B35"/>
        <circle cx="0" cy="8" r="4" fill="#FFD23F"/>
        <circle cx="8" cy="10" r="3" fill="#FF6B35"/>
        
        {/* Steam lines */}
        <path d="M -12 5 Q -10 0 -12 -5" stroke="white" strokeWidth="2" fill="none" opacity="0.7"/>
        <path d="M 0 3 Q 2 -2 0 -7" stroke="white" strokeWidth="2" fill="none" opacity="0.7"/>
        <path d="M 12 5 Q 14 0 12 -5" stroke="white" strokeWidth="2" fill="none" opacity="0.7"/>
      </g>
      
      {/* Letters F and J */}
      <g>
        <text x="30" y="75" fontSize="24" fontWeight="bold" fill="url(#textGradient)" fontFamily="Arial, sans-serif">F</text>
        <text x="58" y="75" fontSize="24" fontWeight="bold" fill="url(#textGradient)" fontFamily="Arial, sans-serif">J</text>
      </g>
      
      {/* Small decorative dots */}
      <circle cx="20" cy="25" r="2" fill="white" opacity="0.5"/>
      <circle cx="80" cy="35" r="1.5" fill="white" opacity="0.5"/>
      <circle cx="25" cy="80" r="1.5" fill="white" opacity="0.5"/>
      <circle cx="75" cy="75" r="2" fill="white" opacity="0.5"/>
    </svg>
  );
}
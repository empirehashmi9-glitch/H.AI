import React from 'react';

type Mood = 'happy' | 'wink' | 'focus' | 'sleep';

interface ChibiRobotProps {
  size?: number;
  color?: string;
  accent?: string;
  mood?: Mood;
  className?: string;
  float?: boolean;
}

/**
 * The H.AI crew mascot — a chunky clay robot drawn as inline SVG so it
 * stays crisp at every size and can blink with pure CSS.
 */
export const ChibiRobot: React.FC<ChibiRobotProps> = ({
  size = 96,
  color = '#FF7A8A',
  accent = '#7CF5D8',
  mood = 'happy',
  className = '',
  float = false,
}) => {
  const eyes = () => {
    if (mood === 'wink') {
      return (
        <>
          <circle cx="48" cy="55" r="5.5" fill={accent} />
          <path d="M66 56 q6 5 12 0" fill="none" stroke={accent} strokeWidth="4" strokeLinecap="round" />
        </>
      );
    }
    if (mood === 'sleep') {
      return (
        <>
          <path d="M42 55 q6 -5 12 0" fill="none" stroke={accent} strokeWidth="4" strokeLinecap="round" />
          <path d="M66 55 q6 -5 12 0" fill="none" stroke={accent} strokeWidth="4" strokeLinecap="round" />
        </>
      );
    }
    if (mood === 'focus') {
      return (
        <>
          <rect x="42" y="50" width="12" height="10" rx="5" fill={accent} />
          <rect x="66" y="50" width="12" height="10" rx="5" fill={accent} />
        </>
      );
    }
    return (
      <>
        <circle cx="48" cy="54" r="6" fill={accent} />
        <circle cx="72" cy="54" r="6" fill={accent} />
        <circle cx="50" cy="52" r="2" fill="#FFF7EC" />
        <circle cx="74" cy="52" r="2" fill="#FFF7EC" />
        <path d="M54 63 q6 5 12 0" fill="none" stroke={accent} strokeWidth="3.5" strokeLinecap="round" />
      </>
    );
  };

  return (
    <svg
      viewBox="0 0 120 148"
      width={size}
      height={(size * 148) / 120}
      className={`${float ? 'anim-bob' : ''} ${className}`}
      role="img"
      aria-label="H.AI agent robot"
    >
      <ellipse cx="60" cy="141" rx="34" ry="5.5" fill="#04141d" opacity="0.18" />

      <line x1="60" y1="22" x2="60" y2="12" stroke="#04141d" strokeWidth="5" strokeLinecap="round" />
      <circle cx="60" cy="9" r="6.5" fill="#FFC93C" stroke="#04141d" strokeWidth="3.5" />

      <circle cx="15" cy="60" r="10" fill={color} stroke="#04141d" strokeWidth="4" />
      <circle cx="105" cy="60" r="10" fill={color} stroke="#04141d" strokeWidth="4" />

      <rect x="20" y="24" width="80" height="64" rx="26" fill="#FFF7EC" stroke="#04141d" strokeWidth="5" />
      <rect x="32" y="40" width="56" height="34" rx="15" fill="#04141d" />
      <rect x="36" y="43" width="24" height="7" rx="3.5" fill="#FFFFFF" opacity="0.12" />
      <g className="bot-eyes">{eyes()}</g>
      <circle cx="27" cy="80" r="4" fill="#FF7A8A" opacity="0.65" />
      <circle cx="93" cy="80" r="4" fill="#FF7A8A" opacity="0.65" />

      <rect x="33" y="90" width="54" height="42" rx="18" fill={color} stroke="#04141d" strokeWidth="5" />
      <rect x="43" y="100" width="34" height="23" rx="9" fill="#FFF7EC" opacity="0.92" />
      <text
        x="60"
        y="118"
        textAnchor="middle"
        fontFamily="Fredoka, sans-serif"
        fontSize="16"
        fontWeight="700"
        fill="#04141d"
      >
        H
      </text>

      <g transform="rotate(22 22 108)">
        <rect x="14" y="94" width="15" height="28" rx="7.5" fill={color} stroke="#04141d" strokeWidth="4" />
      </g>
      <g transform="rotate(-24 98 108)">
        <rect x="91" y="94" width="15" height="28" rx="7.5" fill={color} stroke="#04141d" strokeWidth="4" />
      </g>

      <rect x="43" y="129" width="14" height="12" rx="6" fill="#04141d" />
      <rect x="63" y="129" width="14" height="12" rx="6" fill="#04141d" />
    </svg>
  );
};

export function GoruKoiLogo({ size = 32 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 44 44"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="গরুকই লোগো"
    >
      <defs>
        <linearGradient id="gk-bg" x1="0" y1="0" x2="44" y2="44" gradientUnits="userSpaceOnUse">
          <stop stopColor="#16a34a" />
          <stop offset="1" stopColor="#14532d" />
        </linearGradient>
        <linearGradient id="gk-face" x1="12" y1="14" x2="32" y2="36" gradientUnits="userSpaceOnUse">
          <stop stopColor="#ffffff" />
          <stop offset="1" stopColor="#f0fdf4" />
        </linearGradient>
      </defs>

      {/* Background */}
      <rect width="44" height="44" rx="11" fill="url(#gk-bg)" />

      {/* Amber sparkle accent */}
      <circle cx="36" cy="8" r="1.8" fill="#fcd34d" opacity="0.9" />
      <circle cx="36" cy="8" r="0.8" fill="#fbbf24" />

      {/* Left horn */}
      <path
        d="M14.5 18 C13 13.5 11 9 14.5 7"
        stroke="white"
        strokeWidth="2.4"
        strokeLinecap="round"
        fill="none"
        opacity="0.9"
      />
      {/* Right horn */}
      <path
        d="M29.5 18 C31 13.5 33 9 29.5 7"
        stroke="white"
        strokeWidth="2.4"
        strokeLinecap="round"
        fill="none"
        opacity="0.9"
      />

      {/* Left ear */}
      <ellipse cx="10.5" cy="22" rx="2.8" ry="3.8" fill="white" opacity="0.92" />
      <ellipse cx="10.5" cy="22.5" rx="1.3" ry="2.1" fill="#fca5a5" opacity="0.55" />

      {/* Right ear */}
      <ellipse cx="33.5" cy="22" rx="2.8" ry="3.8" fill="white" opacity="0.92" />
      <ellipse cx="33.5" cy="22.5" rx="1.3" ry="2.1" fill="#fca5a5" opacity="0.55" />

      {/* Face */}
      <circle cx="22" cy="24" r="11" fill="url(#gk-face)" />

      {/* Eyes */}
      <circle cx="18" cy="21.5" r="2.1" fill="#14532d" />
      <circle cx="26" cy="21.5" r="2.1" fill="#14532d" />
      {/* Eye shine */}
      <circle cx="18.8" cy="20.8" r="0.75" fill="white" />
      <circle cx="26.8" cy="20.8" r="0.75" fill="white" />

      {/* Snout */}
      <ellipse cx="22" cy="29" rx="5" ry="3.2" fill="#bbf7d0" />
      {/* Nostrils */}
      <ellipse cx="20.1" cy="29.4" rx="1.15" ry="0.9" fill="#15803d" opacity="0.45" />
      <ellipse cx="23.9" cy="29.4" rx="1.15" ry="0.9" fill="#15803d" opacity="0.45" />
    </svg>
  );
}

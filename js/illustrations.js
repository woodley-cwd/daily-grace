const illustrations = {
  faith: `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
    <rect x="90" y="30" width="20" height="80" rx="4" fill="#C9973A"/>
    <rect x="60" y="55" width="80" height="20" rx="4" fill="#C9973A"/>
    <line x1="100" y1="10" x2="100" y2="25" stroke="#E8D8C4" stroke-width="2" stroke-linecap="round"/>
    <line x1="100" y1="115" x2="100" y2="130" stroke="#E8D8C4" stroke-width="2" stroke-linecap="round"/>
    <line x1="40" y1="65" x2="55" y2="65" stroke="#E8D8C4" stroke-width="2" stroke-linecap="round"/>
    <line x1="145" y1="65" x2="160" y2="65" stroke="#E8D8C4" stroke-width="2" stroke-linecap="round"/>
    <line x1="55" y1="25" x2="65" y2="38" stroke="#F2E8D8" stroke-width="1.5" stroke-linecap="round"/>
    <line x1="145" y1="25" x2="135" y2="38" stroke="#F2E8D8" stroke-width="1.5" stroke-linecap="round"/>
    <line x1="55" y1="105" x2="65" y2="92" stroke="#F2E8D8" stroke-width="1.5" stroke-linecap="round"/>
    <line x1="145" y1="105" x2="135" y2="92" stroke="#F2E8D8" stroke-width="1.5" stroke-linecap="round"/>
    <circle cx="100" cy="160" r="18" fill="none" stroke="#D4B896" stroke-width="1.5" opacity="0.6"/>
    <circle cx="100" cy="160" r="28" fill="none" stroke="#D4B896" stroke-width="1" opacity="0.3"/>
  </svg>`,

  nature: `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
    <circle cx="100" cy="70" r="30" fill="#C9973A" opacity="0.8"/>
    <line x1="100" y1="25" x2="100" y2="15" stroke="#E8D8C4" stroke-width="2" stroke-linecap="round"/>
    <line x1="135" y1="40" x2="142" y2="33" stroke="#E8D8C4" stroke-width="2" stroke-linecap="round"/>
    <line x1="150" y1="70" x2="162" y2="70" stroke="#E8D8C4" stroke-width="2" stroke-linecap="round"/>
    <line x1="50" y1="70" x2="38" y2="70" stroke="#E8D8C4" stroke-width="2" stroke-linecap="round"/>
    <line x1="65" y1="40" x2="58" y2="33" stroke="#E8D8C4" stroke-width="2" stroke-linecap="round"/>
    <ellipse cx="55" cy="118" rx="20" ry="10" fill="#D4B896" opacity="0.5"/>
    <ellipse cx="75" cy="112" rx="25" ry="12" fill="#C9973A" opacity="0.4"/>
    <ellipse cx="130" cy="115" rx="22" ry="11" fill="#D4B896" opacity="0.5"/>
    <path d="M10 140 Q55 110 100 130 Q145 150 190 125" stroke="#C9973A" stroke-width="2" fill="none" stroke-linecap="round"/>
    <path d="M10 160 Q60 135 110 148 Q155 162 190 145" stroke="#D4B896" stroke-width="1.5" fill="none" stroke-linecap="round"/>
    <path d="M10 180 Q70 160 130 168 Q165 174 190 165" stroke="#E8D8C4" stroke-width="1" fill="none" stroke-linecap="round"/>
  </svg>`,

  family: `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
    <circle cx="70" cy="60" r="18" fill="#C9973A" opacity="0.7"/>
    <rect x="57" y="82" width="26" height="50" rx="8" fill="#C9973A" opacity="0.7"/>
    <circle cx="130" cy="65" r="15" fill="#D4B896" opacity="0.7"/>
    <rect x="118" y="84" width="24" height="44" rx="8" fill="#D4B896" opacity="0.7"/>
    <circle cx="100" cy="75" r="12" fill="#E8D8C4" opacity="0.9"/>
    <rect x="90" y="91" width="20" height="36" rx="6" fill="#E8D8C4" opacity="0.9"/>
    <path d="M70 107 Q85 115 100 110" stroke="#F2E8D8" stroke-width="3" fill="none" stroke-linecap="round"/>
    <path d="M130 104 Q115 115 100 110" stroke="#F2E8D8" stroke-width="3" fill="none" stroke-linecap="round"/>
    <path d="M50 165 Q100 145 150 165" stroke="#C9973A" stroke-width="1.5" fill="none" stroke-linecap="round" opacity="0.4"/>
  </svg>`,

  strength: `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
    <polygon points="100,20 130,80 190,80 140,115 160,175 100,140 40,175 60,115 10,80 70,80" fill="none" stroke="#C9973A" stroke-width="2" opacity="0.3"/>
    <polygon points="100,35 122,75 168,75 130,100 145,148 100,122 55,148 70,100 32,75 78,75" fill="#C9973A" opacity="0.5"/>
    <path d="M30 170 L65 120 L100 150 L135 110 L170 170" stroke="#D4B896" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M10 180 L55 130 L100 165 L145 125 L190 180" stroke="#E8D8C4" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round" opacity="0.6"/>
  </svg>`,

  hope: `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
    <path d="M0 130 Q50 90 100 110 Q150 130 200 90" stroke="#C9973A" stroke-width="3" fill="none" stroke-linecap="round"/>
    <circle cx="100" cy="80" r="25" fill="#C9973A" opacity="0.6"/>
    <path d="M60 95 Q70 80 80 85" stroke="#E8D8C4" stroke-width="1.5" fill="none" stroke-linecap="round"/>
    <path d="M40 80 Q55 65 65 72" stroke="#E8D8C4" stroke-width="1.5" fill="none" stroke-linecap="round"/>
    <path d="M140 95 Q130 80 120 85" stroke="#E8D8C4" stroke-width="1.5" fill="none" stroke-linecap="round"/>
    <path d="M160 80 Q145 65 135 72" stroke="#E8D8C4" stroke-width="1.5" fill="none" stroke-linecap="round"/>
    <path d="M85 60 Q80 45 72 40" stroke="#D4B896" stroke-width="1.5" fill="none" stroke-linecap="round"/>
    <path d="M115 60 Q120 45 128 40" stroke="#D4B896" stroke-width="1.5" fill="none" stroke-linecap="round"/>
    <path d="M100 55 L100 35" stroke="#D4B896" stroke-width="1.5" stroke-linecap="round"/>
    <path d="M0 155 Q50 115 100 135 Q150 155 200 115" stroke="#D4B896" stroke-width="1.5" fill="none" stroke-linecap="round" opacity="0.5"/>
    <path d="M0 175 Q50 145 100 158 Q150 172 200 145" stroke="#E8D8C4" stroke-width="1" fill="none" stroke-linecap="round" opacity="0.4"/>
  </svg>`,

  light: `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
    <ellipse cx="100" cy="170" rx="18" ry="6" fill="#D4B896" opacity="0.4"/>
    <rect x="92" y="120" width="16" height="40" rx="4" fill="#C9973A" opacity="0.6"/>
    <ellipse cx="100" cy="118" rx="14" ry="22" fill="#C9973A" opacity="0.8"/>
    <ellipse cx="100" cy="105" rx="10" ry="18" fill="#E8D8C4" opacity="0.9"/>
    <ellipse cx="100" cy="108" rx="5" ry="10" fill="#FDF6EC" opacity="0.8"/>
    <circle cx="100" cy="115" r="30" fill="none" stroke="#C9973A" stroke-width="1" opacity="0.3"/>
    <circle cx="100" cy="115" r="45" fill="none" stroke="#D4B896" stroke-width="1" opacity="0.2"/>
    <circle cx="100" cy="115" r="60" fill="none" stroke="#E8D8C4" stroke-width="1" opacity="0.15"/>
    <line x1="100" y1="45" x2="100" y2="30" stroke="#E8D8C4" stroke-width="1.5" stroke-linecap="round" opacity="0.5"/>
    <line x1="135" y1="55" x2="145" y2="45" stroke="#E8D8C4" stroke-width="1.5" stroke-linecap="round" opacity="0.5"/>
    <line x1="155" y1="90" x2="170" y2="88" stroke="#E8D8C4" stroke-width="1.5" stroke-linecap="round" opacity="0.5"/>
    <line x1="65" y1="55" x2="55" y2="45" stroke="#E8D8C4" stroke-width="1.5" stroke-linecap="round" opacity="0.5"/>
    <line x1="45" y1="90" x2="30" y2="88" stroke="#E8D8C4" stroke-width="1.5" stroke-linecap="round" opacity="0.5"/>
  </svg>`,

  peace: `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
    <path d="M40 90 Q60 60 90 70 Q120 80 140 55 Q155 40 170 50 Q145 75 120 65 Q90 55 70 80 Q50 105 40 90Z" fill="#C9973A" opacity="0.6"/>
    <path d="M155 58 Q165 45 175 52" stroke="#C9973A" stroke-width="2" fill="none" stroke-linecap="round"/>
    <path d="M38 92 Q28 105 35 118" stroke="#D4B896" stroke-width="1.5" fill="none" stroke-linecap="round"/>
    <ellipse cx="38" cy="92" rx="4" ry="6" fill="#C9973A" opacity="0.5" transform="rotate(-20 38 92)"/>
    <path d="M85 72 Q82 85 78 95 Q74 108 72 122" stroke="#D4B896" stroke-width="1.5" fill="none" stroke-linecap="round"/>
    <ellipse cx="72" cy="130" rx="16" ry="10" fill="#C9973A" opacity="0.4"/>
    <ellipse cx="72" cy="130" rx="10" ry="6" fill="#D4B896" opacity="0.5"/>
    <path d="M20 160 Q60 145 100 152 Q140 159 180 148" stroke="#E8D8C4" stroke-width="1.5" fill="none" stroke-linecap="round" opacity="0.5"/>
    <path d="M10 175 Q55 162 100 168 Q148 175 190 163" stroke="#E8D8C4" stroke-width="1" fill="none" stroke-linecap="round" opacity="0.3"/>
  </svg>`,
};

export function getIllustration(theme) {
  return illustrations[theme] || illustrations['faith'];
}

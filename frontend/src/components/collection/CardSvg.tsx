import type { CardData } from '../../data/cards'

interface Props {
  card: CardData
  width?: number
}

export default function CardSvg({ card, width = 190 }: Props) {
  const height = Math.round(width * (1050 / 750))
  const pid = `bg_${card.id}`

  if (card.theme === 'legends') {
    return (
      <svg width={width} height={height} viewBox="0 0 750 1050" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id={pid} patternUnits="objectBoundingBox" width="1" height="1">
            <image href="/textures/texture1.jpg" width="750" height="1050" preserveAspectRatio="xMidYMid slice" />
          </pattern>
        </defs>
        <rect x="0" y="0" width="750" height="1050" rx="40" ry="40" fill={`url(#${pid})`} />
        <image href={card.image} x="20" y="258" width="718" height="820" preserveAspectRatio="xMidYMid meet" />
        <rect x="20" y="20" width="710" height="1010" rx="35" ry="35" fill="none" stroke="#ffffff" strokeWidth="6" />
        <text
          x="60" y="555"
          fill="#000000" stroke={card.accentColor} strokeWidth="1"
          fontFamily="Arial" fontSize="70" fontWeight="bold"
          transform="rotate(-90 60 525)" textAnchor="middle"
        >
          {card.name}
        </text>
        <rect x="40" y="850" width="200" height="180" rx="20" ry="20" fill="rgba(0,0,0,0.65)" stroke="#ffffff" strokeWidth="2" />
        <text x="70" y="920" fill="#000000" stroke={card.accentColor} strokeWidth="1" fontFamily="Arial" fontSize="32" fontWeight="bold">ATK</text>
        <text x="150" y="920" fill="#ffffff" fontFamily="Arial" fontSize="32">{card.atk}</text>
        <text x="70" y="980" fill="#000000" stroke={card.accentColor} strokeWidth="1" fontFamily="Arial" fontSize="32" fontWeight="bold">DEF</text>
        <text x="150" y="980" fill="#ffffff" fontFamily="Arial" fontSize="32">{card.def}</text>
        <rect x="40" y="40" width="500" height="90" rx="20" ry="20" fill="rgba(0,0,0,0.45)" stroke="#ffffff" strokeWidth="2" />
        <text x="180" y="100" fill="#000000" stroke={card.accentColor} strokeWidth="1" fontFamily="Arial" fontSize="40" fontWeight="bold">LEGENDS</text>
        <circle cx="650" cy="85" r="55" fill="rgba(0,0,0,0.65)" stroke="#ffffff" strokeWidth="4" />
        <text x="650" y="100" fill="#000000" stroke={card.accentColor} strokeWidth="1" fontFamily="Arial" fontSize="42" fontWeight="bold" textAnchor="middle">
          {card.score}
        </text>
        <rect x="260" y="955" width="450" height="50" rx="20" ry="20" fill="rgba(0,0,0,0.6)" stroke="#ffffff" strokeWidth="2" />
        <text x="350" y="990" fill="#ffffff" fontFamily="Arial" fontSize="28">POSTE : </text>
        <text x="470" y="990" fill="#000000" stroke={card.accentColor} strokeWidth="1" fontFamily="Arial" fontSize="28">{card.position}</text>
      </svg>
    )
  }

  // Talents & Specials share the same layout, different texture
  const texture = card.theme === 'specials' ? '/textures/texture3.jpg' : '/textures/texture2.jpg'

  return (
    <svg width={width} height={height} viewBox="0 0 750 1050" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id={pid} patternUnits="objectBoundingBox" width="1" height="1">
          <image href={texture} width="750" height="1050" preserveAspectRatio="xMidYMid slice" />
        </pattern>
      </defs>
      <rect x="0" y="0" width="750" height="1050" rx="40" ry="40" fill={`url(#${pid})`} />
      <rect x="20" y="20" width="710" height="1010" rx="35" ry="35" fill="none" stroke="#ffffff" strokeWidth="6" />
      <rect x="40" y="40" width="670" height="90" rx="20" ry="20" fill="rgba(0,0,0,0.45)" stroke="#ffffff" strokeWidth="2" />
      <text x="60" y="100" fill="#ffffff" fontFamily="Arial" fontSize="40" fontWeight="bold">{card.position}</text>
      <circle cx="650" cy="85" r="55" fill="rgba(0,0,0,0.65)" stroke="#ffffff" strokeWidth="4" />
      <text x="650" y="100" fill="#ffffff" strokeWidth="1" fontFamily="Arial" fontSize="42" fontWeight="bold" textAnchor="middle">
        {card.score}
      </text>
      <rect x="95" y="175" width="560" height="620" rx="30" ry="30"
        fill="rgba(0,0,0,0.25)" stroke="#ffffff" strokeWidth="5" strokeDasharray="10 10" />
      <image href={card.image} x="95" y="175" width="560" height="620" preserveAspectRatio="xMidYMid meet" />
      <rect x="80" y="830" width="590" height="80" rx="20" ry="20" fill="rgba(0,0,0,0.6)" stroke="#ffffff" strokeWidth="2" />
      <text x="375" y="880" fill="#ffffff" fontFamily="Arial" fontSize="32" fontWeight="bold" textAnchor="middle">
        {card.name}
      </text>
      <rect x="130" y="950" width="220" height="50" rx="20" ry="20" fill="rgba(0,0,0,0.6)" stroke="#ffffff" strokeWidth="2" />
      <text x="185" y="982" fill={card.accentColor} fontFamily="Arial" fontSize="22">ATT :</text>
      <text x="270" y="982" fill="#ffffff" fontFamily="Arial" fontSize="22">{card.atk}</text>
      <rect x="400" y="950" width="220" height="50" rx="20" ry="20" fill="rgba(0,0,0,0.6)" stroke="#ffffff" strokeWidth="2" />
      <text x="455" y="982" fill={card.accentColor} fontFamily="Arial" fontSize="22">DEF :</text>
      <text x="540" y="982" fill="#ffffff" fontFamily="Arial" fontSize="22">{card.def}</text>
    </svg>
  )
}

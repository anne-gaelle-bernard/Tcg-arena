import type { CardData } from '../../data/cards'
import CardSvg from './CardSvg'
import '../../style/CardZoomModal.css'

interface Props {
  card: CardData
  onClose: () => void
}

export default function CardZoomModal({ card, onClose }: Props) {
  return (
    <div className="czm-overlay" onClick={onClose}>
      <div className="czm-inner" onClick={e => e.stopPropagation()}>
        <CardSvg card={card} width={300} />
        <div className="czm-info">
          <p className="czm-name">{card.name}</p>
          <p className="czm-stats">ATK {card.atk} · DEF {card.def}</p>
        </div>
        <button type="button" className="czm-close" onClick={onClose}>Fermer</button>
      </div>
    </div>
  )
}

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface Card {
  id: number;
  name: string;
  position: string;
  team: string;
  rarity: 'Common' | 'Rare' | 'Epic' | 'Legendary';
  stats: {
    pts: number;
    reb: number;
    ast: number;
  };
  owned: boolean;
  image: string;
}

const CARDS: Card[] = [
  {
    id: 1,
    name: 'Marcus "Flash" Williams',
    position: 'PG',
    team: 'City Ballers',
    rarity: 'Legendary',
    stats: { pts: 32, reb: 5, ast: 11 },
    owned: true,
    image: '🏀',
  },
  {
    id: 2,
    name: 'DeShawn Towers',
    position: 'C',
    team: 'Iron Giants',
    rarity: 'Epic',
    stats: { pts: 24, reb: 14, ast: 3 },
    owned: true,
    image: '🏀',
  },
  {
    id: 3,
    name: 'Carlos "Ice" Rivera',
    position: 'SG',
    team: 'Sunset Suns',
    rarity: 'Rare',
    stats: { pts: 22, reb: 4, ast: 6 },
    owned: true,
    image: '🏀',
  },
  {
    id: 4,
    name: 'Jamal Brooks',
    position: 'SF',
    team: 'Steel City Hawks',
    rarity: 'Rare',
    stats: { pts: 19, reb: 7, ast: 4 },
    owned: false,
    image: '🏀',
  },
  {
    id: 5,
    name: 'Tyrese "Thunder" King',
    position: 'PF',
    team: 'Northern Wolves',
    rarity: 'Epic',
    stats: { pts: 21, reb: 10, ast: 2 },
    owned: false,
    image: '🏀',
  },
  {
    id: 6,
    name: 'Antoine Dupré',
    position: 'PG',
    team: 'Metro Lions',
    rarity: 'Common',
    stats: { pts: 14, reb: 3, ast: 8 },
    owned: true,
    image: '🏀',
  },
  {
    id: 7,
    name: 'Brandon "Sky" Cole',
    position: 'SG',
    team: 'City Ballers',
    rarity: 'Common',
    stats: { pts: 16, reb: 3, ast: 4 },
    owned: false,
    image: '🏀',
  },
  {
    id: 8,
    name: 'Rashid Al-Farsi',
    position: 'C',
    team: 'Desert Storm',
    rarity: 'Legendary',
    stats: { pts: 28, reb: 12, ast: 4 },
    owned: false,
    image: '🏀',
  },
];

const RARITY_COLORS: Record<Card['rarity'], string> = {
  Common: '#7a8a9a',
  Rare: '#4a9eff',
  Epic: '#b44aff',
  Legendary: '#ff9d2e',
};

const FILTERS = ['All', 'Owned', 'Missing', 'Legendary', 'Epic', 'Rare', 'Common'] as const;
type Filter = (typeof FILTERS)[number];

export default function HoopsTCG() {
  const [activeFilter, setActiveFilter] = useState<Filter>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const { logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/');
  }

  const filtered = CARDS.filter((card) => {
    const matchesSearch =
      card.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      card.team.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    switch (activeFilter) {
      case 'Owned':
        return card.owned;
      case 'Missing':
        return !card.owned;
      case 'Legendary':
      case 'Epic':
      case 'Rare':
      case 'Common':
        return card.rarity === activeFilter;
      default:
        return true;
    }
  });

  const ownedCount = CARDS.filter((c) => c.owned).length;

  return (
    <div style={styles.root}>
      {/* Header */}
      <header style={styles.header}>
        <div style={styles.headerLeft}>
          <span style={styles.logo}>🏀 HoopsTCG</span>
          <span style={styles.tagline}>Arena</span>
        </div>
        <nav style={styles.nav}>
          <span style={styles.navItem}>Collection</span>
          <span style={styles.navItem}>Decks</span>
          <span style={styles.navItem}>Market</span>
        </nav>
        <div style={styles.headerRight}>
          <span style={styles.statsChip}>
            {ownedCount} / {CARDS.length} Cards
          </span>
          <button style={styles.logoutBtn} onClick={handleLogout}>
            Sign Out
          </button>
        </div>
      </header>

      {/* Hero Banner */}
      <div style={styles.hero}>
        <h1 style={styles.heroTitle}>My Collection</h1>
        <p style={styles.heroSub}>
          Build your ultimate basketball squad — collect, trade, and dominate.
        </p>
        <div style={styles.progressBar}>
          <div
            style={{
              ...styles.progressFill,
              width: `${(ownedCount / CARDS.length) * 100}%`,
            }}
          />
        </div>
        <span style={styles.progressLabel}>
          {Math.round((ownedCount / CARDS.length) * 100)}% Complete
        </span>
      </div>

      {/* Controls */}
      <div style={styles.controls}>
        <input
          style={styles.searchInput}
          type="text"
          placeholder="Search by name or team…"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <div style={styles.filterRow}>
          {FILTERS.map((f) => (
            <button
              key={f}
              style={{
                ...styles.filterBtn,
                ...(activeFilter === f ? styles.filterBtnActive : {}),
              }}
              onClick={() => setActiveFilter(f)}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Cards Grid */}
      <div style={styles.grid}>
        {filtered.length === 0 && (
          <p style={styles.emptyMsg}>No cards match your search.</p>
        )}
        {filtered.map((card) => (
          <div
            key={card.id}
            style={{
              ...styles.card,
              opacity: card.owned ? 1 : 0.45,
              borderColor: RARITY_COLORS[card.rarity],
            }}
          >
            {/* Rarity badge */}
            <span
              style={{
                ...styles.rarityBadge,
                background: RARITY_COLORS[card.rarity],
              }}
            >
              {card.rarity}
            </span>

            {/* Card art placeholder */}
            <div style={styles.cardArt}>
              <span style={styles.cardArtEmoji}>{card.image}</span>
              <span style={styles.positionBadge}>{card.position}</span>
            </div>

            {/* Card info */}
            <div style={styles.cardBody}>
              <p style={styles.cardName}>{card.name}</p>
              <p style={styles.cardTeam}>{card.team}</p>

              <div style={styles.statsRow}>
                <div style={styles.stat}>
                  <span style={styles.statValue}>{card.stats.pts}</span>
                  <span style={styles.statLabel}>PTS</span>
                </div>
                <div style={styles.stat}>
                  <span style={styles.statValue}>{card.stats.reb}</span>
                  <span style={styles.statLabel}>REB</span>
                </div>
                <div style={styles.stat}>
                  <span style={styles.statValue}>{card.stats.ast}</span>
                  <span style={styles.statLabel}>AST</span>
                </div>
              </div>

              {!card.owned && (
                <button style={styles.acquireBtn}>+ Acquire</button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  root: {
    minHeight: '100vh',
    background: '#0a0604',
    color: '#f2e6d8',
    fontFamily: 'Inter, Segoe UI, Arial, sans-serif',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 32px',
    height: 64,
    background: '#110b06',
    borderBottom: '1px solid #2a1c14',
    position: 'sticky',
    top: 0,
    zIndex: 100,
  },
  headerLeft: {
    display: 'flex',
    alignItems: 'baseline',
    gap: 8,
  },
  logo: {
    fontSize: 22,
    fontWeight: 800,
    color: '#ff9d2e',
    letterSpacing: '-0.5px',
  },
  tagline: {
    fontSize: 14,
    color: '#9f7a59',
    fontWeight: 500,
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
  },
  nav: {
    display: 'flex',
    gap: 28,
  },
  navItem: {
    fontSize: 14,
    color: '#c2a88f',
    cursor: 'pointer',
    fontWeight: 500,
    letterSpacing: '0.03em',
  },
  headerRight: {
    display: 'flex',
    alignItems: 'center',
    gap: 16,
  },
  statsChip: {
    background: '#2a1c14',
    color: '#ff9d2e',
    padding: '4px 12px',
    borderRadius: 20,
    fontSize: 13,
    fontWeight: 700,
  },
  logoutBtn: {
    background: 'transparent',
    border: '1px solid #5d3c26',
    color: '#c2a88f',
    padding: '6px 14px',
    borderRadius: 6,
    cursor: 'pointer',
    fontSize: 13,
    fontWeight: 600,
  },
  hero: {
    padding: '48px 32px 32px',
    borderBottom: '1px solid #1a120d',
    background: 'linear-gradient(180deg, #1a0f07 0%, #0a0604 100%)',
  },
  heroTitle: {
    margin: '0 0 8px',
    fontSize: 40,
    fontWeight: 900,
    color: '#f2e6d8',
    letterSpacing: '-1px',
  },
  heroSub: {
    margin: '0 0 24px',
    color: '#9f7a59',
    fontSize: 16,
  },
  progressBar: {
    height: 8,
    background: '#2a1c14',
    borderRadius: 4,
    maxWidth: 400,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    background: 'linear-gradient(90deg, #ff962f, #ffb34b)',
    borderRadius: 4,
    transition: 'width 0.4s ease',
  },
  progressLabel: {
    display: 'block',
    marginTop: 8,
    fontSize: 13,
    color: '#ff9d2e',
    fontWeight: 700,
  },
  controls: {
    padding: '24px 32px 0',
  },
  searchInput: {
    width: '100%',
    maxWidth: 360,
    background: '#1a120d',
    border: '1px solid #3a2618',
    borderRadius: 8,
    padding: '10px 14px',
    color: '#f2e6d8',
    fontSize: 14,
    outline: 'none',
    boxSizing: 'border-box',
  },
  filterRow: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 14,
    paddingBottom: 4,
  },
  filterBtn: {
    background: '#1a120d',
    border: '1px solid #3a2618',
    color: '#c2a88f',
    padding: '6px 16px',
    borderRadius: 20,
    cursor: 'pointer',
    fontSize: 13,
    fontWeight: 600,
    transition: 'all 0.15s',
  },
  filterBtnActive: {
    background: 'linear-gradient(90deg, #ff962f, #ffb34b)',
    border: '1px solid transparent',
    color: '#2f180a',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
    gap: 20,
    padding: '24px 32px 48px',
  },
  emptyMsg: {
    gridColumn: '1 / -1',
    textAlign: 'center',
    color: '#9f7a59',
    fontSize: 16,
    padding: '40px 0',
  },
  card: {
    background: '#110b06',
    border: '2px solid',
    borderRadius: 14,
    overflow: 'hidden',
    transition: 'transform 0.15s, box-shadow 0.15s',
    cursor: 'default',
    position: 'relative',
  },
  rarityBadge: {
    position: 'absolute',
    top: 10,
    left: 10,
    padding: '3px 10px',
    borderRadius: 20,
    fontSize: 11,
    fontWeight: 800,
    color: '#fff',
    letterSpacing: '0.05em',
    zIndex: 1,
  },
  cardArt: {
    height: 140,
    background: 'linear-gradient(160deg, #1e1108 0%, #0d0703 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  cardArtEmoji: {
    fontSize: 64,
    filter: 'drop-shadow(0 4px 12px rgba(255,150,47,0.4))',
  },
  positionBadge: {
    position: 'absolute',
    bottom: 8,
    right: 10,
    background: 'rgba(255,157,46,0.15)',
    color: '#ff9d2e',
    padding: '2px 8px',
    borderRadius: 4,
    fontSize: 11,
    fontWeight: 800,
    letterSpacing: '0.08em',
  },
  cardBody: {
    padding: '12px 14px 14px',
  },
  cardName: {
    margin: '0 0 2px',
    fontSize: 14,
    fontWeight: 700,
    color: '#f2e6d8',
    lineHeight: 1.3,
  },
  cardTeam: {
    margin: '0 0 12px',
    fontSize: 12,
    color: '#9f7a59',
  },
  statsRow: {
    display: 'flex',
    justifyContent: 'space-between',
    background: '#1a120d',
    borderRadius: 8,
    padding: '8px 0',
  },
  stat: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 800,
    color: '#ff9d2e',
    lineHeight: 1,
  },
  statLabel: {
    fontSize: 10,
    color: '#9f7a59',
    fontWeight: 600,
    marginTop: 2,
    letterSpacing: '0.05em',
  },
  acquireBtn: {
    width: '100%',
    marginTop: 10,
    background: 'transparent',
    border: '1px solid #5d3c26',
    color: '#c2a88f',
    padding: '7px',
    borderRadius: 6,
    cursor: 'pointer',
    fontSize: 12,
    fontWeight: 700,
  },
};

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { clearAuth, getAuth } from '../app/store';

interface Card {
  id: number;
  name: string;
  team: string;
  position: string;
  pts: number;
  reb: number;
  ast: number;
  rarity: string;
  color: string;
}

const cards: Card[] = [
  { id: 1, name: "LeBron James", team: "Lakers", position: "SF", pts: 27.2, reb: 7.3, ast: 7.8, rarity: "Legendary", color: "#ffd700" },
  { id: 2, name: "Stephen Curry", team: "Warriors", position: "PG", pts: 29.4, reb: 6.1, ast: 6.3, rarity: "Legendary", color: "#1d428a" },
  { id: 3, name: "Kevin Durant", team: "Suns", position: "SF", pts: 26.9, reb: 6.7, ast: 5.0, rarity: "Epic", color: "#1d1160" },
  { id: 4, name: "Giannis Antetokounmpo", team: "Bucks", position: "PF", pts: 29.9, reb: 11.6, ast: 5.8, rarity: "Legendary", color: "#00471b" },
  { id: 5, name: "Luka Doncic", team: "Mavericks", position: "PG", pts: 32.4, reb: 9.1, ast: 9.8, rarity: "Epic", color: "#00538c" },
  { id: 6, name: "Joel Embiid", team: "76ers", position: "C", pts: 33.1, reb: 10.2, ast: 4.2, rarity: "Epic", color: "#006bb6" },
  { id: 7, name: "Jayson Tatum", team: "Celtics", position: "SF", pts: 26.9, reb: 8.1, ast: 4.9, rarity: "Rare", color: "#007a33" },
  { id: 8, name: "Devin Booker", team: "Suns", position: "SG", pts: 27.8, reb: 4.5, ast: 6.9, rarity: "Rare", color: "#1d1160" },
  { id: 9, name: "Nikola Jokic", team: "Nuggets", position: "C", pts: 24.5, reb: 11.8, ast: 9.8, rarity: "Legendary", color: "#0e2240" },
];

const rarityConfig: Record<string, { color: string; glow: string; label: string }> = {
  Legendary: { color: '#ffd700', glow: 'rgba(255,215,0,0.4)', label: '⭐ LEGENDARY' },
  Epic: { color: '#b44fff', glow: 'rgba(180,79,255,0.4)', label: '💎 EPIC' },
  Rare: { color: '#4f9fff', glow: 'rgba(79,159,255,0.4)', label: '✦ RARE' },
  Common: { color: '#aaaaaa', glow: 'rgba(170,170,170,0.2)', label: 'COMMON' },
};

const HoopsTCG: React.FC = () => {
  const navigate = useNavigate();
  const auth = getAuth();
  const [search, setSearch] = useState('');
  const [filterRarity, setFilterRarity] = useState('All');
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  const handleLogout = () => {
    clearAuth();
    navigate('/');
  };

  const filtered = cards.filter((c) => {
    const matchSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.team.toLowerCase().includes(search.toLowerCase());
    const matchRarity = filterRarity === 'All' || c.rarity === filterRarity;
    return matchSearch && matchRarity;
  });

  const styles = {
    page: {
      minHeight: '100vh',
      backgroundColor: '#07071a',
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      color: '#ffffff',
    } as React.CSSProperties,
    header: {
      background: 'linear-gradient(135deg, #0d0d2b 0%, #1a0a00 100%)',
      borderBottom: '1px solid rgba(255,140,0,0.3)',
      padding: '0 32px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      height: '68px',
      boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
    } as React.CSSProperties,
    headerLeft: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
    } as React.CSSProperties,
    logo: {
      fontSize: '28px',
    },
    headerTitle: {
      fontSize: '22px',
      fontWeight: 800,
      background: 'linear-gradient(135deg, #ff8c00, #ffd700)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
      letterSpacing: '2px',
      margin: 0,
    } as React.CSSProperties,
    headerRight: {
      display: 'flex',
      alignItems: 'center',
      gap: '16px',
    } as React.CSSProperties,
    userEmail: {
      color: '#8888aa',
      fontSize: '13px',
    },
    logoutBtn: {
      backgroundColor: 'transparent',
      border: '1px solid rgba(255,140,0,0.4)',
      color: '#ff8c00',
      padding: '8px 18px',
      borderRadius: '6px',
      cursor: 'pointer',
      fontSize: '13px',
      fontWeight: 600,
      transition: 'all 0.2s',
    } as React.CSSProperties,
    main: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '32px 24px',
    } as React.CSSProperties,
    pageTitle: {
      fontSize: '28px',
      fontWeight: 700,
      marginBottom: '4px',
      color: '#ffffff',
    },
    pageSubtitle: {
      color: '#666688',
      fontSize: '14px',
      marginBottom: '28px',
    },
    toolbar: {
      display: 'flex',
      gap: '16px',
      marginBottom: '32px',
      flexWrap: 'wrap' as const,
    },
    searchInput: {
      flex: '1',
      minWidth: '200px',
      backgroundColor: '#12122a',
      border: '1px solid rgba(255,140,0,0.2)',
      borderRadius: '8px',
      padding: '12px 16px',
      color: '#ffffff',
      fontSize: '14px',
      outline: 'none',
    } as React.CSSProperties,
    filterBtn: (active: boolean) => ({
      backgroundColor: active ? 'rgba(255,140,0,0.2)' : 'transparent',
      border: `1px solid ${active ? '#ff8c00' : 'rgba(255,255,255,0.15)'}`,
      color: active ? '#ff8c00' : '#888899',
      padding: '10px 18px',
      borderRadius: '8px',
      cursor: 'pointer',
      fontSize: '13px',
      fontWeight: active ? 700 : 400,
      transition: 'all 0.2s',
    } as React.CSSProperties),
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
      gap: '24px',
    } as React.CSSProperties,
    card: (isHovered: boolean, _teamColor: string, rarity: string) => ({
      backgroundColor: '#12122a',
      borderRadius: '16px',
      overflow: 'hidden',
      border: `1px solid ${isHovered ? rarityConfig[rarity]?.color || '#555' : 'rgba(255,255,255,0.08)'}`,
      boxShadow: isHovered
        ? `0 12px 40px rgba(0,0,0,0.6), 0 0 20px ${rarityConfig[rarity]?.glow || 'transparent'}`
        : '0 4px 15px rgba(0,0,0,0.3)',
      transform: isHovered ? 'translateY(-6px) scale(1.02)' : 'translateY(0) scale(1)',
      transition: 'all 0.3s ease',
      cursor: 'pointer',
    } as React.CSSProperties),
    cardHeader: (color: string) => ({
      background: `linear-gradient(135deg, ${color}cc 0%, ${color}44 100%)`,
      padding: '20px',
      borderBottom: '1px solid rgba(255,255,255,0.08)',
      position: 'relative' as const,
    }),
    cardHeaderBg: {
      position: 'absolute' as const,
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      opacity: 0.05,
      fontSize: '80px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    playerName: {
      fontSize: '17px',
      fontWeight: 700,
      color: '#ffffff',
      margin: '0 0 4px 0',
      position: 'relative' as const,
      zIndex: 1,
    },
    teamPosition: {
      display: 'flex',
      gap: '8px',
      alignItems: 'center',
      position: 'relative' as const,
      zIndex: 1,
    },
    team: {
      color: 'rgba(255,255,255,0.8)',
      fontSize: '13px',
    },
    positionBadge: {
      backgroundColor: 'rgba(0,0,0,0.4)',
      color: '#ffffff',
      padding: '2px 8px',
      borderRadius: '4px',
      fontSize: '11px',
      fontWeight: 700,
      letterSpacing: '1px',
    },
    cardBody: {
      padding: '16px 20px 20px',
    } as React.CSSProperties,
    rarityBadge: (rarity: string) => ({
      display: 'inline-flex',
      alignItems: 'center',
      gap: '4px',
      backgroundColor: `${rarityConfig[rarity]?.color || '#aaa'}22`,
      color: rarityConfig[rarity]?.color || '#aaa',
      border: `1px solid ${rarityConfig[rarity]?.color || '#aaa'}44`,
      padding: '4px 10px',
      borderRadius: '20px',
      fontSize: '10px',
      fontWeight: 700,
      letterSpacing: '1px',
      marginBottom: '16px',
    } as React.CSSProperties),
    statsGrid: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr 1fr',
      gap: '8px',
    } as React.CSSProperties,
    statBox: {
      backgroundColor: '#1a1a35',
      borderRadius: '8px',
      padding: '10px 8px',
      textAlign: 'center' as const,
    },
    statValue: {
      fontSize: '18px',
      fontWeight: 700,
      color: '#ffffff',
      display: 'block',
    },
    statLabel: {
      fontSize: '10px',
      color: '#666688',
      letterSpacing: '1px',
      textTransform: 'uppercase' as const,
      marginTop: '2px',
      display: 'block',
    },
    emptyState: {
      textAlign: 'center' as const,
      padding: '60px',
      color: '#555577',
    },
    count: {
      color: '#666688',
      fontSize: '13px',
      marginBottom: '20px',
    },
  };

  return (
    <div style={styles.page}>
      <header style={styles.header}>
        <div style={styles.headerLeft}>
          <span style={styles.logo}>🏀</span>
          <h1 style={styles.headerTitle}>HOOPS TCG</h1>
        </div>
        <div style={styles.headerRight}>
          {auth?.email && <span style={styles.userEmail}>{auth.email}</span>}
          <button
            style={styles.logoutBtn}
            onClick={handleLogout}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'rgba(255,140,0,0.15)';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'transparent';
            }}
          >
            Logout
          </button>
        </div>
      </header>

      <main style={styles.main}>
        <h2 style={styles.pageTitle}>My Collection</h2>
        <p style={styles.pageSubtitle}>Your basketball trading cards</p>

        <div style={styles.toolbar}>
          <input
            style={styles.searchInput}
            type="text"
            placeholder="🔍  Search players or teams..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onFocus={(e) => (e.target.style.borderColor = 'rgba(255,140,0,0.6)')}
            onBlur={(e) => (e.target.style.borderColor = 'rgba(255,140,0,0.2)')}
          />
          {['All', 'Legendary', 'Epic', 'Rare'].map((r) => (
            <button
              key={r}
              style={styles.filterBtn(filterRarity === r)}
              onClick={() => setFilterRarity(r)}
            >
              {r}
            </button>
          ))}
        </div>

        <p style={styles.count}>{filtered.length} card{filtered.length !== 1 ? 's' : ''} found</p>

        {filtered.length === 0 ? (
          <div style={styles.emptyState}>
            <div style={{ fontSize: '48px', marginBottom: '12px' }}>🏀</div>
            <p>No cards found matching your search.</p>
          </div>
        ) : (
          <div style={styles.grid}>
            {filtered.map((card) => (
              <div
                key={card.id}
                style={styles.card(hoveredCard === card.id, card.color, card.rarity)}
                onMouseEnter={() => setHoveredCard(card.id)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <div style={styles.cardHeader(card.color)}>
                  <div style={styles.cardHeaderBg}>🏀</div>
                  <h3 style={styles.playerName}>{card.name}</h3>
                  <div style={styles.teamPosition}>
                    <span style={styles.team}>{card.team}</span>
                    <span style={styles.positionBadge}>{card.position}</span>
                  </div>
                </div>
                <div style={styles.cardBody}>
                  <div style={styles.rarityBadge(card.rarity)}>
                    {rarityConfig[card.rarity]?.label || card.rarity}
                  </div>
                  <div style={styles.statsGrid}>
                    <div style={styles.statBox}>
                      <span style={styles.statValue}>{card.pts}</span>
                      <span style={styles.statLabel}>PTS</span>
                    </div>
                    <div style={styles.statBox}>
                      <span style={styles.statValue}>{card.reb}</span>
                      <span style={styles.statLabel}>REB</span>
                    </div>
                    <div style={styles.statBox}>
                      <span style={styles.statValue}>{card.ast}</span>
                      <span style={styles.statLabel}>AST</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default HoopsTCG;

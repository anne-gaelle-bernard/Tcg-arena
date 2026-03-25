interface CardData {
	id: number;
	name: string;
	role: string;
	imageId: string;
	league: "nba" | "wnba";
	category: "offense" | "defense";
	rarity: "Legend" | "Epic" | "Rare" | "Common";
	vit: number;
	tir: number;
	dri: number;
	def: number;
}

const cards: CardData[] = [
	{ id: 1, name: "LeBron James", role: "Ailier - Forward", imageId: "2544", league: "nba", category: "offense", rarity: "Legend", vit: 85, tir: 88, dri: 90, def: 70 },
	{ id: 2, name: "Stephen Curry", role: "Meneur - Sniper 3 pts", imageId: "201939", league: "nba", category: "offense", rarity: "Rare", vit: 88, tir: 95, dri: 92, def: 61 },
	{ id: 3, name: "Kevin Durant", role: "Ailier - Clutch", imageId: "201142", league: "nba", category: "offense", rarity: "Legend", vit: 87, tir: 98, dri: 88, def: 72 },
	{ id: 4, name: "Michael Jordan", role: "Arriere - GOAT", imageId: "893", league: "nba", category: "offense", rarity: "Legend", vit: 90, tir: 99, dri: 91, def: 85 },
	{ id: 5, name: "Kobe Bryant", role: "Arriere - Chouchou", imageId: "977", league: "nba", category: "offense", rarity: "Legend", vit: 86, tir: 96, dri: 89, def: 74 },
	{ id: 6, name: "Giannis Antetokounmpo", role: "Ailier fort - Power drive", imageId: "203507", league: "nba", category: "offense", rarity: "Epic", vit: 82, tir: 84, dri: 79, def: 78 },
	{ id: 7, name: "Luka Dončić", role: "Meneur - Chef d'orchestre", imageId: "1629029", league: "nba", category: "offense", rarity: "Epic", vit: 86, tir: 87, dri: 91, def: 70 },
	{ id: 8, name: "Nikola Jokić", role: "Pivot - Dunks massifs", imageId: "203999", league: "nba", category: "offense", rarity: "Rare", vit: 70, tir: 83, dri: 62, def: 86 },
	{ id: 9, name: "Shai Gilgeous-Alexander", role: "Meneur - Vitesse pure", imageId: "1628983", league: "nba", category: "offense", rarity: "Common", vit: 94, tir: 73, dri: 82, def: 62 },
	{ id: 10, name: "Victor Wembanyama", role: "Pivot - Ancre", imageId: "1641705", league: "nba", category: "defense", rarity: "Epic", vit: 60, tir: 68, dri: 55, def: 97 },
	{ id: 11, name: "Joel Embiid", role: "Pivot - Arriere transition", imageId: "203954", league: "nba", category: "offense", rarity: "Rare", vit: 90, tir: 82, dri: 80, def: 70 },
	{ id: 12, name: "Jayson Tatum", role: "Ailier - Accelerateur", imageId: "1628369", league: "nba", category: "defense", rarity: "Common", vit: 91, tir: 78, dri: 86, def: 67 },
	{ id: 13, name: "Anthony Davis", role: "Ailier fort - Tir en mouvement", imageId: "203076", league: "nba", category: "offense", rarity: "Epic", vit: 86, tir: 92, dri: 84, def: 68 },
	{ id: 14, name: "Ja Morant", role: "Meneur - Acrobate", imageId: "1629630", league: "nba", category: "offense", rarity: "Rare", vit: 92, tir: 79, dri: 85, def: 63 },
	{ id: 15, name: "Devin Booker", role: "Arriere - Tireur longue distance", imageId: "1626164", league: "nba", category: "offense", rarity: "Rare", vit: 87, tir: 91, dri: 83, def: 65 },
	{ id: 16, name: "Damian Lillard", role: "Meneur - Leader", imageId: "203078", league: "nba", category: "offense", rarity: "Epic", vit: 84, tir: 89, dri: 81, def: 62 },
	{ id: 17, name: "Kawhi Leonard", role: "Ailier - Defenseur elite", imageId: "201950", league: "nba", category: "defense", rarity: "Rare", vit: 85, tir: 86, dri: 80, def: 95 },
	{ id: 18, name: "Jimmy Butler", role: "Ailier - Battant", imageId: "202710", league: "nba", category: "offense", rarity: "Epic", vit: 83, tir: 81, dri: 79, def: 88 },
	{ id: 19, name: "Anthony Edwards", role: "Arriere - Catch rapide", imageId: "1630162", league: "nba", category: "offense", rarity: "Common", vit: 79, tir: 80, dri: 72, def: 66 },
	{ id: 20, name: "Paolo Banchero", role: "Ailier fort - Evolutif", imageId: "1631094", league: "nba", category: "offense", rarity: "Common", vit: 81, tir: 76, dri: 83, def: 68 },
	{ id: 21, name: "Magic Johnson", role: "Meneur - Magicien", imageId: "77142", league: "nba", category: "offense", rarity: "Legend", vit: 88, tir: 80, dri: 89, def: 71 },
	{ id: 22, name: "Larry Bird", role: "Ailier - Legend", imageId: "1449", league: "nba", category: "offense", rarity: "Legend", vit: 82, tir: 96, dri: 78, def: 79 },
	{ id: 23, name: "Shaquille O'Neal", role: "Pivot - Superman", imageId: "406", league: "nba", category: "offense", rarity: "Legend", vit: 73, tir: 85, dri: 58, def: 92 },
	{ id: 24, name: "Tim Duncan", role: "Pivot - Fondation", imageId: "1495", league: "nba", category: "defense", rarity: "Legend", vit: 76, tir: 81, dri: 62, def: 90 },
	{ id: 25, name: "Dirk Nowitzki", role: "Ailier fort - Tir parfait", imageId: "1717", league: "nba", category: "offense", rarity: "Legend", vit: 78, tir: 94, dri: 71, def: 74 },
	{ id: 26, name: "Allen Iverson", role: "Arriere - Battant", imageId: "947", league: "nba", category: "offense", rarity: "Legend", vit: 91, tir: 82, dri: 90, def: 73 },
	{ id: 27, name: "Dwyane Wade", role: "Arriere - Executeur", imageId: "2548", league: "nba", category: "offense", rarity: "Legend", vit: 87, tir: 84, dri: 86, def: 80 },
	{ id: 28, name: "Carmelo Anthony", role: "Ailier - Pur scoreur", imageId: "2546", league: "nba", category: "offense", rarity: "Legend", vit: 83, tir: 92, dri: 81, def: 70 },
	{ id: 29, name: "Kevin Garnett", role: "Ailier fort - Defenseur", imageId: "2037", league: "nba", category: "defense", rarity: "Legend", vit: 80, tir: 77, dri: 64, def: 93 },
	{ id: 30, name: "Chris Paul", role: "Meneur - Point God", imageId: "101108", league: "nba", category: "offense", rarity: "Legend", vit: 84, tir: 79, dri: 87, def: 82 },
	{ id: 31, name: "A'ja Wilson", role: "Ailiere forte - Dominatrice", imageId: "1628932", league: "wnba", category: "offense", rarity: "Rare", vit: 81, tir: 84, dri: 76, def: 88 },
	{ id: 32, name: "Caitlin Clark", role: "Meneuse - Phénomène", imageId: "1642286", league: "wnba", category: "offense", rarity: "Epic", vit: 90, tir: 86, dri: 94, def: 65 },
	{ id: 33, name: "Brittney Griner", role: "Interieuse - Rebond elite", imageId: "203398", league: "wnba", category: "defense", rarity: "Rare", vit: 63, tir: 69, dri: 58, def: 94 },
	{ id: 34, name: "Diana Taurasi", role: "Arriere - Legende WNBA", imageId: "100940", league: "wnba", category: "offense", rarity: "Legend", vit: 85, tir: 89, dri: 84, def: 77 },
	{ id: 35, name: "Sabrina Ionescu", role: "Meneuse - Playmaker", imageId: "1629477", league: "wnba", category: "offense", rarity: "Epic", vit: 88, tir: 81, dri: 89, def: 80 },
	{ id: 36, name: "Breanna Stewart", role: "Ailiere forte - Versatile", imageId: "1627668", league: "wnba", category: "defense", rarity: "Rare", vit: 82, tir: 79, dri: 74, def: 87 },
	{ id: 37, name: "Sue Bird", role: "Meneuse - Leader", imageId: "100720", league: "wnba", category: "offense", rarity: "Legend", vit: 83, tir: 80, dri: 86, def: 79 },
	{ id: 38, name: "Maya Moore", role: "Ailiere - Deux-cotes", imageId: "202632", league: "wnba", category: "offense", rarity: "Epic", vit: 85, tir: 84, dri: 82, def: 83 },
	{ id: 39, name: "Elena Delle Donne", role: "Ailiere - All-Star", imageId: "203399", league: "wnba", category: "offense", rarity: "Rare", vit: 84, tir: 87, dri: 80, def: 81 },
	{ id: 40, name: "Candace Parker", role: "Ailiere forte - Athlète", imageId: "201496", league: "wnba", category: "defense", rarity: "Rare", vit: 84, tir: 78, dri: 76, def: 86 },
];

const rarityColors: Record<string, string> = {
	Legend: "#c8960c",
	Epic: "#9b30d0",
	Rare: "#1a6fbf",
	Common: "#4a4a4a",
};

interface HoopsTCGProps {
	onLogout: () => void;
}

function Card({ card }: { card: CardData }) {
	const imgSrc =
		card.league === "wnba"
			? `https://cdn.wnba.com/headshots/wnba/latest/1040x760/${card.imageId}.png`
			: `https://cdn.nba.com/headshots/nba/latest/1040x760/${card.imageId}.png`;

	return (
		<article
			style={{
				background: "#f2efe6",
				color: "#1f1f1f",
				borderRadius: 12,
				padding: 14,
				border: "3px solid #222",
				boxShadow: "0 8px 18px rgba(0,0,0,0.35)",
				position: "relative",
				overflow: "hidden",
				display: "flex",
				flexDirection: "column",
				boxSizing: "border-box",
			}}
		>
			{/* Dashed inner border */}
			<span
				aria-hidden="true"
				style={{
					position: "absolute",
					inset: 6,
					border: "1px dashed rgba(0,0,0,0.25)",
					borderRadius: 10,
					pointerEvents: "none",
				}}
			/>

			{/* Rarity badge */}
			<span
				style={{
					position: "absolute",
					top: 12,
					right: 12,
					fontSize: 11,
					fontWeight: 700,
					textTransform: "uppercase",
					color: "#fff",
					background: rarityColors[card.rarity] ?? "#2b2b2b",
					padding: "4px 6px",
					borderRadius: 4,
				}}
			>
				{card.rarity}
			</span>

			<img
				src={imgSrc}
				alt={card.name}
				style={{
					width: "100%",
					height: 200,
					objectFit: "cover",
					borderRadius: 8,
					marginBottom: 12,
					background: "linear-gradient(135deg, #ccc 0%, #999 100%)",
				}}
			/>

			<span
				style={{
					display: "inline-block",
					fontSize: 11,
					letterSpacing: "0.6px",
					textTransform: "uppercase",
					padding: "4px 8px",
					borderRadius: 999,
					background: card.category === "offense" ? "#f07f2f" : "#2a6ef2",
					color: "#fff",
					alignSelf: "flex-start",
				}}
			>
				{card.category === "offense" ? "Attaque" : "Défense"}
			</span>

			<div style={{ margin: "10px 0 6px", fontSize: 18, fontWeight: 800 }}>{card.name}</div>
			<div style={{ fontSize: 13, color: "#4b4b4b", marginBottom: 10 }}>{card.role}</div>

			<div
				style={{
					display: "grid",
					gridTemplateColumns: "repeat(2, 1fr)",
					gap: "6px 10px",
					fontSize: 12,
				}}
			>
				{[
					{ label: "VIT", value: card.vit },
					{ label: "TIR", value: card.tir },
					{ label: "DRI", value: card.dri },
					{ label: "DEF", value: card.def },
				].map(({ label, value }) => (
					<div
						key={label}
						style={{
							background: "#f9f6ef",
							border: "1px solid #d7d2c6",
							borderRadius: 6,
							padding: "6px 8px",
							display: "flex",
							justifyContent: "space-between",
							fontWeight: 600,
						}}
					>
						<span>{label}</span>
						<span>{value}</span>
					</div>
				))}
			</div>
		</article>
	);
}

export default function HoopsTCG({ onLogout }: HoopsTCGProps) {
	return (
		<div
			style={{
				margin: 0,
				fontFamily: "'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif",
				color: "#eef2ff",
				background:
					"radial-gradient(circle at 20% 10%, #243a6b 0%, transparent 45%), radial-gradient(circle at 80% 0%, #4b1f14 0%, transparent 50%), linear-gradient(160deg, #0f1a2b, #111b35)",
				minHeight: "100vh",
			}}
		>
			<header
				style={{
					padding: "28px 24px 8px",
					textAlign: "center",
					position: "relative",
				}}
			>
				<button
					onClick={onLogout}
					style={{
						position: "absolute",
						top: 28,
						right: 24,
						background: "rgba(255,255,255,0.1)",
						border: "1px solid rgba(255,255,255,0.3)",
						color: "#eef2ff",
						borderRadius: 6,
						padding: "6px 14px",
						cursor: "pointer",
						fontSize: 13,
					}}
				>
					← Logout
				</button>
				<h1
					style={{
						margin: 0,
						fontSize: 28,
						letterSpacing: 1,
						textTransform: "uppercase",
					}}
				>
					40 Cartes TCG Basket – GROK Edition
				</h1>
				<p style={{ margin: "8px 0 0", color: "#c8d2f0", fontSize: 14 }}>
					40 Joueurs et joueuses NBA/WNBA uniques sans doublons
				</p>
			</header>

			<main
				style={{
					display: "grid",
					gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))",
					gap: 18,
					padding: 24,
				}}
			>
				{cards.map((card) => (
					<Card key={card.id} card={card} />
				))}
			</main>
		</div>
	);
}

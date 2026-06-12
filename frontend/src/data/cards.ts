export type CardTheme = 'legends' | 'talents' | 'specials'

export interface CardData {
  id: string
  name: string
  theme: CardTheme
  image: string
  atk: number
  def: number
  position: string
  accentColor: string
  score: number
}

export const ALL_CARDS: CardData[] = [
  // ── LEGENDS ───────────────────────────────────────────────
  { id: 'leg_kb',  name: 'KOBE BRYANT',           theme: 'legends',  image: '/png/KB.png',  atk: 99, def: 75, position: 'SG/SF', accentColor: '#f2c94c', score: 99 },
  { id: 'leg_dr',  name: 'DERRICK ROSE',           theme: 'legends',  image: '/png/DR.png',  atk: 99, def: 75, position: 'PG',    accentColor: '#ff0000', score: 99 },
  { id: 'leg_lj',  name: 'LEBRON JAMES',           theme: 'legends',  image: '/png/LJ.png',  atk: 99, def: 90, position: 'PG',    accentColor: '#ff0000', score: 99 },
  { id: 'leg_so',  name: "SHAQUILLE O'NEAL",       theme: 'legends',  image: '/png/SO.png',  atk: 60, def: 99, position: 'C',     accentColor: '#f2c94c', score: 99 },
  { id: 'leg_mj',  name: 'MICHAEL JORDAN',         theme: 'legends',  image: '/png/MJ.png',  atk: 99, def: 99, position: 'SG/SF', accentColor: '#ff0000', score: 99 },
  { id: 'leg_kd',  name: 'KEVIN DURANT',           theme: 'legends',  image: '/png/KD.png',  atk: 96, def: 85, position: 'SF/PF', accentColor: '#f2c94c', score: 99 },
  { id: 'leg_sc',  name: 'STEPHEN CURRY',          theme: 'legends',  image: '/png/SC.png',  atk: 96, def: 50, position: 'PG/SG', accentColor: '#f2c94c', score: 99 },
  { id: 'leg_ai',  name: 'ALLEN IVERSON',          theme: 'legends',  image: '/png/AI.png',  atk: 96, def: 40, position: 'PG',    accentColor: '#ff0000', score: 99 },
  { id: 'leg_ca',  name: 'CARMELO ANTHONY',        theme: 'legends',  image: '/png/CA.png',  atk: 85, def: 75, position: 'SG/SF', accentColor: '#0022FF', score: 99 },
  { id: 'leg_dro', name: 'DENNIS RODMAN',          theme: 'legends',  image: '/png/DRO.png', atk: 80, def: 97, position: 'SF',    accentColor: '#ff0000', score: 99 },
  { id: 'leg_ym',  name: 'YAO MING',               theme: 'legends',  image: '/png/YM.png',  atk: 70, def: 99, position: 'C',     accentColor: '#0022FF', score: 99 },
  { id: 'leg_dn',  name: 'DIRK NOWITZKI',          theme: 'legends',  image: '/png/DN.png',  atk: 88, def: 87, position: 'PF/C',  accentColor: '#0022FF', score: 99 },
  { id: 'leg_dt',  name: 'DIANA TAURASI',          theme: 'legends',  image: '/png/DT.png',  atk: 95, def: 80, position: 'SG',    accentColor: '#0022FF', score: 99 },
  { id: 'leg_sb',  name: 'SUE BIRD',               theme: 'legends',  image: '/png/SB.png',  atk: 95, def: 80, position: 'PG',    accentColor: '#f2c94c', score: 99 },
  { id: 'leg_bs',  name: 'BREANNA STEWART',        theme: 'legends',  image: '/png/BS.png',  atk: 92, def: 90, position: 'PF',    accentColor: '#ff0000', score: 99 },
  { id: 'leg_bg',  name: 'BRITTNEY GRINER',        theme: 'legends',  image: '/png/BG.png',  atk: 80, def: 99, position: 'C',     accentColor: '#ff0000', score: 99 },

  // ── TALENTS ───────────────────────────────────────────────
  { id: 'tal_vw',  name: 'VICTOR WEMBANYAMA',      theme: 'talents',  image: '/png/VW.png',  atk: 80, def: 80, position: 'PF/C',  accentColor: '#f2c94c', score: 95 },
  { id: 'tal_jt',  name: 'JASON TATUM',            theme: 'talents',  image: '/png/JT.png',  atk: 80, def: 75, position: 'SF',    accentColor: '#f2c94c', score: 91 },
  { id: 'tal_je',  name: 'JOEL EMBIID',            theme: 'talents',  image: '/png/JE.png',  atk: 78, def: 82, position: 'C',     accentColor: '#f2c94c', score: 92 },
  { id: 'tal_nj',  name: 'NIKOLA JOKIC',           theme: 'talents',  image: '/png/NJ.png',  atk: 82, def: 78, position: 'C',     accentColor: '#f2c94c', score: 93 },
  { id: 'tal_ld',  name: 'LUKA DONCIC',            theme: 'talents',  image: '/png/LD.png',  atk: 85, def: 70, position: 'PG/SG', accentColor: '#f2c94c', score: 92 },
  { id: 'tal_sa',  name: 'SHAI G-A',               theme: 'talents',  image: '/png/SA.png',  atk: 83, def: 72, position: 'PG',    accentColor: '#f2c94c', score: 91 },
  { id: 'tal_jm',  name: 'JA MORANT',              theme: 'talents',  image: '/png/JM.png',  atk: 86, def: 65, position: 'PG',    accentColor: '#f2c94c', score: 90 },
  { id: 'tal_db',  name: 'DEVIN BOOKER',           theme: 'talents',  image: '/png/DB.png',  atk: 84, def: 68, position: 'SG',    accentColor: '#f2c94c', score: 90 },
  { id: 'tal_dl',  name: 'DAMIAN LILLARD',         theme: 'talents',  image: '/png/DL.png',  atk: 85, def: 65, position: 'PG',    accentColor: '#f2c94c', score: 90 },
  { id: 'tal_kl',  name: 'KAWHI LEONARD',          theme: 'talents',  image: '/png/KL.png',  atk: 80, def: 82, position: 'SF',    accentColor: '#f2c94c', score: 91 },
  { id: 'tal_ae',  name: 'ANTHONY EDWARDS',        theme: 'talents',  image: '/png/AE.png',  atk: 85, def: 72, position: 'SF',    accentColor: '#f2c94c', score: 90 },
  { id: 'tal_ga',  name: 'GIANNIS ANTETOKOUNMPO',  theme: 'talents',  image: '/png/GA.png',  atk: 83, def: 85, position: 'PF',    accentColor: '#f2c94c', score: 93 },
  { id: 'tal_cc',  name: 'CAITLIN CLARK',          theme: 'talents',  image: '/png/CC.png',  atk: 82, def: 65, position: 'PG',    accentColor: '#f2c94c', score: 90 },
  { id: 'tal_aw',  name: "A'JA WILSON",            theme: 'talents',  image: '/png/AW.png',  atk: 80, def: 80, position: 'SF',    accentColor: '#f2c94c', score: 91 },
  { id: 'tal_si',  name: 'SABRINA IONESCU',        theme: 'talents',  image: '/png/SI.png',  atk: 78, def: 70, position: 'PG/SG', accentColor: '#f2c94c', score: 88 },
  { id: 'tal_gw',  name: 'GABY WILLIAMS',          theme: 'talents',  image: '/png/GWi.png', atk: 79, def: 75, position: 'SG/SF', accentColor: '#f2c94c', score: 88 },

  // ── SPECIALS (boosted Talents, purple theme) ───────────────
  { id: 'spe_vw',  name: 'VICTOR WEMBANYAMA',      theme: 'specials', image: '/png/VW.png',  atk: 92, def: 93, position: 'PF/C',  accentColor: '#7c3aed', score: 97 },
  { id: 'spe_jt',  name: 'JASON TATUM',            theme: 'specials', image: '/png/JT.png',  atk: 90, def: 86, position: 'SF',    accentColor: '#7c3aed', score: 94 },
  { id: 'spe_je',  name: 'JOEL EMBIID',            theme: 'specials', image: '/png/JE.png',  atk: 89, def: 92, position: 'C',     accentColor: '#7c3aed', score: 95 },
  { id: 'spe_nj',  name: 'NIKOLA JOKIC',           theme: 'specials', image: '/png/NJ.png',  atk: 93, def: 88, position: 'C',     accentColor: '#7c3aed', score: 96 },
  { id: 'spe_ld',  name: 'LUKA DONCIC',            theme: 'specials', image: '/png/LD.png',  atk: 95, def: 80, position: 'PG/SG', accentColor: '#7c3aed', score: 95 },
  { id: 'spe_sa',  name: 'SHAI G-A',               theme: 'specials', image: '/png/SA.png',  atk: 93, def: 82, position: 'PG',    accentColor: '#7c3aed', score: 94 },
  { id: 'spe_jm',  name: 'JA MORANT',              theme: 'specials', image: '/png/JM.png',  atk: 94, def: 75, position: 'PG',    accentColor: '#7c3aed', score: 93 },
  { id: 'spe_db',  name: 'DEVIN BOOKER',           theme: 'specials', image: '/png/DB.png',  atk: 93, def: 76, position: 'SG',    accentColor: '#7c3aed', score: 93 },
  { id: 'spe_dl',  name: 'DAMIAN LILLARD',         theme: 'specials', image: '/png/DL.png',  atk: 93, def: 74, position: 'PG',    accentColor: '#7c3aed', score: 92 },
  { id: 'spe_kl',  name: 'KAWHI LEONARD',          theme: 'specials', image: '/png/KL.png',  atk: 89, def: 91, position: 'SF',    accentColor: '#7c3aed', score: 93 },
  { id: 'spe_ae',  name: 'ANTHONY EDWARDS',        theme: 'specials', image: '/png/AE.png',  atk: 94, def: 80, position: 'SF',    accentColor: '#7c3aed', score: 93 },
  { id: 'spe_ga',  name: 'GIANNIS ANTETOKOUNMPO',  theme: 'specials', image: '/png/GA.png',  atk: 92, def: 94, position: 'PF',    accentColor: '#7c3aed', score: 96 },
  { id: 'spe_cc',  name: 'CAITLIN CLARK',          theme: 'specials', image: '/png/CC.png',  atk: 91, def: 74, position: 'PG',    accentColor: '#7c3aed', score: 92 },
  { id: 'spe_aw',  name: "A'JA WILSON",            theme: 'specials', image: '/png/AW.png',  atk: 90, def: 88, position: 'SF',    accentColor: '#7c3aed', score: 93 },
  { id: 'spe_si',  name: 'SABRINA IONESCU',        theme: 'specials', image: '/png/SI.png',  atk: 87, def: 78, position: 'PG/SG', accentColor: '#7c3aed', score: 90 },
  { id: 'spe_gw',  name: 'GABY WILLIAMS',          theme: 'specials', image: '/png/GWi.png', atk: 88, def: 83, position: 'SG/SF', accentColor: '#7c3aed', score: 90 },
]

export const TALENT_IDS = ALL_CARDS.filter(c => c.theme === 'talents').map(c => c.id)

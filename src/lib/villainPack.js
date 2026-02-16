// src/lib/villainPack.js
// "Villain Pack" — iconic villain-inspired classes
// Self-registers draw functions into pixelArt registry

import { registerClassDraw, px, drawHead } from "./pixelArt";

// ═══════════════════════════════════════
// VILLAIN PACK CLASS DEFINITIONS
// ═══════════════════════════════════════
export const VILLAIN_CLASSES = {
  dreadlord: {
    id: "dreadlord", name: "Dreadlord", icon: "🟣", pack: "villain",
    description: "Cosmic tyrant who seeks ultimate power",
    unlockLevel: 22,
    color: { robe: "#6030a0", robeMid: "#7840b8", robeDark: "#402070", robeLight: "#9060d0", accent: "#f0c030" },
    abilities: { passive: "Inevitability — Cannot lose more than 2 class HP per question", active: "Snap — Instantly deal half of boss's remaining HP (10 question cooldown)" },
  },
  jestermind: {
    id: "jestermind", name: "Jestermind", icon: "🃏", pack: "villain",
    description: "Chaotic genius with a sinister smile",
    unlockLevel: 10,
    color: { robe: "#5020a0", robeMid: "#6830b8", robeDark: "#381070", robeLight: "#8050d0", accent: "#30a040" },
    abilities: { passive: "Wild Card — 30% chance any answer counts as correct (still learn from mistakes)", active: "Chaos Bomb — Randomize boss's next attack target (4 question cooldown)" },
  },
  voidlord: {
    id: "voidlord", name: "Voidlord", icon: "⬛", pack: "villain",
    description: "Dark armored enforcer with mechanical breathing",
    unlockLevel: 24,
    color: { robe: "#1a1a28", robeMid: "#282838", robeDark: "#0e0e18", robeLight: "#383848", accent: "#c03030" },
    abilities: { passive: "Dark Side — Incorrect answers by opponents deal 1 damage to boss", active: "Force Choke — Boss loses next attack and takes 3 damage (6 question cooldown)" },
  },
  ironwarden: {
    id: "ironwarden", name: "Ironwarden", icon: "🧲", pack: "villain",
    description: "Master of magnetic forces",
    unlockLevel: 12,
    color: { robe: "#802040", robeMid: "#a03058", robeDark: "#601030", robeLight: "#c04870", accent: "#8040a0" },
    abilities: { passive: "Magnetic Shield — Reflect 1 counterattack damage back to boss", active: "Metal Storm — Deal 2 damage per team member present (5 question cooldown)" },
  },
  trickster: {
    id: "trickster", name: "Trickster", icon: "🐍", pack: "villain",
    description: "Silver-tongued shapeshifter with illusion magic",
    unlockLevel: 5,
    color: { robe: "#207838", robeMid: "#309848", robeDark: "#105028", robeLight: "#40b858", accent: "#f0c848" },
    abilities: { passive: "Illusion — First wrong answer each battle is forgiven", active: "Mirror Image — Copy the highest-damage teammate's last attack (4 question cooldown)" },
  },
  symbiote: {
    id: "symbiote", name: "Symbiote", icon: "🕸️", pack: "villain",
    description: "Living alien organism bonded to a host",
    unlockLevel: 15,
    color: { robe: "#101018", robeMid: "#181828", robeDark: "#080810", robeLight: "#282838", accent: "#e0e0f0" },
    abilities: { passive: "Consume — Heal 1 class HP on every 3rd correct answer", active: "Tendril Strike — Deal 3 damage to boss and steal 1 HP (5 question cooldown)" },
  },
  steeltyrant: {
    id: "steeltyrant", name: "Steeltyrant", icon: "👹", pack: "villain",
    description: "Iron-masked ruler who combines science and sorcery",
    unlockLevel: 26,
    color: { robe: "#207830", robeMid: "#309040", robeDark: "#105020", robeLight: "#40a850", accent: "#a0a8b8" },
    abilities: { passive: "Doombot — If class HP hits 0, survive once at 1 HP per battle", active: "Arcane Blast — Deal 5 damage, ignore all boss defenses (7 question cooldown)" },
  },
  psyborn: {
    id: "psyborn", name: "Psyborn", icon: "🔮", pack: "villain",
    description: "Psychic entity of immense mental power",
    unlockLevel: 28,
    color: { robe: "#8848c0", robeMid: "#a060d8", robeDark: "#603090", robeLight: "#b878e8", accent: "#d0d0e8" },
    abilities: { passive: "Telekinesis — Move your answer submission after seeing the question hint", active: "Psychic Surge — Deal damage equal to your current streak count (5 question cooldown)" },
  },
  hexglider: {
    id: "hexglider", name: "Hexglider", icon: "🎃", pack: "villain",
    description: "Cackling menace on a flying machine",
    unlockLevel: 18,
    color: { robe: "#308030", robeMid: "#409840", robeDark: "#206020", robeLight: "#50b850", accent: "#d060d0" },
    abilities: { passive: "Pumpkin Bombs — Correct answers have 25% chance to deal +3 splash damage", active: "Glider Rush — Deal 4 damage and dodge next counterattack (5 question cooldown)" },
  },
  frostlord: {
    id: "frostlord", name: "Frostlord", icon: "❄️", pack: "villain",
    description: "Alien emperor with terrifying transformations",
    unlockLevel: 31,
    color: { robe: "#d0c0e0", robeMid: "#e0d8f0", robeDark: "#a090c0", robeLight: "#f0e8ff", accent: "#8040a0" },
    abilities: { passive: "Final Form — Gain +1 damage for every 25% of class HP lost", active: "Death Beam — Deal 6 damage to boss (7 question cooldown)" },
  },
  nightclaw: {
    id: "nightclaw", name: "Nightclaw", icon: "🐱", pack: "villain",
    description: "Agile thief with razor-sharp reflexes",
    unlockLevel: 8,
    color: { robe: "#181828", robeMid: "#282838", robeDark: "#0e0e18", robeLight: "#383848", accent: "#d0a040" },
    abilities: { passive: "Nine Lives — Survive 3 would-be killing blows at 1 HP", active: "Cat Burglar — Steal 2 boss HP and add to class HP (5 question cooldown)" },
  },
  flameshell: {
    id: "flameshell", name: "Flameshell", icon: "🐲", pack: "villain",
    description: "Massive spiked beast king who breathes fire",
    unlockLevel: 34,
    color: { robe: "#308030", robeMid: "#409840", robeDark: "#206020", robeLight: "#50b850", accent: "#c83030" },
    abilities: { passive: "Spiky Shell — Attackers take 1 damage when they deal counterattack damage", active: "Fire Breath — Deal 3 damage per turn for 3 turns (8 question cooldown)" },
  },
};

// ═══════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════
function heroBody(ctx, cl, by, hw, yS, yE) {
  for(let y=yS;y<=yE;y++)for(let x=24-hw;x<=23+hw;x++){
    let c=cl.robe;if(x<24-hw+2)c=cl.robeDark;else if(x>23+hw-2)c=cl.robeLight;
    px(ctx,x,y+by,c);
  }
}

// ═══════════════════════════════════════
// DRAW FUNCTIONS — BATCH 1 (6 of 12)
// ═══════════════════════════════════════

// ─── DREADLORD (Thanos) ───
function drawDreadlord(ctx,sk,hr,ey,cl,L,by,f,sp,gl){
  for(let x=12;x<=35;x++)px(ctx,x,46,"#0004");
  // Massive armored body
  for(let y=20;y<=40;y++)for(let x=14;x<=33;x++){let c="#4030a0";if(x<=16)c="#302078";else if(x>=31)c="#5848b8";if(y>=34)c="#302078";px(ctx,x,y+by,c);}
  // Gold chest plate
  for(let x=18;x<=29;x++)for(let y=24;y<=30;y++){let c=cl.accent;if(y===24||y===30)c="#d4a020";px(ctx,x,y+by,c);}
  // Belt
  for(let x=14;x<=33;x++)px(ctx,x,34+by,cl.accent);
  // Legs wide
  for(let y=36;y<=44;y++){for(let x=15;x<=21;x++)px(ctx,x,y+by,"#302078");for(let x=26;x<=32;x++)px(ctx,x,y+by,"#302078");}
  for(let x=14;x<=22;x++)px(ctx,x,44+by,cl.accent);for(let x=25;x<=33;x++)px(ctx,x,44+by,cl.accent);
  // Huge arms
  for(let y=22;y<=36;y++){px(ctx,11,y+by,"#302078");px(ctx,12,y+by,"#4030a0");px(ctx,13,y+by,"#4030a0");px(ctx,34,y+by,"#4030a0");px(ctx,35,y+by,"#4030a0");px(ctx,36,y+by,"#5848b8");}
  // GAUNTLET (left hand golden)
  for(let x=10;x<=14;x++)for(let y=36;y<=39;y++)px(ctx,x,y+by,cl.accent);
  if(f%6<3){px(ctx,11,37+by,"#fff");px(ctx,12,38+by,"#60d0ff");px(ctx,13,37+by,"#ff4040");} // gem glow
  for(let x=33;x<=37;x++)for(let y=36;y<=39;y++)px(ctx,x,y+by,"#5848b8");
  // Purple head with chin grooves
  for(let x=17;x<=30;x++)for(let y=6;y<=19;y++){let c="#7050b0";if(y<=8)c="#8060c0";else if(y>=17)c="#5040a0";if(x<=18||x>=29)c="#5040a0";px(ctx,x,y+by,c);}
  // Chin grooves
  for(let y=16;y<=19;y++){px(ctx,20,y+by,"#4030a0");px(ctx,22,y+by,"#4030a0");px(ctx,25,y+by,"#4030a0");px(ctx,27,y+by,"#4030a0");}
  // Eyes
  for(let x=19;x<=22;x++)px(ctx,x,12+by,"#fff");for(let x=25;x<=28;x++)px(ctx,x,12+by,"#fff");
  px(ctx,21,13+by,"#4030a0");px(ctx,27,13+by,"#4030a0");
  // Helmet/crown
  for(let x=18;x<=29;x++)px(ctx,x,5+by,cl.accent);px(ctx,23,4+by,cl.accent);px(ctx,24,4+by,cl.accent);
}

// ─── JESTERMIND (Joker) ───
function drawJestermind(ctx,sk,hr,ey,cl,L,by,f,sp,gl){
  for(let x=16;x<=31;x++)px(ctx,x,46,"#0004");
  // Purple suit
  heroBody(ctx,cl,by,6,22,42);
  // Suit lapels
  for(let y=22;y<=30;y++){px(ctx,20,y+by,cl.robeLight);px(ctx,27,y+by,cl.robeLight);}
  // Green shirt underneath
  for(let y=24;y<=32;y++)for(let x=21;x<=26;x++)px(ctx,x,y+by,cl.accent);
  // Tie
  px(ctx,23,24+by,"#e04040");px(ctx,24,24+by,"#e04040");px(ctx,23,25+by,"#c03030");px(ctx,24,26+by,"#c03030");px(ctx,23,27+by,"#a02020");
  // Flower
  px(ctx,20,24+by,"#e06080");px(ctx,20,23+by,"#e06080");px(ctx,19,24+by,"#e06080");
  // Legs
  for(let y=36;y<=44;y++){for(let x=19;x<=22;x++)px(ctx,x,y+by,cl.robeDark);for(let x=25;x<=28;x++)px(ctx,x,y+by,cl.robeDark);}
  // Arms
  for(let y=23;y<=35;y++){px(ctx,15,y+by,cl.robeDark);px(ctx,16,y+by,cl.robe);px(ctx,31,y+by,cl.robe);px(ctx,32,y+by,cl.robeLight);}
  // Card in hand
  for(let x=33;x<=36;x++)for(let y=32;y<=37;y++)px(ctx,x,y+by,"#f0f0f0");px(ctx,34,34+by,"#c03030");px(ctx,35,35+by,"#c03030");
  // Pale face
  for(let x=18;x<=29;x++)for(let y=7;y<=19;y++){let c="#e8e0d8";if(y<=8)c="#f0ece8";else if(y>=18)c="#d0c8c0";px(ctx,x,y+by,c);}
  // Green hair — wild
  for(let x=16;x<=31;x++)for(let y=2;y<=9;y++){let c=cl.accent;if(y<=3)c="#40c858";if(x<=17||x>=30)c="#208030";px(ctx,x,y+by,c);}
  for(let y=10;y<=16;y++){px(ctx,16,y+by,cl.accent);px(ctx,17,y+by,cl.accent);px(ctx,30,y+by,cl.accent);px(ctx,31,y+by,cl.accent);}
  // Wild spikes
  px(ctx,15,3+by,cl.accent);px(ctx,14,2+by,cl.accent);px(ctx,32,4+by,cl.accent);px(ctx,33,3+by,cl.accent);px(ctx,22,1+by,"#40c858");px(ctx,26,1+by,"#40c858");
  // Eyes
  for(let x=19;x<=22;x++)px(ctx,x,12+by,"#fff");for(let x=25;x<=28;x++)px(ctx,x,12+by,"#fff");
  px(ctx,21,13+by,"#30a040");px(ctx,27,13+by,"#30a040");
  // WIDE GRIN
  for(let x=19;x<=28;x++)px(ctx,x,17+by,"#c03030");
  px(ctx,18,16+by,"#c03030");px(ctx,29,16+by,"#c03030");
  px(ctx,20,17+by,"#fff");px(ctx,22,17+by,"#fff");px(ctx,25,17+by,"#fff");px(ctx,27,17+by,"#fff");
}

// ─── VOIDLORD (Darth Vader) ───
function drawVoidlord(ctx,sk,hr,ey,cl,L,by,f,sp,gl){
  for(let x=14;x<=33;x++)px(ctx,x,46,"#0004");
  // Cape
  for(let y=18+by;y<=44+by;y++){const s=Math.floor((y-18)*.3);for(let x=12-s;x<=13;x++)if(x>=4)px(ctx,x,y,cl.robeDark);for(let x=34;x<=35+s;x++)if(x<=43)px(ctx,x,y,cl.robeDark);}
  // Black armor body
  heroBody(ctx,cl,by,7,20,40);
  // Chest panel
  for(let x=20;x<=27;x++)for(let y=26;y<=30;y++)px(ctx,x,y+by,"#383848");
  px(ctx,22,27+by,"#c03030");px(ctx,24,27+by,"#30a040");px(ctx,26,28+by,"#3060c0");
  px(ctx,21,29+by,"#808090");px(ctx,23,29+by,"#808090");px(ctx,25,29+by,"#808090");
  // Belt
  for(let x=17;x<=30;x++)px(ctx,x,34+by,"#383848");px(ctx,23,34+by,"#808090");px(ctx,24,34+by,"#808090");
  // Legs
  for(let y=36;y<=44;y++){for(let x=17;x<=22;x++)px(ctx,x,y+by,cl.robeDark);for(let x=25;x<=30;x++)px(ctx,x,y+by,cl.robeDark);}
  // Arms
  for(let y=22;y<=36;y++){px(ctx,14,y+by,cl.robeDark);px(ctx,15,y+by,cl.robe);px(ctx,32,y+by,cl.robe);px(ctx,33,y+by,cl.robeLight);}
  // Lightsaber
  for(let y=4;y<=34;y++)px(ctx,36,y+by,cl.accent);
  if(gl){px(ctx,35,10+by,cl.accent+"60");px(ctx,37,10+by,cl.accent+"60");px(ctx,35,20+by,cl.accent+"40");px(ctx,37,20+by,cl.accent+"40");}
  for(let y=34;y<=38;y++)px(ctx,36,y+by,"#808090");
  // Full helmet
  for(let x=16;x<=31;x++)for(let y=4;y<=19;y++){let c=cl.robe;if(y<=5)c=cl.robeLight;else if(y>=18)c=cl.robeDark;if(x<=17||x>=30)c=cl.robeDark;px(ctx,x,y+by,c);}
  // Triangular eye lenses
  for(let x=19;x<=22;x++)px(ctx,x,11+by,"#383848");for(let x=25;x<=28;x++)px(ctx,x,11+by,"#383848");
  px(ctx,20,12+by,"#383848");px(ctx,21,12+by,"#383848");px(ctx,26,12+by,"#383848");px(ctx,27,12+by,"#383848");
  // Breathing mask grill
  for(let x=21;x<=26;x+=2)for(let y=14;y<=17;y++)px(ctx,x,y+by,"#383848");
  // Helmet crest
  for(let y=4;y<=10;y++)px(ctx,23,y+by,"#383848");px(ctx,24,4+by,"#383848");
}

// ─── IRONWARDEN (Magneto) ───
function drawIronwarden(ctx,sk,hr,ey,cl,L,by,f,sp,gl){
  for(let x=14;x<=33;x++)px(ctx,x,46,"#0004");
  // Cape
  for(let y=18+by;y<=44+by;y++){const s=Math.floor((y-18)*.3);px(ctx,12-s,y,cl.accent);px(ctx,35+s,y,cl.accent);}
  // Armored body
  heroBody(ctx,cl,by,6,22,40);
  // Chest emblem
  px(ctx,22,27+by,"#e0e0f0");px(ctx,23,26+by,"#e0e0f0");px(ctx,24,26+by,"#e0e0f0");px(ctx,25,27+by,"#e0e0f0");px(ctx,23,28+by,"#e0e0f0");px(ctx,24,28+by,"#e0e0f0");
  for(let x=17;x<=30;x++)px(ctx,x,34+by,cl.accent);
  for(let y=36;y<=44;y++){for(let x=18;x<=22;x++)px(ctx,x,y+by,cl.robeDark);for(let x=25;x<=29;x++)px(ctx,x,y+by,cl.robeDark);}
  for(let y=23;y<=36;y++){px(ctx,15,y+by,cl.robeDark);px(ctx,16,y+by,cl.robe);px(ctx,31,y+by,cl.robe);px(ctx,32,y+by,cl.robeLight);}
  // Floating metal shards
  if(f%4<2){px(ctx,10,24+by,"#a0a8b8");px(ctx,11,23+by,"#c0c8d0");px(ctx,37,26+by,"#a0a8b8");px(ctx,36,25+by,"#c0c8d0");}
  else{px(ctx,11,26+by,"#a0a8b8");px(ctx,10,25+by,"#c0c8d0");px(ctx,36,24+by,"#a0a8b8");px(ctx,37,23+by,"#c0c8d0");}
  // Head
  drawHead(ctx,sk,hr,ey,L,by,f,sp);
  // Helmet (open top showing hair)
  for(let x=16;x<=31;x++)for(let y=6;y<=10;y++){if(x>=20&&x<=27&&y<=8)continue;px(ctx,x,y+by,cl.robe);}
  for(let x=16;x<=31;x++)px(ctx,x,6+by,cl.robeLight);
  px(ctx,16,10+by,cl.robe);px(ctx,17,10+by,cl.robe);px(ctx,30,10+by,cl.robe);px(ctx,31,10+by,cl.robe);
  // Forehead crest
  px(ctx,23,5+by,cl.robeLight);px(ctx,24,5+by,cl.robeLight);
}

// ─── TRICKSTER (Loki) ───
function drawTrickster(ctx,sk,hr,ey,cl,L,by,f,sp,gl){
  for(let x=16;x<=31;x++)px(ctx,x,46,"#0004");
  // Green/gold suit
  heroBody(ctx,cl,by,5,22,42);
  // Gold accents on torso
  for(let x=19;x<=28;x++)px(ctx,x,22+by,cl.accent);
  for(let x=19;x<=28;x++)px(ctx,x,33+by,cl.accent);
  // V pattern on chest
  for(let i=0;i<5;i++){px(ctx,21+i,24+i+by,cl.accent);px(ctx,26-i,24+i+by,cl.accent);}
  // Cape
  for(let y=20+by;y<=42+by;y++){const s=Math.floor((y-20)*.2);px(ctx,14-s,y,cl.robeDark);px(ctx,33+s,y,cl.robeDark);}
  // Legs
  for(let y=36;y<=44;y++){for(let x=19;x<=22;x++)px(ctx,x,y+by,cl.robeDark);for(let x=25;x<=28;x++)px(ctx,x,y+by,cl.robeDark);}
  // Arms
  for(let y=23;y<=35;y++){px(ctx,16,y+by,cl.robeDark);px(ctx,17,y+by,cl.robe);px(ctx,30,y+by,cl.robe);px(ctx,31,y+by,cl.robeLight);}
  // Scepter
  for(let y=6;y<=38;y++)px(ctx,34,y+by,cl.accent);
  px(ctx,33,5+by,"#60d0ff");px(ctx,34,4+by,"#80e0ff");px(ctx,35,5+by,"#60d0ff");px(ctx,34,6+by,"#60d0ff60");
  if(gl){px(ctx,33,3+by,"#60d0ff40");px(ctx,35,3+by,"#60d0ff40");}
  // Head
  drawHead(ctx,sk,hr,ey,L,by,f,sp);
  // Horned crown
  for(let x=17;x<=30;x++)px(ctx,x,6+by,cl.accent);for(let x=18;x<=29;x++)px(ctx,x,5+by,cl.accent);
  // Horns curving up and out
  px(ctx,17,5+by,cl.accent);px(ctx,16,4+by,cl.accent);px(ctx,15,3+by,cl.accent);px(ctx,14,2+by,cl.accent);px(ctx,13,1+by,cl.accent);
  px(ctx,30,5+by,cl.accent);px(ctx,31,4+by,cl.accent);px(ctx,32,3+by,cl.accent);px(ctx,33,2+by,cl.accent);px(ctx,34,1+by,cl.accent);
}

// ─── SYMBIOTE (Venom) ───
function drawSymbiote(ctx,sk,hr,ey,cl,L,by,f,sp,gl){
  for(let x=14;x<=33;x++)px(ctx,x,46,"#0004");
  // Massive black gooey body
  for(let y=18;y<=42;y++){const hw=7+Math.floor(Math.sin(y*.3+f*.2)*.8);for(let x=24-hw;x<=23+hw;x++){let c=cl.robe;if(x<=24-hw+1)c=cl.robeDark;else if(x>=23+hw-1)c=cl.robeLight;px(ctx,x,y+by,c);}}
  // White spider emblem on chest
  px(ctx,23,26+by,"#fff");px(ctx,24,26+by,"#fff");
  px(ctx,22,27+by,"#fff");px(ctx,25,27+by,"#fff");
  px(ctx,21,28+by,"#fff");px(ctx,26,28+by,"#fff");
  px(ctx,20,29+by,"#ddd");px(ctx,27,29+by,"#ddd");
  px(ctx,23,28+by,"#fff");px(ctx,24,28+by,"#fff");
  px(ctx,23,30+by,"#ddd");px(ctx,24,30+by,"#ddd");
  // Legs
  for(let y=40;y<=44;y++){for(let x=17;x<=22;x++)px(ctx,x,y+by,cl.robeDark);for(let x=25;x<=30;x++)px(ctx,x,y+by,cl.robeDark);}
  // Huge arms
  for(let y=20;y<=38;y++){px(ctx,12,y+by,cl.robeDark);px(ctx,13,y+by,cl.robe);px(ctx,34,y+by,cl.robe);px(ctx,35,y+by,cl.robeLight);}
  // Claws
  px(ctx,11,38+by,"#fff");px(ctx,12,39+by,"#fff");px(ctx,36,38+by,"#fff");px(ctx,35,39+by,"#fff");
  // Tendrils
  const tw=f%4;
  px(ctx,10-(tw<2?1:0),30+by,cl.robe);px(ctx,9-(tw<2?2:0),28+by,cl.robe);
  px(ctx,37+(tw>=2?1:0),32+by,cl.robe);px(ctx,38+(tw>=2?2:0),30+by,cl.robe);
  // Head
  for(let x=16;x<=31;x++)for(let y=4;y<=18;y++){let c=cl.robe;if(y<=5)c=cl.robeLight;else if(y>=17)c=cl.robeDark;px(ctx,x,y+by,c);}
  // HUGE white eyes (angular)
  for(let x=18;x<=22;x++)for(let y=9;y<=13;y++){if(y-9<=x-18)px(ctx,x,y+by,"#fff");}
  for(let x=25;x<=29;x++)for(let y=9;y<=13;y++){if(y-9<=29-x)px(ctx,x,y+by,"#fff");}
  // Fanged mouth
  for(let x=19;x<=28;x++)px(ctx,x,16+by,"#c03030");
  px(ctx,20,15+by,"#fff");px(ctx,22,15+by,"#fff");px(ctx,25,15+by,"#fff");px(ctx,27,15+by,"#fff");
  px(ctx,21,17+by,"#fff");px(ctx,24,17+by,"#fff");px(ctx,26,17+by,"#fff");
}

// ═══════════════════════════════════════
// REGISTER BATCH 1
// ═══════════════════════════════════════
registerClassDraw("dreadlord", drawDreadlord);
registerClassDraw("jestermind", drawJestermind);
registerClassDraw("voidlord", drawVoidlord);
registerClassDraw("ironwarden", drawIronwarden);
registerClassDraw("trickster", drawTrickster);
registerClassDraw("symbiote", drawSymbiote);

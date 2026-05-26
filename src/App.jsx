// ============================================================================
// ARQUIVO: App.jsx — Enhanced Premium Version
// Melhorias: Framer Motion · Dark/Light Mode · Lightbox · Premium Hover
//
// DEPENDÊNCIAS NECESSÁRIAS:
//   npm install framer-motion
//
// ANTI-FLASH (coloque no <head> do index.html, antes de qualquer script):
//   <script>
//     const t = localStorage.getItem("lumiere-theme") || "dark";
//     document.documentElement.setAttribute("data-theme", t);
//   </script>
// ============================================================================

import { useState, useEffect, useContext, createContext, useRef, useCallback } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import {
  Sun, Moon, MapPin, Phone, Clock,
  Menu as MenuIcon, X, ChevronDown, ChevronLeft, ChevronRight,
  Star, Wine, Utensils, IceCream, ZoomIn,
} from "lucide-react";
import { FaInstagram, FaFacebook, FaWhatsapp } from "react-icons/fa";

/* ══════════════════════════════════════════════════════
   1.  THEME CONTEXT
══════════════════════════════════════════════════════ */
const ThemeCtx = createContext();

function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(
    () => (typeof window !== "undefined" && localStorage.getItem("lumiere-theme")) || "dark"
  );

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("lumiere-theme", theme);
  }, [theme]);

  const toggle = useCallback(
    () => setTheme((t) => (t === "dark" ? "light" : "dark")),
    []
  );

  return <ThemeCtx.Provider value={{ theme, toggle }}>{children}</ThemeCtx.Provider>;
}

/* ══════════════════════════════════════════════════════
   2.  CONSTANTES & DADOS (idênticos ao original)
══════════════════════════════════════════════════════ */
const WA_NUMBER = "5511999999999";
const WA_MSG    = encodeURIComponent("Olá! Gostaria de fazer uma reserva no Lumière.");
const WA_LINK   = `https://wa.me/${WA_NUMBER}?text=${WA_MSG}`;

const MENU_TABS = [
  { key: "entradas",   label: "Entradas",         Icon: Utensils },
  { key: "principais", label: "Pratos Principais", Icon: Star     },
  { key: "sobremesas", label: "Sobremesas",         Icon: IceCream },
  { key: "bebidas",    label: "Bebidas",            Icon: Wine     },
];

const MENU_DATA = {
  entradas: [
    { id:1,  name:"Carpaccio de Wagyu",    desc:"Finas fatias de wagyu com rúcula selvagem, parmesão reggiano e azeite trufado",     price:"R$ 89",  img:"https://images.unsplash.com/photo-1625944525533-473f1a3d54e7?w=400&h=300&fit=crop&q=80" },
    { id:2,  name:"Ostras Gratinadas",     desc:"Ostras frescas com manteiga de ervas finas, alcaparras e limão siciliano",          price:"R$ 74",  img:"https://images.unsplash.com/photo-1710106405423-1815916eca12?q=80&w=687&auto=format&fit=crop" },
    { id:3,  name:"Foie Gras Selado",      desc:"Foie gras com geleia de figo, brioche artesanal e redução balsâmica envelhecida",   price:"R$ 95",  img:"https://images.unsplash.com/photo-1559339352-11d035aa65de?w=400&h=300&fit=crop&q=80" },
    { id:4,  name:"Burrata Premium",       desc:"Burrata fresca com tomate heirloom, pesto de manjericão e azeite extra virgem",     price:"R$ 68",  img:"https://images.unsplash.com/photo-1606850246029-dd00bd5eff97?q=80&w=2080&auto=format&fit=crop" },
  ],
  principais: [
    { id:5,  name:"Filé ao Molho Madeira",      desc:"Medalhão de filé mignon grelhado com molho madeira e purê de batata baroa",              price:"R$ 148", img:"https://images.unsplash.com/photo-1558030006-450675393462?w=400&h=300&fit=crop&q=80" },
    { id:6,  name:"Risoto de Trufas Negras",    desc:"Arroz arbóreo cremoso com trufa negra fresca, parmesão 24 meses e manteiga clarificada", price:"R$ 132", img:"https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=400&h=300&fit=crop&q=80" },
    { id:7,  name:"Robalo com Crosta de Ervas", desc:"Robalo selvagem com crosta de ervas aromáticas, purê de couve-flor e caviar",           price:"R$ 138", img:"https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=400&h=300&fit=crop&q=80" },
    { id:8,  name:"Pato Confitado",             desc:"Pato confit com molho de laranja e gengibre, lentilhas beluga e chips de raiz",          price:"R$ 125", img:"https://images.unsplash.com/photo-1544025162-d76694265947?w=400&h=300&fit=crop&q=80" },
  ],
  sobremesas: [
    { id:9,  name:"Crème Brûlée",        desc:"Clássico francês com baunilha tahitiana e caramelização feita à mesa pelo chef",         price:"R$ 48",  img:"https://images.unsplash.com/photo-1470124182917-cc6e71b22ecc?w=400&h=300&fit=crop&q=80" },
    { id:10, name:"Fondant de Chocolate", desc:"Bolo quente de chocolate amargo 70% com sorvete de baunilha artesanal",                 price:"R$ 52",  img:"https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400&h=300&fit=crop&q=80" },
    { id:11, name:"Pavlova de Frutas",    desc:"Merengue crocante com chantilly e frutas vermelhas frescas da estação",                 price:"R$ 44",  img:"https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400&h=300&fit=crop&q=80" },
    { id:12, name:"Sorvete Artesanal",    desc:"Três bolas de sorvete artesanal com coulis de fruta e flores comestíveis",               price:"R$ 38",  img:"https://images.unsplash.com/photo-1501443762994-82bd5dace89a?w=400&h=300&fit=crop&q=80" },
  ],
  bebidas: [
    { id:13, name:"Champagne Veuve Clicquot", desc:"Taça de champagne brut, perfeita para celebrar momentos especiais inesquecíveis",   price:"R$ 85",             img:"https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop&q=80" },
    { id:14, name:"Carta de Vinhos",          desc:"Seleção curada de rótulos nacionais e importados. Consulte nosso sommelier",         price:"A partir de R$ 95", img:"https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop&q=80" },
    { id:15, name:"Coquetéis Autorais",       desc:"Criações exclusivas do nosso bartender com ingredientes premium e sazonais",         price:"R$ 42",             img:"https://images.unsplash.com/photo-1551538827-9c037cb4f32a?w=400&h=300&fit=crop&q=80" },
    { id:16, name:"Água Mineral Premium",     desc:"Perrier ou San Pellegrino servida gelada com limão siciliano e gelo artesanal",       price:"R$ 18",             img:"https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=400&h=300&fit=crop&q=80" },
  ],
};

const GALLERY = [
  { id:1, src:"https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=900&q=85", alt:"Salão principal"    },
  { id:2, src:"https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=500&q=80", alt:"Prato gourmet"      },
  { id:3, src:"https://images.unsplash.com/photo-1559339352-11d035aa65de?w=500&q=80",    alt:"Chef preparando"    },
  { id:4, src:"https://images.unsplash.com/photo-1424847651672-bf20a4b0982b?w=500&q=80", alt:"Vinho premium"      },
  { id:5, src:"https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?w=500&q=80",    alt:"Sobremesa especial" },
  { id:6, src:"https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=900&q=85", alt:"Ambiente noturno"   },
];

// Subconjunto exibido na galeria (mesma lógica do original – pula GALLERY[4])
const GALLERY_DISPLAY = [GALLERY[0], GALLERY[1], GALLERY[2], GALLERY[3], GALLERY[5]];

/* ══════════════════════════════════════════════════════
   3.  ANIMATION VARIANTS
══════════════════════════════════════════════════════ */
const EASE = [0.22, 1, 0.36, 1];         // ease premium suave
const VP   = { once: true, margin: "-80px" }; // viewport trigger compartilhado

const vFadeUp = {
  hidden:  { opacity: 0, y: 44 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.85, ease: EASE } },
};
const vFadeIn = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.7 } },
};
const vStagger = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
};
const vCard = {
  hidden:  { opacity: 0, y: 30, scale: 0.97 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.6, ease: EASE } },
};
const vSlideLeft = {
  hidden:  { opacity: 0, x: -56 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.9, ease: EASE } },
};
const vSlideRight = {
  hidden:  { opacity: 0, x: 56 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.9, ease: EASE } },
};

/* ══════════════════════════════════════════════════════
   4.  CSS GLOBAL (dark + light + hover premium + lightbox)
══════════════════════════════════════════════════════ */
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Montserrat:wght@300;400;500;600;700&display=swap');

*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}

/* ── DARK THEME (padrão) ── */
:root,html[data-theme="dark"]{
  --gold:#D6C5A5; --gold-l:#E8DCC2; --gold-d:#B5A17A; --terra:#A3503C;
  --bg:#151413; --bg2:#1A1918; --bg3:#1E1C1B; --bg4:#262422;
  --cream:#F4F0E6; --cream2:#D1CBBB; --cream3:#999386; --cream4:#5C584E;
  --card-glow:0 0 28px rgba(214,197,165,.1);
  --card-hover-shadow:0 24px 55px rgba(0,0,0,.55),0 0 35px rgba(214,197,165,.08);
  --nav-bg:rgba(21,20,19,.93);
  --mobile-bg:rgba(21,20,19,.98);
  --noise-opacity:.032;
}

/* ── LIGHT THEME ── */
html[data-theme="light"]{
  --gold:#B5813F; --gold-l:#C8964E; --gold-d:#9A6C2E; --terra:#9B4B37;
  --bg:#F5F0E8; --bg2:#EDE7DC; --bg3:#E6DFD2; --bg4:#DAD2C4;
  --cream:#1C1813; --cream2:#3A3530; --cream3:#706860; --cream4:#A8A098;
  --card-glow:0 0 28px rgba(181,129,63,.1);
  --card-hover-shadow:0 20px 50px rgba(0,0,0,.11),0 0 32px rgba(181,129,63,.12);
  --nav-bg:rgba(245,240,232,.95);
  --mobile-bg:rgba(245,240,232,.98);
  --noise-opacity:.015;
}

/* ── Transição suave ao trocar tema ── */
body,.nav,.nav.stuck,.menu-card,.footer,.tabs-bar,.tab,.social-link,
.footer-link,.hours-row,.contact-item,.gallery-item,.about-feature{
  transition:background-color .45s ease,color .35s ease,
             border-color .35s ease,box-shadow .35s ease;
}

html{scroll-behavior:smooth}
body{background:var(--bg);color:var(--cream);font-family:'Montserrat',sans-serif;overflow-x:hidden;position:relative}

body::before{
  content:"";position:fixed;inset:0;width:100vw;height:100vh;
  background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
  opacity:var(--noise-opacity);pointer-events:none;z-index:9999;
}

.f-display{font-family:'Playfair Display',serif}
.f-serif{font-family:'Cormorant Garamond',serif}
::-webkit-scrollbar{width:5px}
::-webkit-scrollbar-track{background:var(--bg)}
::-webkit-scrollbar-thumb{background:var(--gold);border-radius:3px}

/* ══ NAVBAR ══ */
.nav{position:fixed;inset:0 0 auto 0;z-index:100;padding:1.25rem 2rem;transition:all .4s ease}
.nav.stuck{
  background:var(--nav-bg);backdrop-filter:blur(22px);
  border-bottom:1px solid rgba(214,197,165,.12);
  box-shadow:0 4px 30px rgba(0,0,0,.22);padding:.9rem 2rem;
}
html[data-theme="light"] .nav.stuck{
  border-bottom-color:rgba(181,129,63,.15);
  box-shadow:0 4px 30px rgba(0,0,0,.07);
}
.nav-inner{max-width:1200px;margin:0 auto;display:flex;align-items:center;justify-content:space-between}
.logo{font-family:'Playfair Display',serif;font-size:1.7rem;font-weight:600;color:var(--gold);text-decoration:none;letter-spacing:.04em;display:inline-block}
.nav-links{display:flex;gap:2.5rem;align-items:center}
.nav-link{
  background:none;border:none;cursor:pointer;
  font-family:'Montserrat',sans-serif;font-size:.68rem;font-weight:500;
  letter-spacing:.2em;text-transform:uppercase;color:var(--cream2);
  text-decoration:none;position:relative;padding-bottom:3px;
  transition:color .3s,text-shadow .3s;
}
.nav-link::after{content:'';position:absolute;bottom:0;left:0;width:0;height:1px;background:var(--gold);transition:width .38s cubic-bezier(0.22,1,0.36,1)}
.nav-link:hover{color:var(--gold);text-shadow:0 0 22px rgba(214,197,165,.28)}
.nav-link:hover::after{width:100%}

/* Theme toggle */
.theme-toggle{
  display:flex;align-items:center;justify-content:center;
  width:38px;height:38px;border-radius:50%;
  background:rgba(214,197,165,.08);border:1px solid rgba(214,197,165,.2);
  cursor:pointer;color:var(--gold);
  transition:background .3s,border-color .3s,box-shadow .3s;
}
.theme-toggle:hover{background:rgba(214,197,165,.16);border-color:var(--gold);box-shadow:0 0 18px rgba(214,197,165,.18)}
html[data-theme="light"] .theme-toggle{background:rgba(181,129,63,.08);border-color:rgba(181,129,63,.22)}

.hamburger{display:none;background:none;border:none;color:var(--cream);cursor:pointer;padding:.25rem;align-items:center;justify-content:center}

/* ══ BUTTONS ══ */
.btn{
  display:inline-flex;align-items:center;justify-content:center;gap:.5rem;
  font-family:'Montserrat',sans-serif;font-weight:600;font-size:.7rem;
  letter-spacing:.22em;text-transform:uppercase;text-decoration:none;
  cursor:pointer;border:none;outline:none;
  transition:all .35s cubic-bezier(0.22,1,0.36,1);
  position:relative;overflow:hidden;
}
.btn-gold{background:linear-gradient(135deg,var(--gold) 0%,var(--gold-d) 100%);color:var(--bg);padding:.9rem 2.5rem}
.btn-gold:hover{background:linear-gradient(135deg,var(--gold-l) 0%,var(--gold) 100%);box-shadow:0 14px 38px rgba(214,197,165,.28),0 4px 14px rgba(0,0,0,.18)}
.btn-outline{background:transparent;color:var(--cream);border:1px solid rgba(245,237,216,.25);padding:.85rem 2rem}
.btn-outline:hover{border-color:var(--gold);color:var(--gold);background:rgba(214,197,165,.04);box-shadow:0 8px 24px rgba(214,197,165,.08)}
.btn-sm{padding:.65rem 1.4rem;font-size:.65rem}

/* ══ DIVIDERS ══ */
.divider{display:flex;align-items:center;gap:1.2rem}
.divider::before,.divider::after{content:'';flex:1;height:1px;background:linear-gradient(90deg,transparent,rgba(214,197,165,.35),transparent)}

/* ══ SECTIONS ══ */
.section{padding:6rem 1.5rem}
.section-inner{max-width:1200px;margin:0 auto}
.section-eyebrow{font-size:.63rem;letter-spacing:.35em;text-transform:uppercase;color:var(--gold);margin-bottom:.8rem;font-family:'Montserrat',sans-serif}
.section-title{font-size:clamp(2rem,4vw,3.2rem);font-weight:400;line-height:1.15;color:var(--cream);margin-bottom:1rem}
.section-title em{color:var(--gold);font-style:italic}

/* ══ HERO ══ */
.hero{height:100vh;min-height:700px;position:relative;display:flex;align-items:center;justify-content:center;overflow:hidden}
.hero-bg{position:absolute;inset:-12%;width:124%;height:124%;object-fit:cover;will-change:transform}
.hero-overlay{position:absolute;inset:0;background:linear-gradient(180deg,rgba(0,0,0,.50) 0%,rgba(15,13,12,.72) 45%,rgba(21,20,19,.97) 100%)}
.hero-content{position:relative;z-index:2;text-align:center;max-width:820px;padding:0 1.5rem;will-change:transform,opacity}
.hero-tag{font-size:.6rem;letter-spacing:.4em;text-transform:uppercase;color:var(--gold);margin-bottom:1.5rem;font-family:'Montserrat',sans-serif;text-shadow:0 1px 12px rgba(0,0,0,.85)}
.hero-title{font-size:clamp(3rem,8vw,6rem);font-weight:400;line-height:1.07;color:var(--cream);margin-bottom:1rem;font-family:'Playfair Display',serif;text-shadow:0 2px 24px rgba(0,0,0,.8),0 1px 6px rgba(0,0,0,.65)}
.hero-title em{color:var(--gold);font-style:italic}
.hero-sub{font-family:'Cormorant Garamond',serif;font-size:clamp(1rem,2.5vw,1.35rem);color:var(--cream);font-weight:400;margin-bottom:2.5rem;letter-spacing:.04em;text-shadow:0 1px 14px rgba(0,0,0,.8)}
.hero-cta{display:flex;gap:1rem;justify-content:center;flex-wrap:wrap;margin-bottom:4rem}
.hero-stats{display:flex;gap:3rem;justify-content:center;flex-wrap:wrap}
.stat-num{font-family:'Playfair Display',serif;font-size:2rem;color:var(--gold);font-weight:600;line-height:1;text-shadow:0 2px 12px rgba(0,0,0,.7)}
.stat-label{font-size:.6rem;letter-spacing:.15em;text-transform:uppercase;color:var(--cream2);margin-top:.3rem;font-family:'Montserrat',sans-serif;text-shadow:0 1px 8px rgba(0,0,0,.7)}
.scroll-cue{position:absolute;bottom:2rem;left:50%;transform:translateX(-50%);animation:float 2.2s ease-in-out infinite;color:var(--gold);opacity:.7}

/* ══ ABOUT ══ */
.about-grid{display:grid;grid-template-columns:1fr 1fr;gap:5rem;align-items:center}
.about-img-wrap{position:relative}
.about-frame{position:absolute;top:-1.4rem;left:-1.4rem;right:1.4rem;bottom:1.4rem;border:1px solid rgba(214,197,165,.2);pointer-events:none;z-index:0}
.about-img{width:100%;height:490px;object-fit:cover;position:relative;z-index:1;display:block;transition:transform .9s cubic-bezier(0.22,1,0.36,1),filter .6s ease;filter:saturate(.82)}
.about-img-wrap:hover .about-img{transform:scale(1.025);filter:saturate(1.05)}
.about-badge{position:absolute;bottom:-1.8rem;right:-1.8rem;z-index:2;width:116px;height:116px;border-radius:50%;background:var(--gold);display:flex;flex-direction:column;align-items:center;justify-content:center;transition:transform .4s cubic-bezier(0.22,1,0.36,1),box-shadow .4s ease;cursor:default}
.about-badge:hover{transform:scale(1.1) rotate(4deg);box-shadow:0 14px 40px rgba(214,197,165,.35)}
.badge-num{font-family:'Playfair Display',serif;font-size:2rem;color:var(--bg);font-weight:700;line-height:1}
.badge-text{font-size:.55rem;letter-spacing:.15em;text-transform:uppercase;color:var(--bg);font-weight:700;margin-top:.2rem}
.about-feature{display:flex;align-items:flex-start;gap:.6rem;margin-bottom:.9rem}
.about-feature-icon{font-size:1.1rem;line-height:1;flex-shrink:0;margin-top:.05rem}
.about-feature-text{font-size:.78rem;color:var(--cream3);line-height:1.55;letter-spacing:.02em}

/* ══ MENU ══ */
.tabs-bar{display:flex;border-bottom:1px solid rgba(214,197,165,.12);margin-bottom:3rem;overflow-x:auto;justify-content:center;gap:0}
.tab{background:none;border:none;border-bottom:2px solid transparent;padding:.8rem 1.6rem;font-family:'Montserrat',sans-serif;font-size:.67rem;font-weight:500;letter-spacing:.14em;text-transform:uppercase;color:var(--cream3);cursor:pointer;transition:all .3s cubic-bezier(0.22,1,0.36,1);white-space:nowrap;display:flex;align-items:center;gap:.5rem}
.tab:hover{color:var(--cream2)}
.tab.active{color:var(--gold);border-bottom-color:var(--gold)}

.menu-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:1.5rem}
.menu-card{
  background:var(--bg3);border:1px solid rgba(214,197,165,.08);overflow:hidden;cursor:default;
  transition:border-color .4s ease,box-shadow .45s ease;
  position:relative;
}
.menu-card::before{
  content:'';position:absolute;inset:0;
  background:linear-gradient(135deg,rgba(214,197,165,.04) 0%,transparent 55%);
  opacity:0;transition:opacity .4s ease;pointer-events:none;z-index:1;
}
.menu-card:hover{border-color:rgba(214,197,165,.32);box-shadow:var(--card-hover-shadow)}
.menu-card:hover::before{opacity:1}
html[data-theme="light"] .menu-card{box-shadow:0 2px 18px rgba(0,0,0,.06);border-color:rgba(181,129,63,.1)}

.menu-img-wrap{height:195px;overflow:hidden}
.menu-img{width:100%;height:100%;object-fit:cover;transition:transform .9s cubic-bezier(0.22,1,0.36,1),filter .6s ease;filter:saturate(.65) contrast(1.05);display:block}
.menu-card:hover .menu-img{transform:scale(1.07);filter:saturate(1.3) contrast(1.02) brightness(1.04)}

.menu-body{padding:1.2rem 1.4rem;position:relative;z-index:2}
.menu-header{display:flex;justify-content:space-between;align-items:flex-start;gap:.5rem;margin-bottom:.45rem}
.menu-name{font-family:'Playfair Display',serif;font-size:1.05rem;font-weight:500;color:var(--cream);flex:1}
.menu-price{
  color:var(--gold);font-weight:600;font-size:.88rem;white-space:nowrap;flex-shrink:0;
  transition:transform .35s cubic-bezier(0.22,1,0.36,1),text-shadow .35s ease;display:inline-block;
}
.menu-card:hover .menu-price{transform:scale(1.09);text-shadow:0 0 20px rgba(214,197,165,.45)}
.menu-desc{font-size:.76rem;color:var(--cream3);line-height:1.65;letter-spacing:.02em}

/* ══ GALLERY ══ */
.gallery-grid{display:grid;grid-template-columns:repeat(3,1fr);grid-template-rows:repeat(2,260px);gap:.75rem}
.gallery-item{overflow:hidden;position:relative;cursor:pointer}
.gallery-item img{width:100%;height:100%;object-fit:cover;transition:transform .9s cubic-bezier(0.22,1,0.36,1),filter .6s ease;filter:grayscale(32%) contrast(1.05);display:block}
.gallery-item:hover img{transform:scale(1.06);filter:grayscale(0%) contrast(1.02) brightness(1.04)}
.gallery-item::after{content:'';position:absolute;inset:0;background:linear-gradient(to top,rgba(21,20,19,.6) 0%,transparent 60%);opacity:0;transition:opacity .4s ease}
.gallery-item:hover::after{opacity:1}

/* Ícone de zoom overlay */
.gallery-zoom-icon{
  position:absolute;top:50%;left:50%;
  transform:translate(-50%,-50%) scale(.65);
  opacity:0;color:white;
  background:rgba(214,197,165,.15);backdrop-filter:blur(8px);
  border:1px solid rgba(214,197,165,.4);border-radius:50%;
  width:54px;height:54px;display:flex;align-items:center;justify-content:center;
  transition:all .45s cubic-bezier(0.22,1,0.36,1);z-index:2;
}
.gallery-item:hover .gallery-zoom-icon{opacity:1;transform:translate(-50%,-50%) scale(1)}

/* Caption overlay */
.gallery-caption{
  position:absolute;bottom:0;left:0;right:0;padding:.9rem 1.1rem .7rem;
  color:rgba(255,255,255,.88);font-size:.68rem;letter-spacing:.14em;
  text-transform:uppercase;font-family:'Montserrat',sans-serif;
  opacity:0;transform:translateY(7px);transition:all .4s ease;z-index:2;
}
.gallery-item:hover .gallery-caption{opacity:1;transform:translateY(0)}
.gi-big{grid-column:1/3;grid-row:1/3}
.gi-wide{grid-column:2/4}

/* ══ LIGHTBOX ══ */
.lb-overlay{
  position:fixed;inset:0;z-index:9000;
  display:flex;align-items:center;justify-content:center;
  background:rgba(8,7,6,.93);backdrop-filter:blur(20px);
  padding:1.5rem;
}
.lb-content{position:relative;width:100%;max-width:940px;display:flex;align-items:center;justify-content:center}
.lb-img{
  max-width:100%;max-height:82vh;object-fit:contain;display:block;
  border:1px solid rgba(214,197,165,.1);
  box-shadow:0 40px 100px rgba(0,0,0,.85);
  cursor:zoom-in;border-radius:1px;
  transition:transform .42s cubic-bezier(0.22,1,0.36,1);
}
.lb-img.zoomed{transform:scale(1.65);cursor:zoom-out}
.lb-close{
  position:absolute;top:-3.8rem;right:0;
  background:rgba(214,197,165,.1);border:1px solid rgba(214,197,165,.25);
  color:var(--gold);border-radius:50%;width:44px;height:44px;
  display:flex;align-items:center;justify-content:center;
  cursor:pointer;transition:all .3s ease;
}
.lb-close:hover{background:rgba(214,197,165,.22);transform:rotate(90deg);box-shadow:0 0 22px rgba(214,197,165,.22)}
.lb-nav{
  position:absolute;top:50%;transform:translateY(-50%);
  background:rgba(214,197,165,.1);border:1px solid rgba(214,197,165,.2);
  color:rgba(255,255,255,.9);border-radius:50%;width:50px;height:50px;
  display:flex;align-items:center;justify-content:center;
  cursor:pointer;transition:all .3s ease;z-index:2;
}
.lb-nav:hover{background:rgba(214,197,165,.22);border-color:var(--gold);box-shadow:0 0 22px rgba(214,197,165,.18)}
.lb-prev{left:-4.8rem}.lb-next{right:-4.8rem}
.lb-counter{position:absolute;bottom:-2.8rem;left:50%;transform:translateX(-50%);font-size:.63rem;letter-spacing:.22em;text-transform:uppercase;color:var(--cream3);font-family:'Montserrat',sans-serif}
.lb-caption{position:absolute;bottom:-4.8rem;left:50%;transform:translateX(-50%);font-family:'Cormorant Garamond',serif;font-size:1rem;color:var(--cream2);white-space:nowrap;font-style:italic}

/* ══ CONTACT ══ */
.contact-grid{display:grid;grid-template-columns:1fr 1.55fr;gap:4rem;align-items:start}
.contact-item{display:flex;gap:1rem;align-items:flex-start;margin-bottom:1.8rem}
.contact-icon{flex-shrink:0;margin-top:.1rem;color:var(--gold)}
.contact-label{font-size:.65rem;letter-spacing:.18em;text-transform:uppercase;color:var(--gold);margin-bottom:.3rem;font-family:'Montserrat',sans-serif}
.contact-val{color:var(--cream2);font-size:.9rem;line-height:1.7}
.hours-row{display:flex;justify-content:space-between;gap:1.5rem;margin-bottom:.35rem}
.hours-day{font-size:.8rem;color:var(--cream3)}.hours-time{font-size:.8rem;color:var(--cream2)}
.map-wrap{height:430px;border:1px solid rgba(214,197,165,.14);overflow:hidden}
.map-wrap iframe{width:100%;height:100%;border:0;filter:grayscale(55%) invert(88%) hue-rotate(175deg)}
html[data-theme="light"] .map-wrap iframe{filter:grayscale(18%)}

/* ══ FOOTER ══ */
.footer{background:var(--bg2);border-top:1px solid rgba(214,197,165,.1);padding:3.5rem 1.5rem 2rem}
.footer-grid{max-width:1200px;margin:0 auto}
.footer-cols{display:grid;grid-template-columns:2fr 1fr 1fr;gap:3rem;margin-bottom:3rem}
.footer-brand{font-family:'Playfair Display',serif;font-size:2.4rem;color:var(--gold);font-weight:600;display:block;margin-bottom:1rem}
.footer-tagline{font-family:'Cormorant Garamond',serif;color:var(--cream3);font-size:1.05rem;line-height:1.75;font-weight:300;max-width:280px}
.social-links{display:flex;gap:.75rem;margin-top:1.5rem}
.social-link{width:40px;height:40px;border-radius:50%;border:1px solid rgba(214,197,165,.18);display:flex;align-items:center;justify-content:center;color:var(--cream3);text-decoration:none;transition:all .35s cubic-bezier(0.22,1,0.36,1)}
.social-link:hover{border-color:var(--gold);color:var(--gold);transform:translateY(-3px);box-shadow:0 8px 22px rgba(214,197,165,.14);background:rgba(214,197,165,.06)}
.footer-col-title{font-size:.62rem;letter-spacing:.22em;text-transform:uppercase;color:var(--gold);margin-bottom:1.25rem;font-family:'Montserrat',sans-serif}
.footer-link{display:block;color:var(--cream3);font-size:.85rem;text-decoration:none;margin-bottom:.55rem;transition:color .3s,transform .35s cubic-bezier(0.22,1,0.36,1)}
.footer-link:hover{color:var(--gold);transform:translateX(5px)}
.footer-bottom{max-width:1200px;margin:0 auto;border-top:1px solid rgba(214,197,165,.08);padding-top:1.5rem;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:1rem}
.footer-copy{font-size:.7rem;color:var(--cream3);letter-spacing:.05em}
.footer-legal{display:flex;gap:1.5rem}
.footer-legal a{font-size:.68rem;color:var(--cream3);text-decoration:none;transition:color .3s}
.footer-legal a:hover{color:var(--gold)}

/* ══ WHATSAPP BTN ══ */
.wa-btn{position:fixed;bottom:1.75rem;right:1.75rem;z-index:99;width:58px;height:58px;border-radius:50%;background:#25D366;display:flex;align-items:center;justify-content:center;box-shadow:0 4px 22px rgba(37,211,102,.35);text-decoration:none;will-change:transform}

/* ══ ANIMAÇÕES CSS ══ */
@keyframes fadeIn{from{opacity:0}to{opacity:1}}
@keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-7px)}}

/* ══ MOBILE OVERLAY ══ */
.mobile-overlay{position:fixed;inset:0;background:var(--mobile-bg);backdrop-filter:blur(14px);z-index:200;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:2.5rem}
.mobile-nav-link{background:none;border:none;cursor:pointer;font-family:'Playfair Display',serif;font-size:2rem;color:var(--cream);font-style:italic;transition:color .3s}
.mobile-nav-link:hover{color:var(--gold)}

/* ══ RESPONSIVE ══ */
@media(max-width:1024px){
  .about-grid{grid-template-columns:1fr;gap:3rem}
  .about-img-wrap{display:none}
  .contact-grid{grid-template-columns:1fr;gap:2.5rem}
  .footer-cols{grid-template-columns:1fr 1fr;gap:2rem}
  .lb-prev{left:.5rem}.lb-next{right:.5rem}
}
@media(max-width:768px){
  .section{padding:4rem 1.25rem}
  .nav-links{display:none}
  .hamburger{display:flex!important}
  .gallery-grid{grid-template-columns:1fr 1fr;grid-template-rows:auto}
  .gi-big{grid-column:1/3;grid-row:1;height:280px}
  .gi-wide{grid-column:1/3;height:200px}
  .hero-stats{gap:2rem}
  .footer-cols{grid-template-columns:1fr}
  .footer-bottom{flex-direction:column;align-items:flex-start}
  .lb-nav{width:42px;height:42px}
  .lb-prev{left:.25rem}.lb-next{right:.25rem}
}
@media(max-width:480px){
  .gallery-grid{grid-template-columns:1fr}
  .gi-big,.gi-wide{grid-column:1}
  .tabs-bar{justify-content:flex-start}
}
`;

/* ══════════════════════════════════════════════════════
   5.  THEME TOGGLE BUTTON
══════════════════════════════════════════════════════ */
function ThemeToggle() {
  const { theme, toggle } = useContext(ThemeCtx);
  return (
    <motion.button
      className="theme-toggle"
      onClick={toggle}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.88 }}
      transition={{ type: "spring", stiffness: 420, damping: 22 }}
      aria-label={theme === "dark" ? "Ativar tema claro" : "Ativar tema escuro"}
    >
      <AnimatePresence mode="wait">
        {theme === "dark" ? (
          <motion.span
            key="sun"
            initial={{ rotate: -90, opacity: 0, scale: 0.4 }}
            animate={{ rotate: 0, opacity: 1, scale: 1 }}
            exit={{ rotate: 90, opacity: 0, scale: 0.4 }}
            transition={{ duration: 0.22 }}
            style={{ display: "flex" }}
          >
            <Sun size={15} />
          </motion.span>
        ) : (
          <motion.span
            key="moon"
            initial={{ rotate: 90, opacity: 0, scale: 0.4 }}
            animate={{ rotate: 0, opacity: 1, scale: 1 }}
            exit={{ rotate: -90, opacity: 0, scale: 0.4 }}
            transition={{ duration: 0.22 }}
            style={{ display: "flex" }}
          >
            <Moon size={15} />
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  );
}

/* ══════════════════════════════════════════════════════
   6.  LIGHTBOX COMPONENT
══════════════════════════════════════════════════════ */
function Lightbox({ images, initialIndex, onClose }) {
  const [index, setIndex] = useState(initialIndex);
  const [zoomed, setZoomed] = useState(false);

  // Fecha zoom ao trocar imagem
  const prev = useCallback(() => {
    setZoomed(false);
    setIndex((i) => (i - 1 + images.length) % images.length);
  }, [images.length]);

  const next = useCallback(() => {
    setZoomed(false);
    setIndex((i) => (i + 1) % images.length);
  }, [images.length]);

  // Navegação por teclado
  useEffect(() => {
    const handler = (e) => {
      if (e.key === "Escape")      onClose();
      if (e.key === "ArrowLeft")   prev();
      if (e.key === "ArrowRight")  next();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [prev, next, onClose]);

  // Trava scroll do body enquanto lightbox está aberto
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, []);

  return (
    <motion.div
      className="lb-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.28 }}
      onClick={onClose}
    >
      <motion.div
        className="lb-content"
        initial={{ scale: 0.86, opacity: 0, y: 24 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.86, opacity: 0, y: 24 }}
        transition={{ type: "spring", damping: 28, stiffness: 320 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Fechar */}
        <motion.button
          className="lb-close"
          onClick={onClose}
          whileHover={{ rotate: 90, scale: 1.1 }}
          transition={{ type: "spring", stiffness: 400, damping: 22 }}
        >
          <X size={20} />
        </motion.button>

        {/* Navegar — anterior */}
        <motion.button className="lb-nav lb-prev" onClick={prev}
          whileHover={{ scale: 1.12, x: -2 }} whileTap={{ scale: 0.92 }}
          transition={{ type: "spring", stiffness: 400, damping: 22 }}>
          <ChevronLeft size={22} />
        </motion.button>

        {/* Imagem com transição ao trocar */}
        <AnimatePresence mode="wait">
          <motion.img
            key={index}
            src={images[index].src}
            alt={images[index].alt}
            className={`lb-img${zoomed ? " zoomed" : ""}`}
            initial={{ opacity: 0, scale: 0.96, x: 28 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.96, x: -28 }}
            transition={{ duration: 0.38, ease: EASE }}
            onClick={() => setZoomed((z) => !z)}
          />
        </AnimatePresence>

        {/* Navegar — próxima */}
        <motion.button className="lb-nav lb-next" onClick={next}
          whileHover={{ scale: 1.12, x: 2 }} whileTap={{ scale: 0.92 }}
          transition={{ type: "spring", stiffness: 400, damping: 22 }}>
          <ChevronRight size={22} />
        </motion.button>

        <div className="lb-counter">{index + 1} / {images.length}</div>
        <div className="lb-caption">{images[index].alt}</div>
      </motion.div>
    </motion.div>
  );
}

/* ══════════════════════════════════════════════════════
   7.  NAVBAR
══════════════════════════════════════════════════════ */
function Navbar() {
  const [stuck, setStuck] = useState(false);
  const [open, setOpen]   = useState(false);

  useEffect(() => {
    const fn = () => setStuck(window.scrollY > 60);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const scrollTo = (id) => {
    setOpen(false);
    document.querySelector(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const links = [
    { id: "#sobre",    label: "Sobre"    },
    { id: "#cardapio", label: "Cardápio" },
    { id: "#galeria",  label: "Galeria"  },
    { id: "#contato",  label: "Contato"  },
  ];

  return (
    <>
      <nav className={`nav${stuck ? " stuck" : ""}`}>
        <div className="nav-inner">
          <motion.a
            href="#" className="logo"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
          >
            Lumière
          </motion.a>

          <div className="nav-links">
            {links.map((l) => (
              <motion.button
                key={l.id}
                className="nav-link"
                onClick={() => scrollTo(l.id)}
                whileHover={{ y: -1 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
              >
                {l.label}
              </motion.button>
            ))}
            <ThemeToggle />
            <motion.a
              href={WA_LINK} target="_blank" rel="noreferrer"
              className="btn btn-gold btn-sm"
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.96 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
            >
              Reservar Mesa
            </motion.a>
          </div>

          <button className="hamburger" onClick={() => setOpen(true)}>
            <MenuIcon size={25} />
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            className="mobile-overlay"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
          >
            <motion.button
              onClick={() => setOpen(false)}
              style={{ position: "absolute", top: "1.5rem", right: "1.5rem", background: "none", border: "none", color: "var(--cream2)", cursor: "pointer" }}
              whileHover={{ rotate: 90, scale: 1.1 }}
              transition={{ type: "spring", stiffness: 400, damping: 22 }}
            >
              <X size={26} />
            </motion.button>

            <motion.span className="logo" style={{ fontSize: "2.2rem" }}
              initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08, ease: EASE }}>
              Lumière
            </motion.span>

            {links.map((l, i) => (
              <motion.button
                key={l.id}
                className="mobile-nav-link"
                onClick={() => scrollTo(l.id)}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.07, ease: EASE }}
                whileHover={{ x: 7, color: "var(--gold)" }}
              >
                {l.label}
              </motion.button>
            ))}

            <motion.div
              style={{ display: "flex", gap: "1rem", alignItems: "center", marginTop: "1rem" }}
              initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.38, ease: EASE }}
            >
              <ThemeToggle />
              <a href={WA_LINK} target="_blank" rel="noreferrer" className="btn btn-gold">
                Reservar Mesa
              </a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

/* ══════════════════════════════════════════════════════
   8.  HERO  — parallax + entrada staggered
══════════════════════════════════════════════════════ */
function Hero() {
  const [rdy, setRdy] = useState(false);
  const ref = useRef(null);

  // Parallax: bg sobe enquanto o usuário scrolla para fora do hero
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const bgY          = useTransform(scrollYProgress, [0, 1], ["0%", "28%"]);
  const contentOpac  = useTransform(scrollYProgress, [0, 0.65], [1, 0]);
  const contentY     = useTransform(scrollYProgress, [0, 1], ["0%", "-10%"]);

  return (
    <section ref={ref} className="hero">
      <motion.img
        src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1920&q=85"
        alt="Lumière — Alta Gastronomia"
        className="hero-bg"
        onLoad={() => setRdy(true)}
        style={{ y: bgY, opacity: rdy ? 1 : 0, transition: "opacity .6s ease" }}
      />
      <div className="hero-overlay" />

      <motion.div className="hero-content" style={{ opacity: contentOpac, y: contentY }}>
        {/* Entrada staggered com delays escalonados */}
        <motion.p className="hero-tag"
          initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.2, ease: EASE }}>
          ✦ &nbsp; Alta Gastronomia &nbsp; ✦
        </motion.p>

        <motion.h1 className="hero-title"
          initial={{ opacity: 0, y: 32 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.0, delay: 0.4, ease: EASE }}>
          Uma Experiência<br /><em>Além do Sabor</em>
        </motion.h1>

        <motion.p className="hero-sub"
          initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.6, ease: EASE }}>
          Onde a arte culinária encontra a elegância em cada detalhe.
        </motion.p>

        <motion.div className="hero-cta"
          initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.78, ease: EASE }}>
          <motion.a href={WA_LINK} target="_blank" rel="noreferrer" className="btn btn-gold"
            whileHover={{ scale: 1.04, y: -3 }} whileTap={{ scale: 0.96 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}>
            Reservar Mesa
          </motion.a>
          <motion.button className="btn btn-outline"
            onClick={() => document.querySelector("#cardapio")?.scrollIntoView({ behavior: "smooth" })}
            whileHover={{ scale: 1.04, y: -3 }} whileTap={{ scale: 0.96 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}>
            Ver Cardápio
          </motion.button>
        </motion.div>

        <motion.div className="hero-stats"
          initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.96, ease: EASE }}>
          {[["15+","Anos de Tradição"],["2","Estrelas Michelin"],["4.9★","Avaliação"]].map(([n,l]) => (
            <motion.div key={l} style={{ textAlign: "center" }}
              whileHover={{ y: -5 }}
              transition={{ type: "spring", stiffness: 380, damping: 22 }}>
              <div className="stat-num">{n}</div>
              <div className="stat-label">{l}</div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      <div className="scroll-cue"><ChevronDown size={26} /></div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════
   9.  ABOUT
══════════════════════════════════════════════════════ */
function About() {
  return (
    <section id="sobre" className="section" style={{ background: "var(--bg2)" }}>
      <div className="section-inner">
        <div className="about-grid">

          {/* Imagem — slide da esquerda */}
          <motion.div className="about-img-wrap"
            variants={vSlideLeft} initial="hidden" whileInView="visible" viewport={VP}>
            <div className="about-frame" />
            <img src="https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?w=700&q=80"
              alt="Sobre o Lumière" className="about-img" />
            <div className="about-badge">
              <span className="badge-num">15</span>
              <span className="badge-text">Anos</span>
            </div>
          </motion.div>

          {/* Texto — stagger */}
          <motion.div variants={vStagger} initial="hidden" whileInView="visible" viewport={VP}>
            <motion.p className="section-eyebrow" variants={vFadeUp}>Nossa História</motion.p>
            <motion.h2 className="section-title f-display" variants={vFadeUp}>
              Paixão pela<br /><em>Alta Gastronomia</em>
            </motion.h2>
            <motion.div className="divider" style={{ marginBottom: "1.5rem" }} variants={vFadeUp}>
              <span style={{ color: "var(--gold)", fontSize: "1.1rem" }}>✦</span>
            </motion.div>
            <motion.p className="f-serif"
              style={{ fontSize: "1.1rem", lineHeight: 1.82, color: "var(--cream2)", fontWeight: 300, marginBottom: "1.2rem" }}
              variants={vFadeUp}>
              Fundado em 2009 pelo Chef François Dubois e pela sommelier Ana Clara Vidal, o Lumière nasceu
              de um sonho compartilhado: trazer a sofisticação da alta cozinha europeia ao coração de São Paulo.
            </motion.p>
            <motion.p className="f-serif"
              style={{ fontSize: "1.1rem", lineHeight: 1.82, color: "var(--cream2)", fontWeight: 300, marginBottom: "2rem" }}
              variants={vFadeUp}>
              Com ingredientes selecionados dos melhores produtores do Brasil e do mundo, nossa cozinha é um
              convite à descoberta — onde técnica impecável e criatividade sem limites se encontram em cada prato.
            </motion.p>
            {[
              ["🌿", "Ingredientes de origem controlada e certificada"],
              ["🍷", "Menu degustação harmonizado com o sommelier"],
              ["🕯️", "Salão privativo para eventos exclusivos"],
            ].map(([icon, text]) => (
              <motion.div key={text} className="about-feature" variants={vFadeUp}>
                <span className="about-feature-icon">{icon}</span>
                <span className="about-feature-text">{text}</span>
              </motion.div>
            ))}
            <motion.div style={{ marginTop: "2.2rem" }} variants={vFadeUp}>
              <motion.a href={WA_LINK} target="_blank" rel="noreferrer" className="btn btn-gold"
                whileHover={{ scale: 1.04, y: -3 }} whileTap={{ scale: 0.96 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}>
                Fazer Reserva
              </motion.a>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════
   10.  MENU SECTION  — stagger por aba + tab crossfade
══════════════════════════════════════════════════════ */
function MenuSection() {
  const [tab, setTab] = useState("entradas");
  const items = MENU_DATA[tab];

  return (
    <section id="cardapio" className="section" style={{ background: "var(--bg)" }}>
      <div className="section-inner">

        {/* Título */}
        <motion.div style={{ textAlign: "center", marginBottom: "3.5rem" }}
          variants={vStagger} initial="hidden" whileInView="visible" viewport={VP}>
          <motion.p className="section-eyebrow" variants={vFadeUp}>Nossa Culinária</motion.p>
          <motion.h2 className="section-title f-display" style={{ textAlign: "center" }} variants={vFadeUp}>
            O <em>Cardápio</em>
          </motion.h2>
          <motion.div className="divider" style={{ maxWidth: 300, margin: "0 auto" }} variants={vFadeUp}>
            <span style={{ color: "var(--gold)" }}>✦</span>
          </motion.div>
        </motion.div>

        {/* Abas */}
        <motion.div className="tabs-bar"
          variants={vFadeIn} initial="hidden" whileInView="visible" viewport={VP}>
          {MENU_TABS.map(({ key, label, Icon }) => (
            <motion.button key={key}
              className={`tab${tab === key ? " active" : ""}`}
              onClick={() => setTab(key)}
              whileHover={{ y: -2 }} whileTap={{ y: 0 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}>
              <Icon size={14} />{label}
            </motion.button>
          ))}
        </motion.div>

        {/* Cards com crossfade ao trocar aba */}
        <AnimatePresence mode="wait">
          <motion.div key={tab} className="menu-grid"
            variants={vStagger} initial="hidden" animate="visible" exit={{ opacity: 0, transition: { duration: 0.18 } }}>
            {items.map((item) => (
              <motion.div key={item.id} className="menu-card" variants={vCard}
                whileHover={{ y: -7 }}
                transition={{ type: "spring", stiffness: 300, damping: 24 }}>
                <div className="menu-img-wrap">
                  <img src={item.img} alt={item.name} className="menu-img" loading="lazy" />
                </div>
                <div className="menu-body">
                  <div className="menu-header">
                    <span className="menu-name f-display">{item.name}</span>
                    <span className="menu-price">{item.price}</span>
                  </div>
                  <p className="menu-desc">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        <motion.div style={{ textAlign: "center", marginTop: "3rem" }}
          variants={vFadeUp} initial="hidden" whileInView="visible" viewport={VP}>
          <motion.a href={WA_LINK} target="_blank" rel="noreferrer" className="btn btn-gold"
            whileHover={{ scale: 1.04, y: -3 }} whileTap={{ scale: 0.96 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}>
            Cardápio Completo & Reserva
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════
   11.  GALLERY  — com lightbox
══════════════════════════════════════════════════════ */
function Gallery() {
  const [lbIndex, setLbIndex] = useState(null); // null = fechado

  const grid = [
    { g: GALLERY[0], cls: "gallery-item gi-big",  i: 0 },
    { g: GALLERY[1], cls: "gallery-item",          i: 1 },
    { g: GALLERY[2], cls: "gallery-item",          i: 2 },
    { g: GALLERY[3], cls: "gallery-item",          i: 3 },
    { g: GALLERY[5], cls: "gallery-item gi-wide",  i: 4 },
  ];

  return (
    <section id="galeria" className="section" style={{ background: "var(--bg2)" }}>
      <div className="section-inner">

        <motion.div style={{ textAlign: "center", marginBottom: "3rem" }}
          variants={vStagger} initial="hidden" whileInView="visible" viewport={VP}>
          <motion.p className="section-eyebrow" variants={vFadeUp}>Nossos Momentos</motion.p>
          <motion.h2 className="section-title f-display" style={{ textAlign: "center" }} variants={vFadeUp}>
            A <em>Galeria</em>
          </motion.h2>
          <motion.div className="divider" style={{ maxWidth: 280, margin: "0 auto" }} variants={vFadeUp}>
            <span style={{ color: "var(--gold)" }}>✦</span>
          </motion.div>
        </motion.div>

        <motion.div className="gallery-grid"
          variants={vStagger} initial="hidden" whileInView="visible" viewport={VP}>
          {grid.map(({ g, cls, i }) => (
            <motion.div key={g.id} className={cls} variants={vFadeIn}
              onClick={() => setLbIndex(i)}>
              <img src={g.src} alt={g.alt} loading="lazy" />
              <div className="gallery-zoom-icon"><ZoomIn size={20} /></div>
              <div className="gallery-caption">{g.alt}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lbIndex !== null && (
          <Lightbox
            images={GALLERY_DISPLAY}
            initialIndex={lbIndex}
            onClose={() => setLbIndex(null)}
          />
        )}
      </AnimatePresence>
    </section>
  );
}

/* ══════════════════════════════════════════════════════
   12.  CONTACT
══════════════════════════════════════════════════════ */
function Contact() {
  return (
    <section id="contato" className="section" style={{ background: "var(--bg)" }}>
      <div className="section-inner">

        <motion.div style={{ textAlign: "center", marginBottom: "3.5rem" }}
          variants={vStagger} initial="hidden" whileInView="visible" viewport={VP}>
          <motion.p className="section-eyebrow" variants={vFadeUp}>Venha nos Visitar</motion.p>
          <motion.h2 className="section-title f-display" style={{ textAlign: "center" }} variants={vFadeUp}>
            <em>Localização</em> & Contato
          </motion.h2>
          <motion.div className="divider" style={{ maxWidth: 300, margin: "0 auto" }} variants={vFadeUp}>
            <span style={{ color: "var(--gold)" }}>✦</span>
          </motion.div>
        </motion.div>

        <div className="contact-grid">
          <motion.div variants={vSlideLeft} initial="hidden" whileInView="visible" viewport={VP}>
            <div className="contact-item">
              <MapPin size={20} className="contact-icon" />
              <div>
                <p className="contact-label">Endereço</p>
                <p className="contact-val">Rua Oscar Freire, 987 — Jardins<br />São Paulo — SP, 01426-001</p>
              </div>
            </div>
            <div className="contact-item">
              <Phone size={20} className="contact-icon" />
              <div>
                <p className="contact-label">Reservas</p>
                <p className="contact-val">(11) 9 9999-9999</p>
                <a href={WA_LINK} target="_blank" rel="noreferrer"
                  style={{ color: "var(--gold)", fontSize: ".8rem", textDecoration: "none" }}>
                  WhatsApp disponível →
                </a>
              </div>
            </div>
            <div className="contact-item">
              <Clock size={20} className="contact-icon" />
              <div style={{ flex: 1 }}>
                <p className="contact-label">Horários de Funcionamento</p>
                {[
                  ["Terça a Sexta", "12h–15h / 19h–23h"],
                  ["Sábado",        "12h–23h30"],
                  ["Domingo",       "12h–17h"],
                  ["Segunda-feira", "Fechado"],
                ].map(([day, time]) => (
                  <div key={day} className="hours-row">
                    <span className="hours-day">{day}</span>
                    <span className="hours-time"
                      style={day === "Segunda-feira" ? { color: "var(--cream4)" } : {}}>
                      {time}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ display: "flex", gap: ".75rem", flexWrap: "wrap", marginTop: ".5rem" }}>
              <motion.a href={WA_LINK} target="_blank" rel="noreferrer" className="btn btn-gold btn-sm"
                whileHover={{ scale: 1.04, y: -2 }} whileTap={{ scale: 0.96 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}>
                💬 WhatsApp
              </motion.a>
              <motion.a href="tel:+5511999999999" className="btn btn-outline btn-sm"
                whileHover={{ scale: 1.04, y: -2 }} whileTap={{ scale: 0.96 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}>
                📞 Ligar
              </motion.a>
            </div>
          </motion.div>

          <motion.div className="map-wrap"
            variants={vSlideRight} initial="hidden" whileInView="visible" viewport={VP}>
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3657.0!2d-46.6702!3d-23.5645!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94ce5a2b2ed7f3a1%3A0x4b6c1c5a3fcca7c5!2sR.+Oscar+Freire%2C+S%C3%A3o+Paulo!5e0!3m2!1spt-BR!2sbr!4v1700000000000!5m2!1spt-BR!2sbr"
              allowFullScreen loading="lazy" title="Localização do Lumière"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════
   13.  FOOTER
══════════════════════════════════════════════════════ */
function Footer() {
  const year = new Date().getFullYear();
  return (
    <motion.footer className="footer"
      variants={vFadeUp} initial="hidden" whileInView="visible" viewport={VP}>
      <div className="footer-grid">
        <div className="footer-cols">
          <div>
            <span className="footer-brand">Lumière</span>
            <p className="footer-tagline">
              Redefinindo os limites da alta gastronomia com ingredientes locais e técnica impecável.
            </p>
            <div className="social-links">
              <a href="#" className="social-link"><FaInstagram size={18} /></a>
              <a href="#" className="social-link"><FaFacebook size={18} /></a>
            </div>
          </div>
          <div>
            <h4 className="footer-col-title">Explore</h4>
            <a href="#sobre"    className="footer-link">Nossa História</a>
            <a href="#cardapio" className="footer-link">Menu Degustação</a>
            <a href="#galeria"  className="footer-link">Ambiente</a>
          </div>
          <div>
            <h4 className="footer-col-title">Visite</h4>
            <a href="#contato" className="footer-link">Reservas</a>
            <a href="#contato" className="footer-link">Localização</a>
            <a href="#contato" className="footer-link">Eventos Privativos</a>
          </div>
        </div>
        <div className="footer-bottom">
          <p className="footer-copy">© {year} Lumière Restaurante. Todos os direitos reservados.</p>
          <div className="footer-legal">
            <a href="#">Termos de Uso</a>
            <a href="#">Privacidade</a>
          </div>
        </div>
      </div>
    </motion.footer>
  );
}

/* ══════════════════════════════════════════════════════
   14.  APP ROOT
══════════════════════════════════════════════════════ */
export default function App() {
  return (
    <ThemeProvider>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <Navbar />
      <Hero />
      <About />
      <MenuSection />
      <Gallery />
      <Contact />
      <Footer />

      {/* WhatsApp flutuante com animação Framer Motion */}
      <motion.a
        href={WA_LINK} target="_blank" rel="noreferrer"
        className="wa-btn" aria-label="WhatsApp"
        animate={{ y: [0, -7, 0] }}
        transition={{ duration: 3.5, ease: "easeInOut", repeat: Infinity }}
        whileHover={{ scale: 1.13, y: -4 }}
        whileTap={{ scale: 0.92 }}
      >
        <FaWhatsapp size={30} color="#fff" />
      </motion.a>
    </ThemeProvider>
  );
}
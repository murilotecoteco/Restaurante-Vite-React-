// ============================================================================
// ARQUIVO: App.jsx
// ============================================================================
// Este é o componente principal da aplicação. Contém toda a estrutura do site:
// - Navbar (menu fixo e mobile)
// - Hero (seção inicial com imagem, animações)
// - About (sobre o restaurante)
// - MenuSection (cardápio com abas)
// - Gallery (galeria de imagens)
// - Contact (contato, mapa, horários)
// - Footer (rodapé)
// - Botão flutuante do WhatsApp
// O CSS é injetado dinamicamente via string (const CSS) dentro de <style>.
// ============================================================================

// Importa hooks do React para gerenciar estado e efeitos colaterais
import { useState, useEffect } from "react";

// Importa ícones da biblioteca lucide-react (conjunto de ícones modernos em formato de componentes)
import {
  MapPin,      // Ícone de localização
  Phone,       // Ícone de telefone
  Clock,       // Ícone de relógio
  Menu as MenuIcon,  // Ícone de menu hambúrguer (renomeado para MenuIcon para evitar conflito)
  X,           // Ícone de fechar (X)
  ChevronDown, // Ícone de seta para baixo (usado no scroll cue)
  Star,        // Estrela
  Wine,        // Taça de vinho
  Utensils,    // Talheres
  IceCream,    // Sorvete
  Coffee,      // Xícara de café
  MessageCircle // Balão de mensagem
} from "lucide-react";

// Importa ícones específicos da biblioteca react-icons/fa (Font Awesome para React)
import { FaInstagram, FaFacebook, FaWhatsapp } from "react-icons/fa";

/* ─────────────────────────── CONFIGURAÇÕES GLOBAIS ─────────────────────────── */
// Número de WhatsApp do restaurante (substitua pelo número real)
const WA_NUMBER = "5511999999999";
// Mensagem padrão enviada ao clicar no link do WhatsApp, codificada para URL (encodeURIComponent)
const WA_MSG = encodeURIComponent("Olá! Gostaria de fazer uma reserva no Lumière.");
// Link completo do WhatsApp (formato: https://wa.me/<numero>?text=<mensagem>)
const WA_LINK = `https://wa.me/${WA_NUMBER}?text=${WA_MSG}`;

/* ─────────────────────────── DADOS DO SITE (CONTEÚDO ESTÁTICO) ─────────────────────────── */
// Array de abas do cardápio, cada objeto contém:
// - key: identificador único usado para acessar o menu correspondente em MENU_DATA
// - label: texto exibido na aba
// - Icon: componente de ícone importado do lucide-react
const MENU_TABS = [
  { key: "entradas",   label: "Entradas",          Icon: Utensils },
  { key: "principais", label: "Pratos Principais",  Icon: Star },
  { key: "sobremesas", label: "Sobremesas",          Icon: IceCream },
  { key: "bebidas",    label: "Bebidas",             Icon: Wine },
];

// Objeto que armazena os itens de cada seção do cardápio.
// Cada categoria contém um array de pratos com: id, nome (name), descrição (desc), preço (price) e URL da imagem (img).
const MENU_DATA = {
  entradas: [
    { id:1,  name:"Carpaccio de Wagyu",    desc:"Finas fatias de wagyu com rúcula selvagem, parmesão reggiano e azeite trufado",     price:"R$ 89",  img:"https://images.unsplash.com/photo-1625944525533-473f1a3d54e7?w=400&h=300&fit=crop&q=80" },
    { id:2,  name:"Ostras Gratinadas",     desc:"Ostras frescas com manteiga de ervas finas, alcaparras e limão siciliano",          price:"R$ 74",  img:"https://images.unsplash.com/photo-1710106405423-1815916eca12?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
    { id:3,  name:"Foie Gras Selado",      desc:"Foie gras com geleia de figo, brioche artesanal e redução balsâmica envelhecida",   price:"R$ 95",  img:"https://images.unsplash.com/photo-1559339352-11d035aa65de?w=400&h=300&fit=crop&q=80" },
    { id:4,  name:"Burrata Premium",       desc:"Burrata fresca com tomate heirloom, pesto de manjericão e azeite extra virgem",     price:"R$ 68",  img:"https://images.unsplash.com/photo-1606850246029-dd00bd5eff97?q=80&w=2080&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
  ],
  principais: [
    { id:5,  name:"Filé ao Molho Madeira",     desc:"Medalhão de filé mignon grelhado com molho madeira e purê de batata baroa",              price:"R$ 148", img:"https://images.unsplash.com/photo-1558030006-450675393462?w=400&h=300&fit=crop&q=80" },
    { id:6,  name:"Risoto de Trufas Negras",   desc:"Arroz arbóreo cremoso com trufa negra fresca, parmesão 24 meses e manteiga clarificada", price:"R$ 132", img:"https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=400&h=300&fit=crop&q=80" },
    { id:7,  name:"Robalo com Crosta de Ervas",desc:"Robalo selvagem com crosta de ervas aromáticas, purê de couve-flor e caviar",           price:"R$ 138", img:"https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=400&h=300&fit=crop&q=80" },
    { id:8,  name:"Pato Confitado",            desc:"Pato confit com molho de laranja e gengibre, lentilhas beluga e chips de raiz",           price:"R$ 125", img:"https://images.unsplash.com/photo-1544025162-d76694265947?w=400&h=300&fit=crop&q=80" },
  ],
  sobremesas: [
    { id:9,  name:"Crème Brûlée",         desc:"Clássico francês com baunilha tahitiana e caramelização feita à mesa pelo chef",         price:"R$ 48",  img:"https://images.unsplash.com/photo-1470124182917-cc6e71b22ecc?w=400&h=300&fit=crop&q=80" },
    { id:10, name:"Fondant de Chocolate",  desc:"Bolo quente de chocolate amargo 70% com sorvete de baunilha artesanal",                 price:"R$ 52",  img:"https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400&h=300&fit=crop&q=80" },
    { id:11, name:"Pavlova de Frutas",     desc:"Merengue crocante com chantilly e frutas vermelhas frescas da estação",                 price:"R$ 44",  img:"https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400&h=300&fit=crop&q=80" },
    { id:12, name:"Sorvete Artesanal",     desc:"Três bolas de sorvete artesanal com coulis de fruta e flores comestíveis",               price:"R$ 38",  img:"https://images.unsplash.com/photo-1501443762994-82bd5dace89a?w=400&h=300&fit=crop&q=80" },
  ],
  bebidas: [
    { id:13, name:"Champagne Veuve Clicquot", desc:"Taça de champagne brut, perfeita para celebrar momentos especiais inesquecíveis",   price:"R$ 85",             img:"https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop&q=80" },
    { id:14, name:"Carta de Vinhos",          desc:"Seleção curada de rótulos nacionais e importados. Consulte nosso sommelier",         price:"A partir de R$ 95", img:"https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop&q=80" },
    { id:15, name:"Coquetéis Autorais",       desc:"Criações exclusivas do nosso bartender com ingredientes premium e sazonais",         price:"R$ 42",             img:"https://images.unsplash.com/photo-1551538827-9c037cb4f32a?w=400&h=300&fit=crop&q=80" },
    { id:16, name:"Água Mineral Premium",     desc:"Perrier ou San Pellegrino servida gelada com limão siciliano e gelo artesanal",       price:"R$ 18",             img:"https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=400&h=300&fit=crop&q=80" },
  ],
};

// Galeria de imagens: array com objetos contendo id, src (URL da imagem) e alt (texto alternativo)
const GALLERY = [
  { id:1, src:"https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=900&q=85", alt:"Salão principal" },
  { id:2, src:"https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=500&q=80", alt:"Prato gourmet" },
  { id:3, src:"https://images.unsplash.com/photo-1559339352-11d035aa65de?w=500&q=80",    alt:"Chef preparando" },
  { id:4, src:"https://images.unsplash.com/photo-1424847651672-bf20a4b0982b?w=500&q=80", alt:"Vinho premium" },
  { id:5, src:"https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?w=500&q=80",    alt:"Sobremesa especial" },
  { id:6, src:"https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=900&q=85", alt:"Ambiente noturno" },
];

/* ─────────────────────────── ESTILOS CSS INJETADOS DINAMICAMENTE ─────────────────────────── */
// A constante CSS contém uma string com todas as regras de estilo do site.
// Isso é uma técnica para manter os estilos encapsulados no componente principal,
// mas não é recomendada para projetos grandes (prefira CSS modules ou styled-components).
// No entanto, para fins do exercício, ela é usada e injetada via <style dangerouslySetInnerHTML>.
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Montserrat:wght@300;400;500;600;700&display=swap');

/* Reset básico: remove margens/paddings e define box-sizing border-box para todos os elementos */
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}

/* Variáveis CSS globais (cores, sombras, etc.) – tema do restaurante */
:root{
  --gold:#D6C5A5;       /* Dourado principal */
  --gold-l:#E8DCC2;     /* Dourado claro */
  --gold-d:#B5A17A;     /* Dourado escuro */
  --terra:#A3503C;      /* Terracota */
  --bg:#151413;         /* Fundo principal escuro */
  --bg2:#1A1918;        /* Fundo secundário ligeiramente mais claro */
  --bg3:#1E1C1B;        /* Fundo terciário */
  --bg4:#262422;        /* Fundo quaternário */
  --cream:#F4F0E6;      /* Creme para textos */
  --cream2:#D1CBBB;     /* Creme médio */
  --cream3:#999386;     /* Creme escuro */
  --cream4:#5C584E;     /* Creme mais escuro */
}

/* Rolagem suave para toda a página (anchor links com scroll-behavior:smooth) */
html{scroll-behavior:smooth}
body{
  background:var(--bg);
  color:var(--cream);
  font-family:'Montserrat',sans-serif;
  overflow-x:hidden;      /* Evita rolagem horizontal */
  position:relative;
}

/* Efeito de ruído (noise) sobreposto ao fundo para dar textura */
body::before{
  content:"";
  position:fixed;        /* Fixo em relação à viewport, cobre toda a tela */
  inset:0;               /* Atalho para top, right, bottom, left = 0 */
  width:100vw;
  height:100vh;
  background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
  opacity:0.035;         /* Leve transparência para não atrapalhar a leitura */
  pointer-events:none;   /* Permite clicar através do overlay */
  z-index:9999;
}

/* Classes utilitárias para fontes específicas */
.f-display{font-family:'Playfair Display',serif}
.f-serif{font-family:'Cormorant Garamond',serif}

/* Estilização da barra de rolagem (scrollbar) */
::-webkit-scrollbar{width:5px}
::-webkit-scrollbar-track{background:var(--bg)}
::-webkit-scrollbar-thumb{background:var(--gold);border-radius:3px}

/* ==================== NAVBAR (MENU SUPERIOR) ==================== */
.nav{position:fixed;inset:0 0 auto 0;z-index:100;padding:1.25rem 2rem;transition:all .4s ease}
/* Quando a classe .stuck é adicionada (via JS ao rolar), o fundo fica semi-transparente com blur */
.nav.stuck{
  background:rgba(21,20,19,.92);
  backdrop-filter:blur(22px);
  border-bottom:1px solid rgba(214,197,165,.12);
  box-shadow:0 4px 30px rgba(0,0,0,.35);
  padding:.9rem 2rem
}
.nav-inner{max-width:1200px;margin:0 auto;display:flex;align-items:center;justify-content:space-between}
.logo{font-family:'Playfair Display',serif;font-size:1.7rem;font-weight:600;color:var(--gold);text-decoration:none;letter-spacing:.04em}
.nav-links{display:flex;gap:2.5rem;align-items:center}
.nav-link{background:none;border:none;cursor:pointer;font-family:'Montserrat',sans-serif;font-size:.68rem;font-weight:500;letter-spacing:.2em;text-transform:uppercase;color:var(--cream2);text-decoration:none;position:relative;padding-bottom:3px;transition:color .3s}
/* Efeito de sublinhado animado no hover do link */
.nav-link::after{content:'';position:absolute;bottom:0;left:0;width:0;height:1px;background:var(--gold);transition:width .3s}
.nav-link:hover{color:var(--gold)}
.nav-link:hover::after{width:100%}

/* Botão hambúrguer: oculto por padrão, aparece apenas no mobile (display:flex!important via media query) */
.hamburger{
  display:none;
  background:none;
  border:none;
  color:var(--cream);
  cursor:pointer;
  padding:.25rem;
  align-items:center;
  justify-content:center;
}

/* ==================== BOTÕES GERAIS ==================== */
.btn{display:inline-flex;align-items:center;justify-content:center;gap:.5rem;font-family:'Montserrat',sans-serif;font-weight:600;font-size:.7rem;letter-spacing:.22em;text-transform:uppercase;text-decoration:none;cursor:pointer;border:none;outline:none;transition:all .3s ease}
.btn-gold{background:linear-gradient(135deg,var(--gold) 0%,var(--gold-d) 100%);color:var(--bg);padding:.9rem 2.5rem}
.btn-gold:hover{background:linear-gradient(135deg,var(--gold-l) 0%,var(--gold) 100%);transform:translateY(-2px);box-shadow:0 10px 30px rgba(214,197,165,.25)}
.btn-outline{background:transparent;color:var(--cream);border:1px solid rgba(245,237,216,.25);padding:.85rem 2rem}
.btn-outline:hover{border-color:var(--gold);color:var(--gold);transform:translateY(-2px)}
.btn-sm{padding:.65rem 1.4rem;font-size:.65rem}

/* ==================== DIVISÓRIAS DECORATIVAS ==================== */
.divider{display:flex;align-items:center;gap:1.2rem}
.divider::before,.divider::after{content:'';flex:1;height:1px;background:linear-gradient(90deg,transparent,rgba(214,197,165,.35),transparent)}

/* ==================== SEÇÕES GERAIS ==================== */
.section{padding:6rem 1.5rem}
.section-inner{max-width:1200px;margin:0 auto}
.section-eyebrow{font-size:.63rem;letter-spacing:.35em;text-transform:uppercase;color:var(--gold);margin-bottom:.8rem;font-family:'Montserrat',sans-serif}
.section-title{font-size:clamp(2rem,4vw,3.2rem);font-weight:400;line-height:1.15;color:var(--cream);margin-bottom:1rem}
.section-title em{color:var(--gold);font-style:italic}

/* ==================== HERO ==================== */
.hero{height:100vh;min-height:700px;position:relative;display:flex;align-items:center;justify-content:center;overflow:hidden}
.hero-bg{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;transform:scale(1.06);transition:transform 8s ease}
.hero-bg.rdy{transform:scale(1)} /* Quando a imagem carrega, escala suavemente para 1 (zoom out) */
.hero-overlay{
  position:absolute;
  inset:0;
  background:linear-gradient(
    180deg,
    rgba(0,0,0,.50) 0%,
    rgba(15,13,12,.72) 45%,
    rgba(21,20,19,.97) 100%
  )
}
.hero-content{position:relative;z-index:2;text-align:center;max-width:820px;padding:0 1.5rem}
.hero-tag{
  font-size:.6rem;
  letter-spacing:.4em;
  text-transform:uppercase;
  color:var(--gold);
  margin-bottom:1.5rem;
  font-family:'Montserrat',sans-serif;
  text-shadow:0 1px 12px rgba(0,0,0,.85);
}
.hero-title{
  font-size:clamp(3rem,8vw,6rem);
  font-weight:400;
  line-height:1.07;
  color:var(--cream);
  margin-bottom:1rem;
  font-family:'Playfair Display',serif;
  text-shadow:0 2px 24px rgba(0,0,0,.8), 0 1px 6px rgba(0,0,0,.65);
}
.hero-title em{color:var(--gold);font-style:italic}
.hero-sub{
  font-family:'Cormorant Garamond',serif;
  font-size:clamp(1rem,2.5vw,1.35rem);
  color:var(--cream);
  font-weight:400;
  margin-bottom:2.5rem;
  letter-spacing:.04em;
  text-shadow:0 1px 14px rgba(0,0,0,.8);
}
.hero-cta{display:flex;gap:1rem;justify-content:center;flex-wrap:wrap;margin-bottom:4rem}
.hero-stats{display:flex;gap:3rem;justify-content:center;flex-wrap:wrap}
.stat-num{font-family:'Playfair Display',serif;font-size:2rem;color:var(--gold);font-weight:600;line-height:1;text-shadow:0 2px 12px rgba(0,0,0,.7)}
.stat-label{font-size:.6rem;letter-spacing:.15em;text-transform:uppercase;color:var(--cream2);margin-top:.3rem;font-family:'Montserrat',sans-serif;text-shadow:0 1px 8px rgba(0,0,0,.7)}
.scroll-cue{position:absolute;bottom:2rem;left:50%;transform:translateX(-50%);animation:float 2.2s ease-in-out infinite;color:var(--gold);opacity:.7}

/* ==================== ABOUT (SOBRE) ==================== */
.about-grid{display:grid;grid-template-columns:1fr 1fr;gap:5rem;align-items:center}
.about-img-wrap{position:relative}
.about-frame{position:absolute;top:-1.4rem;left:-1.4rem;right:1.4rem;bottom:1.4rem;border:1px solid rgba(214,197,165,.2);pointer-events:none;z-index:0}
.about-img{width:100%;height:490px;object-fit:cover;position:relative;z-index:1;display:block}
.about-badge{position:absolute;bottom:-1.8rem;right:-1.8rem;z-index:2;width:116px;height:116px;border-radius:50%;background:var(--gold);display:flex;flex-direction:column;align-items:center;justify-content:center}
.badge-num{font-family:'Playfair Display',serif;font-size:2rem;color:var(--bg);font-weight:700;line-height:1}
.badge-text{font-size:.55rem;letter-spacing:.15em;text-transform:uppercase;color:var(--bg);font-weight:700;margin-top:.2rem}
.about-feature{display:flex;align-items:flex-start;gap:.6rem;margin-bottom:.9rem}
.about-feature-icon{font-size:1.1rem;line-height:1;flex-shrink:0;margin-top:.05rem}
.about-feature-text{font-size:.78rem;color:var(--cream3);line-height:1.55;letter-spacing:.02em}

/* ==================== MENU (CARDÁPIO) ==================== */
.tabs-bar{display:flex;border-bottom:1px solid rgba(214,197,165,.12);margin-bottom:3rem;overflow-x:auto;justify-content:center;gap:0}
.tab{background:none;border:none;border-bottom:2px solid transparent;padding:.8rem 1.6rem;font-family:'Montserrat',sans-serif;font-size:.67rem;font-weight:500;letter-spacing:.14em;text-transform:uppercase;color:var(--cream3);cursor:pointer;transition:all .3s;white-space:nowrap;display:flex;align-items:center;gap:.5rem}
.tab:hover{color:var(--cream2)}
.tab.active{color:var(--gold);border-bottom-color:var(--gold)}
.menu-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:1.5rem}
.menu-card{background:var(--bg3);border:1px solid rgba(214,197,165,.07);overflow:hidden;transition:all .4s cubic-bezier(0.2,0.9,0.4,1.1);cursor:default}
.menu-card:hover{border-color:rgba(214,197,165,.25);transform:translateY(-4px);box-shadow:0 20px 45px rgba(0,0,0,.45)}
.menu-img-wrap{height:195px;overflow:hidden}
.menu-img{width:100%;height:100%;object-fit:cover;transition:all .8s cubic-bezier(0.25,1,0.5,1);filter:saturate(0.6) contrast(1.05);display:block}
.menu-card:hover .menu-img{transform:scale(1.04);filter:saturate(1.2) contrast(1)}
.menu-body{padding:1.2rem 1.4rem}
.menu-header{display:flex;justify-content:space-between;align-items:flex-start;gap:.5rem;margin-bottom:.45rem}
.menu-name{font-family:'Playfair Display',serif;font-size:1.05rem;font-weight:500;color:var(--cream);flex:1}
.menu-price{color:var(--gold);font-weight:600;font-size:.88rem;white-space:nowrap;flex-shrink:0}
.menu-desc{font-size:.76rem;color:var(--cream3);line-height:1.65;letter-spacing:.02em}

/* ==================== GALERIA ==================== */
.gallery-grid{display:grid;grid-template-columns:repeat(3,1fr);grid-template-rows:repeat(2,260px);gap:.75rem}
.gallery-item{overflow:hidden;position:relative}
.gallery-item img{width:100%;height:100%;object-fit:cover;transition:all .8s cubic-bezier(0.25,1,0.5,1);filter:grayscale(35%) contrast(1.05);display:block}
.gallery-item:hover img{transform:scale(1.03);filter:grayscale(0%) contrast(1)}
.gallery-item::after{content:'';position:absolute;inset:0;background:linear-gradient(to top,rgba(21,20,19,.5) 0%,transparent 55%);opacity:0;transition:opacity .4s}
.gallery-item:hover::after{opacity:1}
.gi-big{grid-column:1/3;grid-row:1/3}   /* Item grande ocupa duas colunas e duas linhas */
.gi-wide{grid-column:2/4}               /* Item largo ocupa da coluna 2 até a 4 (três colunas) */

/* ==================== CONTATO ==================== */
.contact-grid{display:grid;grid-template-columns:1fr 1.55fr;gap:4rem;align-items:start}
.contact-item{display:flex;gap:1rem;align-items:flex-start;margin-bottom:1.8rem}
.contact-icon{flex-shrink:0;margin-top:.1rem;color:var(--gold)}
.contact-label{font-size:.65rem;letter-spacing:.18em;text-transform:uppercase;color:var(--gold);margin-bottom:.3rem;font-family:'Montserrat',sans-serif}
.contact-val{color:var(--cream2);font-size:.9rem;line-height:1.7}
.hours-row{display:flex;justify-content:space-between;gap:1.5rem;margin-bottom:.35rem}
.hours-day{font-size:.8rem;color:var(--cream3)}
.hours-time{font-size:.8rem;color:var(--cream2)}
.map-wrap{height:430px;border:1px solid rgba(214,197,165,.14);overflow:hidden}
.map-wrap iframe{width:100%;height:100%;border:0;filter:grayscale(55%) invert(88%) hue-rotate(175deg)} /* Efeito estilizado no mapa */

/* ==================== FOOTER (RODAPÉ) ==================== */
.footer{background:var(--bg2);border-top:1px solid rgba(214,197,165,.1);padding:3.5rem 1.5rem 2rem}
.footer-grid{max-width:1200px;margin:0 auto}
.footer-cols{display:grid;grid-template-columns:2fr 1fr 1fr;gap:3rem;margin-bottom:3rem}
.footer-brand{font-family:'Playfair Display',serif;font-size:2.4rem;color:var(--gold);font-weight:600;display:block;margin-bottom:1rem}
.footer-tagline{font-family:'Cormorant Garamond',serif;color:var(--cream3);font-size:1.05rem;line-height:1.75;font-weight:300;max-width:280px}
.social-links{display:flex;gap:.75rem;margin-top:1.5rem}
.social-link{width:40px;height:40px;border-radius:50%;border:1px solid rgba(214,197,165,.18);display:flex;align-items:center;justify-content:center;color:var(--cream3);text-decoration:none;transition:all .3s}
.social-link:hover{border-color:var(--gold);color:var(--gold);transform:translateY(-2px)}
.footer-col-title{font-size:.62rem;letter-spacing:.22em;text-transform:uppercase;color:var(--gold);margin-bottom:1.25rem;font-family:'Montserrat',sans-serif}
.footer-link{display:block;color:var(--cream3);font-size:.85rem;text-decoration:none;margin-bottom:.55rem;transition:color .3s}
.footer-link:hover{color:var(--gold)}
.footer-bottom{max-width:1200px;margin:0 auto;border-top:1px solid rgba(214,197,165,.08);padding-top:1.5rem;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:1rem}
.footer-copy{font-size:.7rem;color:var(--cream3);letter-spacing:.05em}
.footer-legal{display:flex;gap:1.5rem}
.footer-legal a{font-size:.68rem;color:var(--cream3);text-decoration:none;transition:color .3s}
.footer-legal a:hover{color:var(--gold)}

/* ==================== BOTÃO FLUTUANTE DO WHATSAPP ==================== */
.wa-btn{position:fixed;bottom:1.75rem;right:1.75rem;z-index:99;width:58px;height:58px;border-radius:50%;background:#25D366;display:flex;align-items:center;justify-content:center;box-shadow:0 4px 22px rgba(37,211,102,.35);text-decoration:none;transition:all .3s ease;animation:float 3.5s ease-in-out infinite}
.wa-btn:hover{background:#1ebe58;box-shadow:0 8px 34px rgba(37,211,102,.5);transform:scale(1.1);animation-play-state:paused}

/* ==================== ANIMAÇÕES ==================== */
@keyframes fadeUp{from{opacity:0;transform:translateY(28px)}to{opacity:1;transform:translateY(0)}}
@keyframes fadeIn{from{opacity:0}to{opacity:1}}
@keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-7px)}}
@keyframes slideUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}

/* Classes para animação de entrada dos elementos (a1, a2, a3, a4, a5) */
.a1{opacity:0;animation:fadeUp .9s .1s ease forwards}
.a2{opacity:0;animation:fadeUp .9s .3s ease forwards}
.a3{opacity:0;animation:fadeUp .9s .5s ease forwards}
.a4{opacity:0;animation:fadeUp .9s .7s ease forwards}
.a5{opacity:0;animation:fadeUp .9s .9s ease forwards}

/* ==================== MENU MOBILE (OVERLAY) ==================== */
.mobile-overlay{position:fixed;inset:0;background:rgba(21,20,19,.98);backdrop-filter:blur(14px);z-index:200;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:2.5rem;animation:fadeIn .25s ease}
.mobile-nav-link{background:none;border:none;cursor:pointer;font-family:'Playfair Display',serif;font-size:2rem;color:var(--cream);font-style:italic;transition:color .3s}
.mobile-nav-link:hover{color:var(--gold)}

/* ==================== RESPONSIVIDADE (MEDIA QUERIES) ==================== */
@media(max-width:1024px){
  .about-grid{grid-template-columns:1fr;gap:3rem}
  .about-img-wrap{display:none}  /* Oculta a imagem do about em telas menores */
  .contact-grid{grid-template-columns:1fr;gap:2.5rem}
  .footer-cols{grid-template-columns:1fr 1fr;gap:2rem}
}

/* Para telas até 768px (tablets e celulares) */
@media(max-width:768px){
  .section{padding:4rem 1.25rem}
  .nav-links{display:none}          /* Esconde os links de navegação desktop */
  .hamburger{display:flex!important} /* Mostra o botão hambúrguer */
  .gallery-grid{grid-template-columns:1fr 1fr;grid-template-rows:auto}
  .gi-big{grid-column:1/3;grid-row:1;height:280px}
  .gi-wide{grid-column:1/3;height:200px}
  .hero-stats{gap:2rem}
  .footer-cols{grid-template-columns:1fr}
  .footer-bottom{flex-direction:column;align-items:flex-start}
}

/* Telas muito pequenas (<= 480px) */
@media(max-width:480px){
  .gallery-grid{grid-template-columns:1fr}
  .gi-big{grid-column:1;grid-row:1}
  .gi-wide{grid-column:1}
  .tabs-bar{justify-content:flex-start}
}
`;

/* ─────────────────────────── COMPONENTE: NAVBAR (BARRA DE NAVEGAÇÃO) ─────────────────────── */
function Navbar() {
  // Estado para controlar se a navbar está "grudada" (sticky) após rolar a página
  const [stuck, setStuck] = useState(false);
  // Estado para controlar a abertura/fechamento do menu mobile (overlay)
  const [open, setOpen]   = useState(false);

  // useEffect para adicionar um listener de scroll que verifica a posição da janela
  useEffect(() => {
    // Função executada a cada scroll: define stuck como true se o scrollY > 60px
    const onScroll = () => setStuck(window.scrollY > 60);
    // Adiciona o evento com passive: true para melhor performance
    window.addEventListener("scroll", onScroll, { passive: true });
    // Cleanup: remove o evento quando o componente desmontar
    return () => window.removeEventListener("scroll", onScroll);
  }, []); // Array vazio = efeito executado apenas uma vez (montagem)

  // Função para rolar suavemente até uma seção pelo seletor CSS (ex: "#sobre")
  const scroll = (id) => {
    setOpen(false); // Se o menu mobile estiver aberto, fecha ao clicar em um link
    // document.querySelector encontra o elemento e scrollIntoView suavemente
    document.querySelector(id)?.scrollIntoView({ behavior: "smooth" });
  };

  // Lista de links da navbar (id da seção e texto)
  const links = [
    { id: "#sobre",    label: "Sobre" },
    { id: "#cardapio", label: "Cardápio" },
    { id: "#galeria",  label: "Galeria" },
    { id: "#contato",  label: "Contato" },
  ];

  return (
    <>
      {/* Navbar: classe 'nav' e condicional 'stuck' se o estado for true */}
      <nav className={`nav${stuck ? " stuck" : ""}`}>
        <div className="nav-inner">
          {/* Logo (âncora que volta ao topo) */}
          <a href="#" className="logo">Lumière</a>

          {/* Links de navegação para desktop (visíveis apenas em telas grandes) */}
          <div className="nav-links">
            {links.map(l => (
              <button key={l.id} onClick={() => scroll(l.id)} className="nav-link">
                {l.label}
              </button>
            ))}
            {/* Botão de reserva que abre WhatsApp em nova aba */}
            <a href={WA_LINK} target="_blank" rel="noreferrer"
               className="btn btn-gold btn-sm">Reservar Mesa</a>
          </div>

          {/* Botão hambúrguer para abrir menu mobile */}
          <button className="hamburger" onClick={() => setOpen(true)}>
            <MenuIcon size={25} />
          </button>
        </div>
      </nav>

      {/* Overlay do menu mobile: exibido apenas se open === true */}
      {open && (
        <div className="mobile-overlay">
          {/* Botão de fechar (X) posicionado no canto superior direito */}
          <button
            onClick={() => setOpen(false)}
            style={{ position:"absolute", top:"1.5rem", right:"1.5rem",
                     background:"none", border:"none", color:"var(--cream2)", cursor:"pointer" }}
          >
            <X size={26} />
          </button>
          {/* Logo no centro do overlay */}
          <span className="logo" style={{ fontSize:"2.2rem" }}>Lumière</span>
          {/* Links do menu mobile (mesmo comportamento de scroll) */}
          {links.map(l => (
            <button key={l.id} onClick={() => scroll(l.id)} className="mobile-nav-link">
              {l.label}
            </button>
          ))}
          {/* Botão de reserva também no menu mobile */}
          <a href={WA_LINK} target="_blank" rel="noreferrer"
             className="btn btn-gold" style={{ marginTop:"1rem" }}>Reservar Mesa</a>
        </div>
      )}
    </>
  );
}

/* ─────────────────────────── COMPONENTE: HERO (SEÇÃO PRINCIPAL) ─────────────────────────── */
function Hero() {
  // Estado para saber se a imagem de fundo já foi carregada (para aplicar a classe .rdy e iniciar a animação de escala)
  const [rdy, setRdy] = useState(false);
  return (
    <section className="hero">
      {/* Imagem de fundo em alta resolução. O evento onLoad dispara quando a imagem termina de carregar */}
      <img
        src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1920&q=85"
        alt="Lumière — Alta Gastronomia"
        className={`hero-bg${rdy ? " rdy" : ""}`}
        onLoad={() => setRdy(true)}   // Após carregar, seta rdy para true
      />
      {/* Overlay escuro para melhorar legibilidade do texto */}
      <div className="hero-overlay" />
      {/* Conteúdo textual centralizado */}
      <div className="hero-content">
        <p className="hero-tag a1">✦ &nbsp; Alta Gastronomia &nbsp; ✦</p>
        <h1 className="hero-title a2">
          Uma Experiência<br /><em>Além do Sabor</em>
        </h1>
        <p className="hero-sub a3">
          Onde a arte culinária encontra a elegância em cada detalhe.
        </p>
        <div className="hero-cta a4">
          <a href={WA_LINK} target="_blank" rel="noreferrer"
             className="btn btn-gold">Reservar Mesa</a>
          <button
            className="btn btn-outline"
            onClick={() => document.querySelector("#cardapio")?.scrollIntoView({ behavior:"smooth" })}
          >Ver Cardápio</button>
        </div>
        {/* Estatísticas (anos, estrelas, avaliação) com animação a5 */}
        <div className="hero-stats a5">
          {[["15+","Anos de Tradição"],["2","Estrelas Michelin"],["4.9★","Avaliação"]].map(([n,l]) => (
            <div key={l} style={{ textAlign:"center" }}>
              <div className="stat-num">{n}</div>
              <div className="stat-label">{l}</div>
            </div>
          ))}
        </div>
      </div>
      {/* Ícone animado para indicar rolagem (seta para baixo) */}
      <div className="scroll-cue"><ChevronDown size={26} /></div>
    </section>
  );
}

/* ─────────────────────────── COMPONENTE: ABOUT (SOBRE O RESTAURANTE) ─────────────────────── */
function About() {
  return (
    <section id="sobre" className="section" style={{ background:"var(--bg2)" }}>
      <div className="section-inner">
        <div className="about-grid">
          {/* Lado esquerdo: imagem com moldura decorativa e selo de anos */}
          <div className="about-img-wrap">
            <div className="about-frame" />
            <img
              src="https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?w=700&q=80"
              alt="Sobre o Lumière"
              className="about-img"
            />
            <div className="about-badge">
              <span className="badge-num">15</span>
              <span className="badge-text">Anos</span>
            </div>
          </div>
          {/* Lado direito: textos descritivos */}
          <div>
            <p className="section-eyebrow">Nossa História</p>
            <h2 className="section-title f-display">
              Paixão pela<br /><em>Alta Gastronomia</em>
            </h2>
            <div className="divider" style={{ marginBottom:"1.5rem" }}>
              <span style={{ color:"var(--gold)", fontSize:"1.1rem" }}>✦</span>
            </div>
            <p className="f-serif" style={{ fontSize:"1.1rem", lineHeight:1.82, color:"var(--cream2)", fontWeight:300, marginBottom:"1.2rem" }}>
              Fundado em 2009 pelo Chef François Dubois e pela sommelier Ana Clara Vidal, o Lumière nasceu
              de um sonho compartilhado: trazer a sofisticação da alta cozinha europeia ao coração de São Paulo.
            </p>
            <p className="f-serif" style={{ fontSize:"1.1rem", lineHeight:1.82, color:"var(--cream2)", fontWeight:300, marginBottom:"2rem" }}>
              Com ingredientes selecionados dos melhores produtores do Brasil e do mundo, nossa cozinha é um
              convite à descoberta — onde técnica impecável e criatividade sem limites se encontram em cada prato.
            </p>
            {/* Lista de diferenciais (features) */}
            {[
              ["🌿","Ingredientes de origem controlada e certificada"],
              ["🍷","Menu degustação harmonizado com o sommelier"],
              ["🕯️","Salão privativo para eventos exclusivos"],
            ].map(([icon,text]) => (
              <div key={text} className="about-feature">
                <span className="about-feature-icon">{icon}</span>
                <span className="about-feature-text">{text}</span>
              </div>
            ))}
            <div style={{ marginTop:"2.2rem" }}>
              <a href={WA_LINK} target="_blank" rel="noreferrer" className="btn btn-gold">
                Fazer Reserva
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────── COMPONENTE: MENU (CARDÁPIO COM ABAS) ───────────────────────── */
function MenuSection() {
  // Estado para armazenar qual aba está ativa (key da categoria)
  const [tab, setTab] = useState("entradas");
  // Obtém os itens da categoria ativa a partir do MENU_DATA
  const items = MENU_DATA[tab];
  return (
    <section id="cardapio" className="section" style={{ background:"var(--bg)" }}>
      <div className="section-inner">
        <div style={{ textAlign:"center", marginBottom:"3.5rem" }}>
          <p className="section-eyebrow">Nossa Culinária</p>
          <h2 className="section-title f-display" style={{ textAlign:"center" }}>
            O <em>Cardápio</em>
          </h2>
          <div className="divider" style={{ maxWidth:300, margin:"0 auto" }}>
            <span style={{ color:"var(--gold)" }}>✦</span>
          </div>
        </div>
        {/* Barra de abas */}
        <div className="tabs-bar">
          {MENU_TABS.map(({ key, label, Icon }) => (
            <button key={key} className={`tab${tab===key?" active":""}`} onClick={() => setTab(key)}>
              <Icon size={14} />{label}
            </button>
          ))}
        </div>
        {/* Grid de cards do menu */}
        <div className="menu-grid">
          {items.map(item => (
            <div key={item.id} className="menu-card">
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
            </div>
          ))}
        </div>
        <div style={{ textAlign:"center", marginTop:"3rem" }}>
          <a href={WA_LINK} target="_blank" rel="noreferrer" className="btn btn-gold">
            Cardápio Completo & Reserva
          </a>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────── COMPONENTE: GALERIA (GALLERY) ──────────────────────────────── */
function Gallery() {
  return (
    <section id="galeria" className="section" style={{ background:"var(--bg2)" }}>
      <div className="section-inner">
        <div style={{ textAlign:"center", marginBottom:"3rem" }}>
          <p className="section-eyebrow">Nossos Momentos</p>
          <h2 className="section-title f-display" style={{ textAlign:"center" }}>
            A <em>Galeria</em>
          </h2>
          <div className="divider" style={{ maxWidth:280, margin:"0 auto" }}>
            <span style={{ color:"var(--gold)" }}>✦</span>
          </div>
        </div>
        {/* Grid de imagens com classes especiais para itens maiores */}
        <div className="gallery-grid">
          <div className="gallery-item gi-big">
            <img src={GALLERY[0].src} alt={GALLERY[0].alt} loading="lazy" />
          </div>
          <div className="gallery-item">
            <img src={GALLERY[1].src} alt={GALLERY[1].alt} loading="lazy" />
          </div>
          <div className="gallery-item">
            <img src={GALLERY[2].src} alt={GALLERY[2].alt} loading="lazy" />
          </div>
          <div className="gallery-item">
            <img src={GALLERY[3].src} alt={GALLERY[3].alt} loading="lazy" />
          </div>
          <div className="gallery-item gi-wide">
            {/* Utiliza a última imagem (índice 5) para o item largo */}
            <img src={GALLERY[5].src} alt={GALLERY[5].alt} loading="lazy" />
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────── COMPONENTE: CONTATO (CONTACT) ──────────────────────────────── */
function Contact() {
  return (
    <section id="contato" className="section" style={{ background:"var(--bg)" }}>
      <div className="section-inner">
        <div style={{ textAlign:"center", marginBottom:"3.5rem" }}>
          <p className="section-eyebrow">Venha nos Visitar</p>
          <h2 className="section-title f-display" style={{ textAlign:"center" }}>
            <em>Localização</em> & Contato
          </h2>
          <div className="divider" style={{ maxWidth:300, margin:"0 auto" }}>
            <span style={{ color:"var(--gold)" }}>✦</span>
          </div>
        </div>
        <div className="contact-grid">
          {/* Bloco de informações de contato */}
          <div>
            <div className="contact-item">
              <MapPin size={20} className="contact-icon" />
              <div>
                <p className="contact-label">Endereço</p>
                <p className="contact-val">
                  Rua Oscar Freire, 987 — Jardins<br />
                  São Paulo — SP, 01426-001
                </p>
              </div>
            </div>
            <div className="contact-item">
              <Phone size={20} className="contact-icon" />
              <div>
                <p className="contact-label">Reservas</p>
                <p className="contact-val">(11) 9 9999-9999</p>
                <a href={WA_LINK} target="_blank" rel="noreferrer"
                   style={{ color:"var(--gold)", fontSize:".8rem", textDecoration:"none" }}>
                  WhatsApp disponível →
                </a>
              </div>
            </div>
            <div className="contact-item">
              <Clock size={20} className="contact-icon" />
              <div style={{ flex:1 }}>
                <p className="contact-label">Horários de Funcionamento</p>
                {/* Mapeia os horários de funcionamento */}
                {[
                  ["Terça a Sexta","12h–15h / 19h–23h"],
                  ["Sábado","12h–23h30"],
                  ["Domingo","12h–17h"],
                  ["Segunda-feira","Fechado"],
                ].map(([day,time]) => (
                  <div key={day} className="hours-row">
                    <span className="hours-day">{day}</span>
                    <span className="hours-time"
                      style={day==="Segunda-feira"?{color:"var(--cream4)"}:{}}>{time}</span>
                  </div>
                ))}
              </div>
            </div>
            {/* Botões de ação rápida */}
            <div style={{ display:"flex", gap:".75rem", flexWrap:"wrap", marginTop:".5rem" }}>
              <a href={WA_LINK} target="_blank" rel="noreferrer" className="btn btn-gold btn-sm">
                💬 WhatsApp
              </a>
              <a href="tel:+5511999999999" className="btn btn-outline btn-sm">📞 Ligar</a>
            </div>
          </div>
          {/* Mapa do Google Maps incorporado (iframe) */}
          <div className="map-wrap">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3657.0!2d-46.6702!3d-23.5645!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94ce5a2b2ed7f3a1%3A0x4b6c1c5a3fcca7c5!2sR.+Oscar+Freire%2C+S%C3%A3o+Paulo!5e0!3m2!1spt-BR!2sbr!4v1700000000000!5m2!1spt-BR!2sbr"
              allowFullScreen loading="lazy" title="Localização do Lumière"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────── COMPONENTE: FOOTER (RODAPÉ) ───────────────────────────────── */
function Footer() {
  const year = new Date().getFullYear(); // Ano atual para direitos autorais
  return (
    <footer className="footer">
      <div className="footer-grid">
        <div className="footer-cols">
          {/* Coluna 1: marca e descrição */}
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
          {/* Coluna 2: links de exploração */}
          <div>
            <h4 className="footer-col-title">Explore</h4>
            <a href="#sobre" className="footer-link">Nossa História</a>
            <a href="#cardapio" className="footer-link">Menu Degustação</a>
            <a href="#galeria" className="footer-link">Ambiente</a>
          </div>
          {/* Coluna 3: links de visita */}
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
    </footer>
  );
}

/* ─────────────────────────── COMPONENTE PRINCIPAL APP ───────────────────────────────────── */
export default function App() {
  return (
    <>
      {/* Injeta os estilos CSS globais definidos na string CSS via dangerouslySetInnerHTML.
          Isso adiciona uma tag <style> no <head> da página. */}
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      {/* Renderiza todos os componentes na ordem correta */}
      <Navbar />
      <Hero />
      <About />
      <MenuSection />
      <Gallery />
      <Contact />
      <Footer />
      {/* Botão flutuante do WhatsApp (posicionado fixed) */}
      <a href={WA_LINK} target="_blank" rel="noreferrer" className="wa-btn" aria-label="WhatsApp">
        <FaWhatsapp size={30} color="#fff" />
      </a>
    </>
  );
}
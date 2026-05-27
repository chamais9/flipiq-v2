import { useState } from 'react';
import { getCardColor } from '../utils/helpers';

export default function StudyMode({ cards, onClose, onReveal }) {
  const [index,   setIndex]   = useState(0);
  const [flipped, setFlipped] = useState(false);

  if (!cards.length) return null;

  const card  = cards[index];
  const color = getCardColor(card.id);
  const pct   = Math.round(((index + 1) / cards.length) * 100);

  const flip = () => { if (!flipped) onReveal?.(card.id); setFlipped(f => !f); };
  const next = () => { setIndex(i => (i + 1) % cards.length); setFlipped(false); };
  const prev = () => { setIndex(i => (i - 1 + cards.length) % cards.length); setFlipped(false); };

  return (
    <div style={overlay}>
      <button onClick={onClose} style={closeBtn}>✕ Exit Study</button>
      <div style={{ width:'100%', maxWidth:580, marginBottom:24 }}>
        <div style={{ display:'flex', justifyContent:'space-between', marginBottom:8 }}>
          <span style={pLabel}>Card {index + 1} of {cards.length}</span>
          <span style={{ ...pLabel, color:color.border }}>{pct}%</span>
        </div>
        <div style={{ height:6, background:'#e2e8f0', borderRadius:50, overflow:'hidden' }}>
          <div style={{ height:'100%', width:`${pct}%`, background:color.border, borderRadius:50, transition:'width 0.4s ease' }} />
        </div>
      </div>
      <div style={{ perspective:1200, width:'100%', maxWidth:580, height:320, cursor:'pointer', marginBottom:28 }} onClick={flip}>
        <div style={{ position:'relative', width:'100%', height:'100%', transformStyle:'preserve-3d', transition:'transform 0.6s cubic-bezier(0.4,0.2,0.2,1)', transform: flipped ? 'rotateY(180deg)' : 'none' }}>
          <div style={{ ...sFace, borderLeft:`5px solid ${color.border}` }}>
            <span style={{ fontSize:'0.68rem', fontWeight:700, textTransform:'uppercase', color:color.text, marginBottom:16, display:'block' }}>Question</span>
            <p style={{ fontSize:'1.15rem', fontWeight:600, lineHeight:1.65, color:'#1e293b', textAlign:'center' }}>{card.question}</p>
            <p style={{ fontSize:'0.75rem', color:'#94a3b8', marginTop:20 }}>Click to reveal the answer</p>
          </div>
          <div style={{ ...sFace, transform:'rotateY(180deg)', background:color.bg, borderLeft:`5px solid ${color.border}` }}>
            <span style={{ fontSize:'0.68rem', fontWeight:700, textTransform:'uppercase', color:color.text, marginBottom:16, display:'block' }}>Answer</span>
            <p style={{ fontSize:'1.1rem', fontWeight:600, lineHeight:1.65, color:'#1e293b', textAlign:'center' }}>{card.answer}</p>
          </div>
        </div>
      </div>
      <div style={{ display:'flex', gap:12 }}>
        <button onClick={prev} style={navBtn}>← Previous</button>
        <button onClick={next} style={{ ...navBtn, background:color.border, color:'white', border:'none' }}>Next →</button>
      </div>
    </div>
  );
}

const overlay  = { position:'fixed', inset:0, background:'#f8fafc', zIndex:150, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'2rem' };
const closeBtn = { position:'fixed', top:20, right:20, background:'white', border:'1px solid #e2e8f0', borderRadius:50, padding:'0.5rem 1rem', fontWeight:600, fontSize:'0.875rem', cursor:'pointer', fontFamily:'inherit', color:'#64748b' };
const pLabel   = { fontSize:'0.75rem', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.08em', color:'#94a3b8' };
const sFace    = { position:'absolute', inset:0, backfaceVisibility:'hidden', borderRadius:20, border:'1px solid #e2e8f0', background:'white', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'2.5rem', boxShadow:'0 8px 32px rgba(0,0,0,0.08)' };
const navBtn   = { background:'white', color:'#475569', border:'1px solid #e2e8f0', borderRadius:50, padding:'0.65rem 1.4rem', fontWeight:600, fontSize:'0.9rem', cursor:'pointer', fontFamily:'inherit' };

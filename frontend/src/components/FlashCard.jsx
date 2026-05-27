import { useState } from 'react';
import { getCardColor } from '../utils/helpers';

export default function FlashCard({ card, onEdit, onDelete, onReveal }) {
  const [flipped,  setFlipped]  = useState(false);
  const [hovered,  setHovered]  = useState(false);
  const color = getCardColor(card.id);

  const handleFlip = () => {
    if (!flipped) onReveal?.(card.id);
    setFlipped(f => !f);
  };

  const diffStyle = {
    Easy:   { bg:'#dcfce7', color:'#15803d' },
    Medium: { bg:'#fef9c3', color:'#a16207' },
    Hard:   { bg:'#fee2e2', color:'#b91c1c' },
  }[card.difficulty] || { bg:'#f1f5f9', color:'#475569' };

  return (
    <div
      style={{ perspective:1000, height:230, position:'relative', borderRadius:14 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div
        onClick={handleFlip}
        style={{ width:'100%', height:'100%', transformStyle:'preserve-3d', cursor:'pointer', transition:'transform 0.55s cubic-bezier(0.4,0.2,0.2,1)', transform: flipped ? 'rotateY(180deg)' : 'none' }}
      >
        <div style={{ ...face, borderLeft:`4px solid ${color.border}` }}>
          <div style={{ display:'flex', justifyContent:'space-between', marginBottom:8 }}>
            <span style={{ ...badge, background:color.bg, color:color.text }}>{card.category}</span>
            <span style={{ ...badge, background:diffStyle.bg, color:diffStyle.color }}>{card.difficulty}</span>
          </div>
          <p style={qText}>{card.question}</p>
          <p style={{ fontSize:'0.68rem', color:'#94a3b8', fontWeight:600, marginTop:'auto' }}>↩ Click to flip</p>
        </div>
        <div style={{ ...face, transform:'rotateY(180deg)', background:color.bg, borderLeft:`4px solid ${color.border}` }}>
          <p style={{ fontSize:'0.68rem', fontWeight:700, textTransform:'uppercase', color:color.text, marginBottom:8 }}>Answer</p>
          <p style={{ flex:1, fontSize:'0.9rem', lineHeight:1.6, color:'#1e293b', overflowY:'auto' }}>{card.answer}</p>
          <div style={{ display:'flex', justifyContent:'space-between', marginTop:8 }}>
            <span style={{ ...badge, background:diffStyle.bg, color:diffStyle.color }}>{card.difficulty}</span>
            <span style={{ fontSize:'0.68rem', color:'#94a3b8' }}>Seen {card.timesRevealed}×</span>
          </div>
        </div>
      </div>

      {hovered && (
        <div
          style={{ position:'absolute', top:8, right:8, display:'flex', gap:4, zIndex:50 }}
          onClick={e => e.stopPropagation()}
        >
          <button onClick={() => onEdit(card)} style={actionBtn} title="Edit">✏️</button>
          <button onClick={() => onDelete(card.id)} style={actionBtn} title="Delete">🗑️</button>
        </div>
      )}
    </div>
  );
}

const face      = { position:'absolute', inset:0, backfaceVisibility:'hidden', borderRadius:14, border:'1px solid #e2e8f0', display:'flex', flexDirection:'column', padding:'1.1rem', background:'white', boxShadow:'0 2px 10px rgba(0,0,0,0.06)' };
const badge     = { fontSize:'0.65rem', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.06em', padding:'0.2rem 0.55rem', borderRadius:50 };
const qText     = { flex:1, fontSize:'0.95rem', fontWeight:600, lineHeight:1.55, color:'#1e293b', overflow:'hidden', display:'-webkit-box', WebkitLineClamp:4, WebkitBoxOrient:'vertical' };
const actionBtn = { width:30, height:30, background:'white', border:'1px solid #e2e8f0', borderRadius:8, cursor:'pointer', fontSize:'0.8rem', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 2px 8px rgba(0,0,0,0.1)' };
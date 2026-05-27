import { useState } from 'react';
import api from '../services/api';
import { calcPercent } from '../utils/helpers';

export default function QuizMode({ cards, onClose }) {
  const [index,    setIndex]    = useState(0);
  const [score,    setScore]    = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [done,     setDone]     = useState(false);

  if (!cards.length) return (
    <div style={overlay}>
      <button onClick={onClose} style={closeBtn}>✕ Exit</button>
      <p style={{ color:'#64748b' }}>No cards available! Add some cards first.</p>
    </div>
  );

  const card  = cards[index];
  const total = cards.length;
  const pct   = Math.round(((index + 1) / total) * 100);

  const handleAnswer = async (correct) => {
    const newScore = correct ? score + 1 : score;
    if (correct) setScore(s => s + 1);
    if (index + 1 >= total) {
      setDone(true);
      try { await api.post('/quiz/submit', { score: newScore, total }); } catch {}
    } else {
      setIndex(i => i + 1);
      setRevealed(false);
    }
  };

  if (done) {
    const finalPct = calcPercent(score, total);
    const emoji    = finalPct >= 80 ? '🎉' : finalPct >= 50 ? '👍' : '📚';
    return (
      <div style={overlay}>
        <div style={resultBox}>
          <div style={{ fontSize:'3.5rem', marginBottom:16 }}>{emoji}</div>
          <h2 style={{ fontWeight:800, fontSize:'1.6rem', color:'#1e293b', marginBottom:8 }}>Quiz Complete!</h2>
          <div style={{ fontSize:'2.5rem', fontWeight:900, color:'#2563eb', marginBottom:6 }}>{score}/{total}</div>
          <p style={{ color:'#94a3b8', marginBottom:24 }}>{finalPct}% correct</p>
          <div style={{ display:'flex', gap:12, justifyContent:'center' }}>
            <button onClick={onClose} style={ghostBtn}>Back to Cards</button>
            <button onClick={() => { setIndex(0); setScore(0); setDone(false); setRevealed(false); }} style={primaryBtn}>Try Again</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={overlay}>
      <button onClick={onClose} style={closeBtn}>✕ Exit Quiz</button>
      <div style={{ width:'100%', maxWidth:580, marginBottom:24 }}>
        <div style={{ display:'flex', justifyContent:'space-between', marginBottom:8 }}>
          <span style={pLabel}>Question {index + 1} of {total}</span>
          <span style={{ ...pLabel, color:'#2563eb' }}>Score: {score}</span>
        </div>
        <div style={{ height:6, background:'#e2e8f0', borderRadius:50, overflow:'hidden' }}>
          <div style={{ height:'100%', width:`${pct}%`, background:'#2563eb', borderRadius:50, transition:'width 0.4s ease' }} />
        </div>
      </div>
      <div style={quizCard}>
        <div style={{ display:'flex', gap:8, marginBottom:16, justifyContent:'center' }}>
          <span style={catBadge}>{card.category}</span>
          <span style={catBadge}>{card.difficulty}</span>
        </div>
        <p style={{ fontSize:'1.15rem', fontWeight:600, lineHeight:1.65, color:'#1e293b', textAlign:'center', marginBottom:24 }}>{card.question}</p>
        {!revealed ? (
          <button onClick={() => setRevealed(true)} style={primaryBtn}>Reveal Answer</button>
        ) : (
          <>
            <div style={{ background:'#eff6ff', borderRadius:12, padding:'1rem', marginBottom:20, width:'100%', borderLeft:'3px solid #2563eb' }}>
              <p style={{ fontSize:'0.68rem', fontWeight:700, textTransform:'uppercase', color:'#2563eb', marginBottom:4 }}>Answer</p>
              <p style={{ color:'#1e293b', fontWeight:500, lineHeight:1.6 }}>{card.answer}</p>
            </div>
            <p style={{ color:'#64748b', fontSize:'0.875rem', marginBottom:12, fontWeight:600 }}>Did you get it right?</p>
            <div style={{ display:'flex', gap:12 }}>
              <button onClick={() => handleAnswer(false)} style={{ ...ghostBtn, color:'#ef4444', borderColor:'#fca5a5' }}>✗ Got it wrong</button>
              <button onClick={() => handleAnswer(true)} style={{ ...primaryBtn, background:'#16a34a' }}>✓ Got it right</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

const overlay   = { position:'fixed', inset:0, background:'#f8fafc', zIndex:150, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'2rem' };
const closeBtn  = { position:'fixed', top:20, right:20, background:'white', border:'1px solid #e2e8f0', borderRadius:50, padding:'0.5rem 1rem', fontWeight:600, fontSize:'0.875rem', cursor:'pointer', fontFamily:'inherit', color:'#64748b' };
const pLabel    = { fontSize:'0.75rem', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.08em', color:'#94a3b8' };
const quizCard  = { background:'white', borderRadius:20, padding:'2rem', width:'100%', maxWidth:560, boxShadow:'0 8px 32px rgba(0,0,0,0.08)', display:'flex', flexDirection:'column', alignItems:'center' };
const resultBox = { background:'white', borderRadius:20, padding:'2.5rem', maxWidth:380, width:'100%', textAlign:'center', boxShadow:'0 8px 32px rgba(0,0,0,0.1)' };
const catBadge  = { fontSize:'0.65rem', fontWeight:700, textTransform:'uppercase', padding:'0.2rem 0.6rem', borderRadius:50, background:'#eff6ff', color:'#2563eb' };
const primaryBtn = { background:'#2563eb', color:'white', border:'none', borderRadius:50, padding:'0.65rem 1.4rem', fontWeight:700, fontSize:'0.9rem', cursor:'pointer', fontFamily:'inherit' };
const ghostBtn   = { background:'white', color:'#475569', border:'1px solid #e2e8f0', borderRadius:50, padding:'0.65rem 1.2rem', fontWeight:600, fontSize:'0.9rem', cursor:'pointer', fontFamily:'inherit' };

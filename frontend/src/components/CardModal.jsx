import { useState, useEffect } from 'react';

export default function CardModal({ card, onSave, onClose }) {
  const [form,   setForm]   = useState({ question:'', answer:'', category:'General', difficulty:'Medium' });
  const [error,  setError]  = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (card) setForm({ question:card.question, answer:card.answer, category:card.category, difficulty:card.difficulty });
  }, [card]);

  const set = (k, v) => setForm(f => ({ ...f, [k]:v }));

  const handleSave = async () => {
    if (!form.question.trim() || !form.answer.trim()) { setError('Question and answer are required'); return; }
    setSaving(true); setError('');
    try { await onSave(form); onClose(); }
    catch (err) { setError(err.response?.data?.error || 'Failed to save'); }
    finally { setSaving(false); }
  };

  return (
    <div style={overlay} onClick={onClose}>
      <div style={modal} onClick={e => e.stopPropagation()}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20 }}>
          <h2 style={{ fontWeight:800, fontSize:'1.15rem', color:'#1e293b' }}>{card ? 'Edit Flashcard' : 'New Flashcard'}</h2>
          <button onClick={onClose} style={iconBtn}>✕</button>
        </div>
        {error && <div style={errBox}>{error}</div>}
        <label style={lbl}>Question *</label>
        <textarea style={inp} rows={3} value={form.question} onChange={e => set('question', e.target.value)} placeholder="What do you want to remember?" />
        <label style={lbl}>Answer *</label>
        <textarea style={inp} rows={3} value={form.answer} onChange={e => set('answer', e.target.value)} placeholder="The answer..." />
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
          <div>
            <label style={lbl}>Category</label>
            <input style={{ ...inp, resize:'none' }} value={form.category} onChange={e => set('category', e.target.value)} placeholder="e.g. Biology" />
          </div>
          <div>
            <label style={lbl}>Difficulty</label>
            <select style={inp} value={form.difficulty} onChange={e => set('difficulty', e.target.value)}>
              <option value="Easy">🟢 Easy</option>
              <option value="Medium">🟡 Medium</option>
              <option value="Hard">🔴 Hard</option>
            </select>
          </div>
        </div>
        <div style={{ display:'flex', gap:10, justifyContent:'flex-end', marginTop:20 }}>
          <button onClick={onClose} style={ghostBtn}>Cancel</button>
          <button onClick={handleSave} disabled={saving} style={primaryBtn}>{saving ? 'Saving...' : 'Save Card'}</button>
        </div>
      </div>
    </div>
  );
}

const overlay    = { position:'fixed', inset:0, background:'rgba(15,23,42,0.5)', backdropFilter:'blur(8px)', zIndex:200, display:'flex', alignItems:'center', justifyContent:'center', padding:'1rem' };
const modal      = { background:'white', borderRadius:20, padding:'1.75rem', width:'100%', maxWidth:500, boxShadow:'0 20px 60px rgba(0,0,0,0.15)' };
const lbl        = { display:'block', fontSize:'0.72rem', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.07em', color:'#64748b', marginBottom:5, marginTop:12 };
const inp        = { width:'100%', background:'#f8fafc', border:'1.5px solid #e2e8f0', borderRadius:10, padding:'0.65rem 0.9rem', color:'#1e293b', fontFamily:'inherit', fontSize:'0.9rem', outline:'none', resize:'vertical', boxSizing:'border-box' };
const iconBtn    = { background:'#f8fafc', border:'1px solid #e2e8f0', borderRadius:8, width:32, height:32, cursor:'pointer', fontSize:'0.85rem', color:'#94a3b8' };
const errBox     = { background:'#fee2e2', border:'1px solid #fca5a5', borderRadius:8, padding:'0.7rem', color:'#dc2626', fontSize:'0.85rem', marginBottom:4 };
const primaryBtn = { background:'#2563eb', color:'white', border:'none', borderRadius:50, padding:'0.6rem 1.4rem', fontWeight:700, fontSize:'0.875rem', cursor:'pointer', fontFamily:'inherit' };
const ghostBtn   = { background:'white', color:'#64748b', border:'1px solid #e2e8f0', borderRadius:50, padding:'0.6rem 1.2rem', fontWeight:600, fontSize:'0.875rem', cursor:'pointer', fontFamily:'inherit' };

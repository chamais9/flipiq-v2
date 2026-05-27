import { useState, useMemo, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useFlashcards } from '../hooks/useFlashcards';
import FlashCard from '../components/FlashCard';
import CardModal from '../components/CardModal';
import StudyMode from '../components/StudyMode';
import QuizMode  from '../components/QuizMode';
import { getDailyQuote } from '../utils/helpers';
import api from '../services/api';

const DAILY_GOAL = 10;

export default function DashboardPage() {
  const { user } = useAuth();
  const [search,     setSearch]     = useState('');
  const [category,   setCategory]   = useState('All');
  const [difficulty, setDifficulty] = useState('All');
  const [showModal,  setShowModal]  = useState(false);
  const [editCard,   setEditCard]   = useState(null);
  const [deleteId,   setDeleteId]   = useState(null);
  const [studyMode,  setStudyMode]  = useState(false);
  const [quizMode,   setQuizMode]   = useState(false);
  const [todayCount, setTodayCount] = useState(0);

  const quote = getDailyQuote();
  const filters = useMemo(() => ({ q:search, category, difficulty }), [search, category, difficulty]);
  const { cards, loading, error, create, update, remove, reveal } = useFlashcards(filters);

  useEffect(() => {
    api.get('/quiz/today').then(r => setTodayCount(r.data.count)).catch(() => {});
  }, [cards]);

  const categories   = useMemo(() => ['All', ...new Set(cards.map(c => c.category))], [cards]);
  const totalRevealed = cards.reduce((s, c) => s + (c.timesRevealed || 0), 0);
  const goalPct       = Math.min(Math.round((todayCount / DAILY_GOAL) * 100), 100);

  const handleSave = async (form) => {
    if (editCard) await update(editCard.id, form);
    else await create(form);
    setShowModal(false);
    setEditCard(null);
  };

  const handleDelete = async () => {
    await remove(deleteId);
    setDeleteId(null);
  };

  return (
    <div style={page}>
      <div style={container}>

        <div style={quoteBanner}>
          <div>
            <p style={{ fontSize:'0.68rem', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.1em', color:'rgba(255,255,255,0.6)', marginBottom:6 }}>Today's Quote</p>
            <p style={{ fontSize:'1rem', fontWeight:600, color:'white', lineHeight:1.5, fontStyle:'italic' }}>"{quote.quote}"</p>
            <p style={{ fontSize:'0.8rem', color:'rgba(255,255,255,0.65)', marginTop:6 }}>— {quote.author}</p>
          </div>
          <span style={{ fontSize:'3rem', flexShrink:0 }}>💡</span>
        </div>

        <div style={statsRow}>
          <div style={statCard}><span style={{ fontSize:'1.5rem' }}>🃏</span><div><p style={{ ...statNum, color:'#2563eb' }}>{cards.length}</p><p style={statLbl}>Total Cards</p></div></div>
          <div style={statCard}><span style={{ fontSize:'1.5rem' }}>📂</span><div><p style={{ ...statNum, color:'#7c3aed' }}>{categories.length - 1}</p><p style={statLbl}>Categories</p></div></div>
          <div style={statCard}><span style={{ fontSize:'1.5rem' }}>👀</span><div><p style={{ ...statNum, color:'#d97706' }}>{totalRevealed}</p><p style={statLbl}>Revealed</p></div></div>
          <div style={{ ...statCard, flexDirection:'column', alignItems:'flex-start', gap:8 }}>
            <div style={{ display:'flex', justifyContent:'space-between', width:'100%' }}>
              <span style={{ fontSize:'0.85rem', fontWeight:700, color:'#1e293b' }}>🎯 Daily Goal</span>
              <span style={{ fontSize:'0.78rem', fontWeight:700, color:'#0f9b8e' }}>{todayCount}/{DAILY_GOAL}</span>
            </div>
            <div style={{ width:'100%', height:6, background:'#e2e8f0', borderRadius:50, overflow:'hidden' }}>
              <div style={{ height:'100%', width:`${goalPct}%`, background:'#0f9b8e', borderRadius:50, transition:'width 0.5s ease' }} />
            </div>
            <p style={{ fontSize:'0.72rem', color:'#94a3b8' }}>{goalPct >= 100 ? '✅ Goal reached!' : `${DAILY_GOAL - todayCount} more to go`}</p>
          </div>
        </div>

        <div style={controls}>
          <div style={{ flex:1, minWidth:200, position:'relative' }}>
            <span style={{ position:'absolute', left:12, top:'50%', transform:'translateY(-50%)', color:'#94a3b8' }}>🔍</span>
            <input style={{ ...filterInp, paddingLeft:36 }} placeholder="Search cards..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <select style={filterInp} value={category} onChange={e => setCategory(e.target.value)}>
            {categories.map(c => <option key={c}>{c}</option>)}
          </select>
          <select style={filterInp} value={difficulty} onChange={e => setDifficulty(e.target.value)}>
            {['All','Easy','Medium','Hard'].map(d => <option key={d}>{d}</option>)}
          </select>
          <button onClick={() => setStudyMode(true)} style={ghostBtn}>⚡ Study</button>
          <button onClick={() => setQuizMode(true)}  style={ghostBtn}>🧠 Quiz</button>
          <button onClick={() => { setEditCard(null); setShowModal(true); }} style={primaryBtn}>+ New Card</button>
        </div>

        {error && <div style={errBox}>⚠️ {error}</div>}

        {loading ? (
          <div style={{ textAlign:'center', padding:'4rem', color:'#94a3b8' }}>Loading your cards...</div>
        ) : cards.length === 0 ? (
          <div style={{ textAlign:'center', padding:'5rem 1rem' }}>
            <div style={{ fontSize:'4rem', marginBottom:16 }}>📭</div>
            <h3 style={{ fontWeight:800, color:'#1e293b', marginBottom:8 }}>{search || category !== 'All' ? 'No cards match' : 'No cards yet!'}</h3>
            <p style={{ color:'#94a3b8' }}>{search || category !== 'All' ? 'Try clearing your filters.' : 'Click + New Card to get started.'}</p>
          </div>
        ) : (
          <div style={grid}>
            {cards.map(card => (
              <FlashCard key={card.id} card={card}
                onEdit={c => { setEditCard(c); setShowModal(true); }}
                onDelete={setDeleteId}
                onReveal={reveal}
              />
            ))}
          </div>
        )}
      </div>

      {showModal && <CardModal card={editCard} onSave={handleSave} onClose={() => { setShowModal(false); setEditCard(null); }} />}

      {deleteId && (
        <div style={overlay} onClick={() => setDeleteId(null)}>
          <div style={confirmBox} onClick={e => e.stopPropagation()}>
            <div style={{ fontSize:'2.5rem', marginBottom:12 }}>🗑️</div>
            <h3 style={{ fontWeight:800, marginBottom:8, color:'#1e293b' }}>Delete this card?</h3>
            <p style={{ color:'#94a3b8', marginBottom:20, fontSize:'0.9rem' }}>This cannot be undone.</p>
            <div style={{ display:'flex', gap:10, justifyContent:'center' }}>
              <button onClick={() => setDeleteId(null)} style={ghostBtn}>Keep it</button>
              <button onClick={handleDelete} style={{ ...primaryBtn, background:'#ef4444' }}>Delete</button>
            </div>
          </div>
        </div>
      )}

      {studyMode && <StudyMode cards={cards} onClose={() => setStudyMode(false)} onReveal={reveal} />}
      {quizMode  && <QuizMode  cards={cards} onClose={() => setQuizMode(false)} />}
    </div>
  );
}

const page        = { minHeight:'100vh', background:'#f8fafc' };
const container   = { maxWidth:1080, margin:'0 auto', padding:'2rem 1.5rem' };
const quoteBanner = { background:'linear-gradient(135deg,#1e40af,#2563eb)', borderRadius:20, padding:'1.5rem 2rem', marginBottom:20, display:'flex', alignItems:'center', justifyContent:'space-between', gap:16 };
const statsRow    = { display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:12, marginBottom:20 };
const statCard    = { background:'white', borderRadius:14, padding:'1.1rem', border:'1px solid #e2e8f0', display:'flex', alignItems:'center', gap:12 };
const statNum     = { fontSize:'1.75rem', fontWeight:900, lineHeight:1, letterSpacing:'-0.03em' };
const statLbl     = { fontSize:'0.7rem', color:'#94a3b8', fontWeight:600, textTransform:'uppercase', letterSpacing:'0.06em', marginTop:2 };
const controls    = { display:'flex', gap:8, marginBottom:20, flexWrap:'wrap', alignItems:'center' };
const filterInp   = { background:'white', border:'1px solid #e2e8f0', borderRadius:50, padding:'0.6rem 1rem', color:'#1e293b', fontFamily:'inherit', fontSize:'0.875rem', outline:'none' };
const grid        = { display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(300px,1fr))', gap:16 };
const primaryBtn  = { background:'#2563eb', color:'white', border:'none', borderRadius:50, padding:'0.6rem 1.2rem', fontWeight:700, fontSize:'0.875rem', cursor:'pointer', fontFamily:'inherit', whiteSpace:'nowrap' };
const ghostBtn    = { background:'white', color:'#475569', border:'1px solid #e2e8f0', borderRadius:50, padding:'0.6rem 1rem', fontWeight:600, fontSize:'0.875rem', cursor:'pointer', fontFamily:'inherit', whiteSpace:'nowrap' };
const overlay     = { position:'fixed', inset:0, background:'rgba(15,23,42,0.5)', backdropFilter:'blur(8px)', zIndex:200, display:'flex', alignItems:'center', justifyContent:'center' };
const confirmBox  = { background:'white', borderRadius:20, padding:'2rem', maxWidth:360, width:'100%', textAlign:'center' };
const errBox      = { background:'#fee2e2', border:'1px solid #fca5a5', borderRadius:10, padding:'0.9rem', color:'#dc2626', marginBottom:16, fontSize:'0.875rem' };

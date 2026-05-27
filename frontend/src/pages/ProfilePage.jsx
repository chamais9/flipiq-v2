import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useAuth } from '../context/AuthContext';
import { getInitials, formatDate, calcPercent } from '../utils/helpers';
import api from '../services/api';

export default function ProfilePage() {
  const { user, updateUser } = useAuth();
  const [quizHistory,   setQuizHistory]   = useState([]);
  const [sharedDecks,   setSharedDecks]   = useState([]);
  const [editMode,      setEditMode]      = useState(false);
  const [form,          setForm]          = useState({ name:'', bio:'', university:'' });
  const [shareCategory, setShareCategory] = useState('');
  const [shareCode,     setShareCode]     = useState('');
  const [importCode,    setImportCode]    = useState('');
  const [importMsg,     setImportMsg]     = useState('');
  const [saving,        setSaving]        = useState(false);
  const [error,         setError]         = useState('');

  useEffect(() => {
    if (user) setForm({ name:user.name, bio:user.bio||'', university:user.university||'' });
    api.get('/quiz/history').then(r => setQuizHistory(r.data.data)).catch(() => {});
    api.get('/share/my').then(r => setSharedDecks(r.data.data)).catch(() => {});
  }, [user]);

  const chartData = [...quizHistory].reverse().map((q, i) => ({
    name: `Quiz ${i + 1}`,
    score: calcPercent(q.score, q.total),
  }));

  const handleSaveProfile = async () => {
    setSaving(true); setError('');
    try {
      const { data } = await api.put('/auth/profile', form);
      updateUser(data.user);
      setEditMode(false);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save');
    } finally { setSaving(false); }
  };

  const handleShare = async () => {
    if (!shareCategory.trim()) return;
    try {
      const { data } = await api.post('/share', { category: shareCategory });
      setShareCode(data.shareCode);
      const updated = await api.get('/share/my');
      setSharedDecks(updated.data.data);
    } catch { setError('Failed to create share code'); }
  };

  const handleImport = async () => {
    if (!importCode.trim()) return;
    try {
      const { data } = await api.post(`/share/${importCode.trim()}/import`);
      setImportMsg(data.message);
      setImportCode('');
    } catch (err) {
      setImportMsg(err.response?.data?.error || 'Invalid share code');
    }
  };

  const handleUnshare = async (id) => {
    await api.delete(`/share/${id}`);
    setSharedDecks(prev => prev.filter(d => d.id !== id));
  };

  if (!user) return null;

  return (
    <div style={page}>
      <div style={container}>

        <div style={profileHeader}>
          <div style={avatarStyle}>{getInitials(user.name)}</div>
          <div style={{ flex:1 }}>
            {editMode ? (
              <>
                <input style={inp} value={form.name} onChange={e => setForm(f=>({...f,name:e.target.value}))} placeholder="Full name" />
                <input style={{ ...inp, marginTop:8 }} value={form.university} onChange={e => setForm(f=>({...f,university:e.target.value}))} placeholder="University" />
                <textarea style={{ ...inp, marginTop:8, resize:'vertical' }} rows={2} value={form.bio} onChange={e => setForm(f=>({...f,bio:e.target.value}))} placeholder="Short bio (optional)" />
                {error && <p style={{ color:'#dc2626', fontSize:'0.85rem', marginTop:6 }}>{error}</p>}
                <div style={{ display:'flex', gap:8, marginTop:10 }}>
                  <button onClick={handleSaveProfile} disabled={saving} style={primaryBtn}>{saving ? 'Saving...' : 'Save'}</button>
                  <button onClick={() => setEditMode(false)} style={ghostBtn}>Cancel</button>
                </div>
              </>
            ) : (
              <>
                <h1 style={{ fontWeight:900, fontSize:'1.5rem', color:'#1e293b' }}>{user.name}</h1>
                {user.university && <p style={{ color:'#2563eb', fontWeight:600, fontSize:'0.875rem', marginTop:2 }}>🎓 {user.university}</p>}
                <p style={{ color:'#64748b', fontSize:'0.875rem', marginTop:4 }}>{user.email}</p>
                {user.bio && <p style={{ color:'#475569', fontSize:'0.9rem', marginTop:8, lineHeight:1.6 }}>{user.bio}</p>}
                <p style={{ color:'#94a3b8', fontSize:'0.78rem', marginTop:8 }}>Member since {formatDate(user.createdAt)}</p>
                <button onClick={() => setEditMode(true)} style={{ ...ghostBtn, marginTop:12 }}>✏️ Edit Profile</button>
              </>
            )}
          </div>
        </div>

        <div style={section}>
          <h2 style={sTitle}>📊 Quiz History</h2>
          {chartData.length === 0 ? (
            <p style={{ color:'#94a3b8', padding:'1.5rem 0' }}>No quiz results yet. Take a quiz from your dashboard!</p>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={chartData} margin={{ top:5, right:10, left:-20, bottom:5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{ fontSize:12, fill:'#94a3b8' }} />
                <YAxis domain={[0,100]} tick={{ fontSize:12, fill:'#94a3b8' }} />
                <Tooltip formatter={val => [`${val}%`, 'Score']} contentStyle={{ borderRadius:10, border:'1px solid #e2e8f0', fontSize:'0.85rem' }} />
                <Bar dataKey="score" fill="#2563eb" radius={[6,6,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        <div style={section}>
          <h2 style={sTitle}>🔗 Share a Deck</h2>
          <p style={{ color:'#64748b', fontSize:'0.875rem', marginBottom:16 }}>Share a category of cards with other registered students using a unique code.</p>
          <div style={{ display:'flex', gap:8, marginBottom:12, flexWrap:'wrap' }}>
            <input style={{ ...inp, flex:1, minWidth:160 }} placeholder="Category to share (e.g. Biology)" value={shareCategory} onChange={e => setShareCategory(e.target.value)} />
            <button onClick={handleShare} style={primaryBtn}>Generate Code</button>
          </div>
          {shareCode && (
            <div style={codeBox}>
              <p style={{ fontSize:'0.78rem', color:'#0f766e', fontWeight:700, marginBottom:4 }}>Share code generated!</p>
              <p style={{ fontSize:'1.5rem', fontWeight:900, color:'#134e4a', letterSpacing:'0.1em' }}>{shareCode}</p>
            </div>
          )}
          {sharedDecks.length > 0 && (
            <div style={{ marginTop:16 }}>
              <p style={{ fontWeight:700, fontSize:'0.85rem', color:'#475569', marginBottom:8 }}>Your shared decks:</p>
              {sharedDecks.map(deck => (
                <div key={deck.id} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'0.6rem 0.9rem', background:'#f8fafc', borderRadius:10, marginBottom:6, border:'1px solid #e2e8f0' }}>
                  <div>
                    <span style={{ fontWeight:600, fontSize:'0.875rem', color:'#1e293b' }}>{deck.category}</span>
                    <span style={{ marginLeft:10, fontWeight:700, fontSize:'0.8rem', color:'#0f766e', background:'#f0fdfa', padding:'0.15rem 0.5rem', borderRadius:6 }}>{deck.shareCode}</span>
                  </div>
                  <button onClick={() => handleUnshare(deck.id)} style={{ ...ghostBtn, fontSize:'0.78rem', padding:'0.3rem 0.7rem', color:'#ef4444', borderColor:'#fca5a5' }}>Remove</button>
                </div>
              ))}
            </div>
          )}
          <div style={{ marginTop:24, paddingTop:20, borderTop:'1px solid #f1f5f9' }}>
            <p style={{ fontWeight:700, fontSize:'0.875rem', color:'#475569', marginBottom:8 }}>Import someone's deck:</p>
            <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
              <input style={{ ...inp, flex:1, minWidth:160 }} placeholder="Enter share code" value={importCode} onChange={e => setImportCode(e.target.value.toUpperCase())} maxLength={8} />
              <button onClick={handleImport} style={primaryBtn}>Import Deck</button>
            </div>
            {importMsg && <p style={{ fontSize:'0.85rem', marginTop:8, color: importMsg.includes('Imported') ? '#16a34a' : '#dc2626', fontWeight:600 }}>{importMsg}</p>}
          </div>
        </div>

      </div>
    </div>
  );
}

const page          = { minHeight:'100vh', background:'#f8fafc' };
const container     = { maxWidth:800, margin:'0 auto', padding:'2rem 1.5rem' };
const profileHeader = { background:'white', borderRadius:20, padding:'2rem', marginBottom:20, display:'flex', gap:20, alignItems:'flex-start', border:'1px solid #e2e8f0' };
const avatarStyle   = { width:72, height:72, borderRadius:'50%', background:'linear-gradient(135deg,#2563eb,#7c3aed)', color:'white', fontSize:'1.4rem', fontWeight:800, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 };
const section       = { background:'white', borderRadius:20, padding:'1.75rem', marginBottom:20, border:'1px solid #e2e8f0' };
const sTitle        = { fontWeight:800, fontSize:'1.05rem', color:'#1e293b', marginBottom:16 };
const inp           = { width:'100%', background:'#f8fafc', border:'1.5px solid #e2e8f0', borderRadius:10, padding:'0.65rem 0.9rem', color:'#1e293b', fontFamily:'inherit', fontSize:'0.9rem', outline:'none', boxSizing:'border-box' };
const primaryBtn    = { background:'#2563eb', color:'white', border:'none', borderRadius:50, padding:'0.6rem 1.2rem', fontWeight:700, fontSize:'0.875rem', cursor:'pointer', fontFamily:'inherit', whiteSpace:'nowrap' };
const ghostBtn      = { background:'white', color:'#475569', border:'1px solid #e2e8f0', borderRadius:50, padding:'0.6rem 1.1rem', fontWeight:600, fontSize:'0.875rem', cursor:'pointer', fontFamily:'inherit', whiteSpace:'nowrap' };
const codeBox       = { background:'#f0fdfa', border:'2px dashed #0f9b8e', borderRadius:12, padding:'1.25rem', textAlign:'center', marginTop:8 };

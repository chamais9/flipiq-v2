import { useState, useEffect } from 'react';
import { getInitials, formatDate } from '../utils/helpers';
import api from '../services/api';

export default function AdminPage() {
  const [users,     setUsers]     = useState([]);
  const [activity,  setActivity]  = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [tab,       setTab]       = useState('users');
  const [selected,  setSelected]  = useState(null);
  const [userCards, setUserCards] = useState([]);
  const [error,     setError]     = useState('');

  useEffect(() => {
    Promise.all([api.get('/admin/users'), api.get('/admin/activity')])
      .then(([u, a]) => { setUsers(u.data.data); setActivity(a.data.data); })
      .catch(() => setError('Failed to load admin data'))
      .finally(() => setLoading(false));
  }, []);

  const viewCards = async (user) => {
    setSelected(user);
    const { data } = await api.get(`/admin/users/${user.id}/cards`);
    setUserCards(data.data);
  };

  const deleteUser = async (id) => {
    if (!window.confirm('Delete this user and all their data?')) return;
    try {
      await api.delete(`/admin/users/${id}`);
      setUsers(prev => prev.filter(u => u.id !== id));
      if (selected?.id === id) setSelected(null);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to delete user');
    }
  };

  if (loading) return <div style={loadPage}>Loading...</div>;

  return (
    <div style={page}>
      <div style={container}>
        <div style={banner}>
          <div>
            <h1 style={{ fontWeight:900, fontSize:'1.4rem', color:'white' }}>Admin Dashboard 🛡️</h1>
            <p style={{ color:'rgba(255,255,255,0.7)', fontSize:'0.875rem', marginTop:2 }}>Manage users and monitor activity</p>
          </div>
          <div style={{ display:'flex', gap:24 }}>
            <div style={{ textAlign:'center' }}><p style={{ fontSize:'1.8rem', fontWeight:900, color:'white' }}>{users.length}</p><p style={{ fontSize:'0.7rem', color:'rgba(255,255,255,0.6)', textTransform:'uppercase' }}>Users</p></div>
            <div style={{ textAlign:'center' }}><p style={{ fontSize:'1.8rem', fontWeight:900, color:'white' }}>{users.reduce((s,u)=>s+u.cardCount,0)}</p><p style={{ fontSize:'0.7rem', color:'rgba(255,255,255,0.6)', textTransform:'uppercase' }}>Cards</p></div>
          </div>
        </div>

        {error && <div style={errBox}>{error}</div>}

        <div style={tabRow}>
          {['users','activity'].map(t => (
            <button key={t} onClick={() => setTab(t)} style={{ ...tabBtn, ...(tab===t ? activeTab:{}) }}>
              {t === 'users' ? '👥 Users' : '📋 Activity'}
            </button>
          ))}
        </div>

        {tab === 'users' && (
          <div style={{ display:'grid', gridTemplateColumns:selected?'1fr 1fr':'1fr', gap:16 }}>
            <div style={tCard}>
              <h3 style={tTitle}>All Users</h3>
              <table style={{ width:'100%', borderCollapse:'collapse' }}>
                <thead><tr>{['User','Role','Cards','Joined',''].map(h=><th key={h} style={th}>{h}</th>)}</tr></thead>
                <tbody>
                  {users.map(u => (
                    <tr key={u.id} style={{ background:selected?.id===u.id?'#eff6ff':'white' }}>
                      <td style={td}>
                        <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                          <div style={{ ...miniAv, background:u.role==='admin'?'#7c3aed':'#2563eb' }}>{getInitials(u.name)}</div>
                          <div><p style={{ fontWeight:600, fontSize:'0.875rem', margin:0 }}>{u.name}</p><p style={{ fontSize:'0.75rem', color:'#94a3b8', margin:0 }}>{u.email}</p></div>
                        </div>
                      </td>
                      <td style={td}><span style={{ fontSize:'0.68rem', fontWeight:700, textTransform:'uppercase', padding:'0.2rem 0.55rem', borderRadius:50, background:u.role==='admin'?'#ede9fe':'#dbeafe', color:u.role==='admin'?'#7c3aed':'#2563eb' }}>{u.role}</span></td>
                      <td style={td}>{u.cardCount}</td>
                      <td style={td}>{formatDate(u.createdAt)}</td>
                      <td style={td}>
                        <button onClick={()=>viewCards(u)} style={smBtn}>View</button>
                        {u.role!=='admin'&&<button onClick={()=>deleteUser(u.id)} style={{ ...smBtn, color:'#ef4444', borderColor:'#fca5a5', marginLeft:4 }}>Del</button>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {selected && (
              <div style={tCard}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:14 }}>
                  <h3 style={tTitle}>{selected.name}'s Cards ({userCards.length})</h3>
                  <button onClick={()=>setSelected(null)} style={smBtn}>✕</button>
                </div>
                {userCards.length===0 ? <p style={{ color:'#94a3b8', textAlign:'center', padding:'2rem' }}>No cards yet</p> : userCards.map(c => (
                  <div key={c.id} style={{ padding:'0.75rem', border:'1px solid #f1f5f9', borderRadius:10, marginBottom:8 }}>
                    <p style={{ fontWeight:600, fontSize:'0.875rem', marginBottom:3, color:'#1e293b' }}>{c.question}</p>
                    <p style={{ fontSize:'0.78rem', color:'#94a3b8' }}>{c.category} · {c.difficulty}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {tab === 'activity' && (
          <div style={tCard}>
            <h3 style={tTitle}>Recent Activity</h3>
            <table style={{ width:'100%', borderCollapse:'collapse' }}>
              <thead><tr>{['User','Action','Time'].map(h=><th key={h} style={th}>{h}</th>)}</tr></thead>
              <tbody>
                {activity.map(a => (
                  <tr key={a.id}>
                    <td style={td}><p style={{ fontWeight:600, fontSize:'0.875rem', margin:0 }}>{a.name}</p><p style={{ fontSize:'0.75rem', color:'#94a3b8', margin:0 }}>{a.email}</p></td>
                    <td style={td}><span style={{ background:'#eff6ff', color:'#2563eb', padding:'0.2rem 0.6rem', borderRadius:50, fontSize:'0.75rem', fontWeight:700 }}>{a.action}</span></td>
                    <td style={td}>{formatDate(a.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

const page     = { minHeight:'100vh', background:'#f8fafc' };
const container = { maxWidth:1080, margin:'0 auto', padding:'2rem 1.5rem' };
const banner   = { background:'linear-gradient(135deg,#1e1b4b,#3730a3)', borderRadius:20, padding:'1.75rem 2rem', marginBottom:20, display:'flex', justifyContent:'space-between', alignItems:'center' };
const tCard    = { background:'white', borderRadius:16, padding:'1.5rem', border:'1px solid #e2e8f0' };
const tTitle   = { fontWeight:800, fontSize:'1rem', color:'#1e293b', marginBottom:14 };
const th       = { textAlign:'left', fontSize:'0.7rem', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.07em', color:'#94a3b8', padding:'0.5rem 0.75rem', borderBottom:'1px solid #f1f5f9' };
const td       = { padding:'0.75rem', fontSize:'0.875rem', color:'#475569', borderBottom:'1px solid #f8fafc', verticalAlign:'middle' };
const tabRow   = { display:'flex', gap:4, background:'white', border:'1px solid #e2e8f0', borderRadius:50, padding:4, marginBottom:16, width:'fit-content' };
const tabBtn   = { padding:'0.5rem 1.1rem', borderRadius:50, border:'none', background:'transparent', cursor:'pointer', fontFamily:'inherit', fontWeight:600, fontSize:'0.875rem', color:'#94a3b8' };
const activeTab = { background:'#2563eb', color:'white' };
const smBtn    = { background:'white', border:'1px solid #e2e8f0', borderRadius:8, padding:'0.3rem 0.7rem', cursor:'pointer', fontSize:'0.78rem', fontWeight:600, color:'#475569', fontFamily:'inherit' };
const miniAv   = { width:30, height:30, borderRadius:'50%', color:'white', fontSize:'0.68rem', fontWeight:700, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 };
const errBox   = { background:'#fee2e2', border:'1px solid #fca5a5', borderRadius:10, padding:'0.9rem', color:'#dc2626', marginBottom:16, fontSize:'0.875rem' };
const loadPage = { minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', color:'#94a3b8' };

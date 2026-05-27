import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const [form,    setForm]    = useState({ email:'', password:'' });
  const [error,   setError]   = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate  = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      const user = await login(form.email, form.password);
      navigate(user.role === 'admin' ? '/admin' : '/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed. Please check your credentials.');
    } finally { setLoading(false); }
  };

  return (
    <div style={page}>
      <div style={card}>
        <div style={{ textAlign:'center', marginBottom:28 }}>
          <div style={logoMark}>📚</div>
          <h1 style={{ fontWeight:900, fontSize:'1.6rem', color:'#1e293b', margin:'14px 0 4px' }}>Welcome back</h1>
          <p style={{ color:'#94a3b8', fontSize:'0.9rem' }}>Sign in to continue studying</p>
        </div>
        {error && <div style={errBox}>{error}</div>}
        <form onSubmit={handleSubmit}>
          <label style={lbl}>Email</label>
          <input style={inp} type="email" placeholder="you@university.edu.au" value={form.email} onChange={e => setForm(f => ({...f, email:e.target.value}))} required />
          <label style={lbl}>Password</label>
          <input style={inp} type="password" placeholder="••••••••" value={form.password} onChange={e => setForm(f => ({...f, password:e.target.value}))} required />
          <button type="submit" disabled={loading} style={primaryBtn}>{loading ? 'Signing in...' : 'Sign In'}</button>
        </form>
        <p style={{ textAlign:'center', marginTop:18, color:'#94a3b8', fontSize:'0.875rem' }}>
          No account? <Link to="/register" style={{ color:'#2563eb', fontWeight:700 }}>Create one</Link>
        </p>
        <div style={{ marginTop:16, background:'#f8fafc', borderRadius:10, padding:'0.75rem', fontSize:'0.78rem', color:'#94a3b8', textAlign:'center' }}>
          Demo admin: admin@flipiq.com / admin123
        </div>
      </div>
    </div>
  );
}

const page      = { minHeight:'100vh', background:'#f8fafc', display:'flex', alignItems:'center', justifyContent:'center', padding:'1rem' };
const card      = { background:'white', borderRadius:24, padding:'2.5rem', width:'100%', maxWidth:420, boxShadow:'0 8px 40px rgba(0,0,0,0.08)', border:'1px solid #e2e8f0' };
const logoMark  = { width:56, height:56, background:'linear-gradient(135deg,#2563eb,#1d4ed8)', borderRadius:16, display:'inline-flex', alignItems:'center', justifyContent:'center', fontSize:'1.75rem' };
const lbl       = { display:'block', fontSize:'0.72rem', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.07em', color:'#64748b', marginBottom:5, marginTop:14 };
const inp       = { width:'100%', background:'#f8fafc', border:'1.5px solid #e2e8f0', borderRadius:10, padding:'0.7rem 0.9rem', color:'#1e293b', fontFamily:'inherit', fontSize:'0.9rem', outline:'none', boxSizing:'border-box' };
const primaryBtn = { width:'100%', background:'#2563eb', color:'white', border:'none', borderRadius:50, padding:'0.75rem', fontWeight:700, fontSize:'0.95rem', cursor:'pointer', fontFamily:'inherit', marginTop:20 };
const errBox    = { background:'#fee2e2', border:'1px solid #fca5a5', borderRadius:8, padding:'0.75rem', color:'#dc2626', fontSize:'0.875rem', marginBottom:16 };

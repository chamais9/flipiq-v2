import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function RegisterPage() {
  const [form,    setForm]    = useState({ name:'', email:'', password:'', university:'' });
  const [error,   setError]   = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      await register(form.name, form.email, form.password, form.university);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed. Please try again.');
    } finally { setLoading(false); }
  };

  const set = (k, v) => setForm(f => ({...f, [k]:v}));

  return (
    <div style={page}>
      <div style={card}>
        <div style={{ textAlign:'center', marginBottom:28 }}>
          <div style={logoMark}>📚</div>
          <h1 style={{ fontWeight:900, fontSize:'1.6rem', color:'#1e293b', margin:'14px 0 4px' }}>Create your account</h1>
          <p style={{ color:'#94a3b8', fontSize:'0.9rem' }}>Start studying smarter today</p>
        </div>
        {error && <div style={errBox}>{error}</div>}
        <form onSubmit={handleSubmit}>
          <label style={lbl}>Full Name</label>
          <input style={inp} type="text" placeholder="Your full name" value={form.name} onChange={e => set('name', e.target.value)} required />
          <label style={lbl}>Email</label>
          <input style={inp} type="email" placeholder="you@university.edu.au" value={form.email} onChange={e => set('email', e.target.value)} required />
          <label style={lbl}>University <span style={{ color:'#cbd5e1', fontWeight:400 }}>(optional)</span></label>
          <input style={inp} type="text" placeholder="e.g. University of Technology Sydney" value={form.university} onChange={e => set('university', e.target.value)} />
          <label style={lbl}>Password</label>
          <input style={inp} type="password" placeholder="At least 6 characters" value={form.password} onChange={e => set('password', e.target.value)} required />
          <button type="submit" disabled={loading} style={primaryBtn}>{loading ? 'Creating account...' : 'Create Account'}</button>
        </form>
        <p style={{ textAlign:'center', marginTop:18, color:'#94a3b8', fontSize:'0.875rem' }}>
          Already have an account? <Link to="/login" style={{ color:'#2563eb', fontWeight:700 }}>Sign in</Link>
        </p>
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

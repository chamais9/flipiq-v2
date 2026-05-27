import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getInitials } from '../utils/helpers';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate  = useNavigate();
  const location  = useLocation();

  const handleLogout = () => { logout(); navigate('/'); };
  const active = (path) => location.pathname === path;

  return (
    <nav style={s.nav}>
      <Link to="/" style={s.logo}>📚 FlipIQ</Link>
      <div style={s.right}>
        {user ? (
          <>
            <Link to="/dashboard" style={{ ...s.link, ...(active('/dashboard') ? s.aLink : {}) }}>Dashboard</Link>
            <Link to="/profile"   style={{ ...s.link, ...(active('/profile')   ? s.aLink : {}) }}>Profile</Link>
            {user.role === 'admin' && (
              <Link to="/admin" style={{ ...s.link, ...(active('/admin') ? s.aLink : {}) }}>Admin</Link>
            )}
            <div style={s.avatar}>{getInitials(user.name)}</div>
            <button onClick={handleLogout} style={s.logoutBtn}>Sign Out</button>
          </>
        ) : (
          <>
            <Link to="/login"    style={s.link}>Sign In</Link>
            <Link to="/register" style={s.signupBtn}>Get Started</Link>
          </>
        )}
      </div>
    </nav>
  );
}

const s = {
  nav:       { position:'sticky', top:0, zIndex:100, background:'rgba(255,255,255,0.96)', backdropFilter:'blur(20px)', borderBottom:'1px solid #e2e8f0', padding:'0 2rem', height:64, display:'flex', alignItems:'center', justifyContent:'space-between', boxShadow:'0 1px 12px rgba(0,0,0,0.06)' },
  logo:      { fontWeight:800, fontSize:'1.3rem', color:'#1e293b', textDecoration:'none' },
  right:     { display:'flex', alignItems:'center', gap:8 },
  link:      { color:'#64748b', textDecoration:'none', fontWeight:600, fontSize:'0.9rem', padding:'0.4rem 0.75rem', borderRadius:8 },
  aLink:     { color:'#2563eb', background:'#eff6ff' },
  avatar:    { width:34, height:34, borderRadius:'50%', background:'linear-gradient(135deg,#2563eb,#7c3aed)', color:'white', fontSize:'0.78rem', fontWeight:700, display:'flex', alignItems:'center', justifyContent:'center' },
  logoutBtn: { background:'transparent', border:'1px solid #e2e8f0', borderRadius:50, padding:'0.4rem 1rem', cursor:'pointer', color:'#64748b', fontWeight:600, fontSize:'0.85rem', fontFamily:'inherit' },
  signupBtn: { background:'#2563eb', color:'white', textDecoration:'none', fontWeight:700, fontSize:'0.875rem', padding:'0.5rem 1.1rem', borderRadius:50 },
};

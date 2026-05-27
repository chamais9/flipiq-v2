import { Link } from 'react-router-dom';

const features = [
  { icon:'🃏', color:'#2563eb', bg:'#eff6ff', title:'Smart Flashcards', desc:'Create cards with questions, answers, categories and difficulty levels.' },
  { icon:'🧠', color:'#7c3aed', bg:'#f5f3ff', title:'Quiz Mode',        desc:'Test yourself with self-graded quizzes and track your score history.' },
  { icon:'⚡', color:'#0f9b8e', bg:'#f0fdfa', title:'Study Mode',       desc:'Full-screen focused study sessions with a progress bar.' },
  { icon:'🔗', color:'#d97706', bg:'#fffbeb', title:'Deck Sharing',     desc:'Share a category of cards with other registered students via a code.' },
  { icon:'🎯', color:'#2563eb', bg:'#eff6ff', title:'Daily Goals',      desc:'Set a daily review target and track your progress each day.' },
  { icon:'📊', color:'#7c3aed', bg:'#f5f3ff', title:'Progress Charts',  desc:'View your quiz history as a bar chart to track improvement over time.' },
];

export default function HomePage() {
  return (
    <div>
      <div style={hero}>
        <div style={{ maxWidth:680, margin:'0 auto', textAlign:'center' }}>
          <h1 style={{ fontWeight:900, fontSize:'3rem', color:'white', lineHeight:1.15, margin:'0 0 16px', letterSpacing:'-0.03em' }}>
            Study smarter with <span style={{ color:'#93c5fd' }}>FlipIQ</span>
          </h1>
          <p style={{ fontSize:'1.05rem', color:'rgba(255,255,255,0.8)', lineHeight:1.7, marginBottom:32 }}>
            Create flashcards, quiz yourself, track your progress and share decks with classmates.
          </p>
          <div style={{ display:'flex', gap:12, justifyContent:'center', flexWrap:'wrap' }}>
            <Link to="/register" style={primaryBtn}>Get Started Free</Link>
            <Link to="/login"    style={ghostBtn}>Sign In</Link>
          </div>
        </div>
      </div>

      <div style={{ maxWidth:1080, margin:'0 auto', padding:'4rem 1.5rem' }}>
        <h2 style={{ textAlign:'center', fontWeight:900, fontSize:'2rem', color:'#1e293b', marginBottom:40, letterSpacing:'-0.02em' }}>
          Everything you need to ace your exams
        </h2>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(300px,1fr))', gap:16 }}>
          {features.map(f => (
            <div key={f.title} style={{ ...featureCard, borderTop:`3px solid ${f.color}` }}>
              <div style={{ width:48, height:48, background:f.bg, borderRadius:14, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.5rem', marginBottom:14 }}>{f.icon}</div>
              <h3 style={{ fontWeight:800, fontSize:'1rem', color:'#1e293b', marginBottom:8 }}>{f.title}</h3>
              <p style={{ color:'#64748b', fontSize:'0.875rem', lineHeight:1.65 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div style={{ background:'linear-gradient(135deg,#1e40af,#2563eb)', padding:'4rem 1.5rem', textAlign:'center' }}>
        <h2 style={{ fontWeight:900, fontSize:'2rem', color:'white', marginBottom:12, letterSpacing:'-0.02em' }}>Ready to start studying?</h2>
        <p style={{ color:'rgba(255,255,255,0.75)', marginBottom:28 }}>Join students using FlipIQ to boost their grades</p>
        <Link to="/register" style={{ background:'white', color:'#2563eb', textDecoration:'none', fontWeight:800, padding:'0.9rem 2rem', borderRadius:50, fontSize:'1rem', display:'inline-block' }}>
          Create Free Account
        </Link>
      </div>
    </div>
  );
}

const hero        = { background:'linear-gradient(135deg,#1e3a8a,#2563eb)', padding:'5rem 1.5rem' };
const primaryBtn  = { background:'white', color:'#2563eb', textDecoration:'none', fontWeight:800, padding:'0.85rem 2rem', borderRadius:50, fontSize:'0.95rem', display:'inline-block' };
const ghostBtn    = { background:'rgba(255,255,255,0.12)', color:'white', textDecoration:'none', fontWeight:700, padding:'0.85rem 2rem', borderRadius:50, fontSize:'0.95rem', border:'1px solid rgba(255,255,255,0.3)', display:'inline-block' };
const featureCard = { background:'white', borderRadius:16, padding:'1.5rem', border:'1px solid #e2e8f0' };

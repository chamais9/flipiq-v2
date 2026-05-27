export const CARD_COLORS = [
  { border: '#2563eb', bg: '#eff6ff', text: '#1d4ed8' },
  { border: '#0f9b8e', bg: '#f0fdfa', text: '#0f766e' },
  { border: '#d97706', bg: '#fffbeb', text: '#b45309' },
  { border: '#7c3aed', bg: '#f5f3ff', text: '#6d28d9' },
];

export const getCardColor = (id) => {
  const n = parseInt(String(id).replace(/\D/g, '').slice(-4) || '0');
  return CARD_COLORS[n % CARD_COLORS.length];
};

export const getInitials = (name = '') => {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
};

export const calcPercent = (score, total) => {
  if (!total) return 0;
  return Math.round((score / total) * 100);
};

export const formatDate = (dateStr) => {
  return new Date(dateStr).toLocaleDateString('en-AU', {
    day: 'numeric', month: 'short', year: 'numeric'
  });
};

const QUOTES = [
  { quote: "The secret of getting ahead is getting started.", author: "Mark Twain" },
  { quote: "An investment in knowledge pays the best interest.", author: "Benjamin Franklin" },
  { quote: "Learning never exhausts the mind.", author: "Leonardo da Vinci" },
  { quote: "The expert in anything was once a beginner.", author: "Helen Hayes" },
  { quote: "Education is the most powerful weapon you can use to change the world.", author: "Nelson Mandela" },
  { quote: "The more that you read, the more things you will know.", author: "Dr. Seuss" },
  { quote: "Study hard what interests you the most in the most undisciplined way possible.", author: "Richard Feynman" },
];

export const getDailyQuote = () => {
  const index = Math.floor(Date.now() / 86400000) % QUOTES.length;
  return QUOTES[index];
};

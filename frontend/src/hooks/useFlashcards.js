import { useState, useEffect, useCallback } from 'react';
import api from '../services/api';

export function useFlashcards(filters = {}) {
  const [cards,   setCards]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (filters.q) params.set('q', filters.q);
      if (filters.category && filters.category !== 'All') params.set('category', filters.category);
      if (filters.difficulty && filters.difficulty !== 'All') params.set('difficulty', filters.difficulty);
      const { data } = await api.get(`/flashcards?${params}`);
      setCards(data.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load cards');
    } finally {
      setLoading(false);
    }
  }, [filters.q, filters.category, filters.difficulty]);

  useEffect(() => { load(); }, [load]);

  const create = async (payload) => {
    const { data } = await api.post('/flashcards', payload);
    setCards(prev => [data.data, ...prev]);
    return data.data;
  };

  const update = async (id, payload) => {
    const { data } = await api.put(`/flashcards/${id}`, payload);
    setCards(prev => prev.map(c => c.id === id ? data.data : c));
    return data.data;
  };

  const remove = async (id) => {
    await api.delete(`/flashcards/${id}`);
    setCards(prev => prev.filter(c => c.id !== id));
  };

  const reveal = async (id) => {
    const { data } = await api.patch(`/flashcards/${id}/reveal`);
    setCards(prev => prev.map(c => c.id === id ? data.data : c));
  };

  return { cards, loading, error, create, update, remove, reveal, reload: load };
}

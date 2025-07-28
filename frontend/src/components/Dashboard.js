import React, { useEffect, useState } from 'react';
import api from '../services/api';

const Dashboard = () => {
  const [transactions, setTransactions] = useState([]);
  const [form, setForm] = useState({ description: '', amount: '' });
  const [searchDate, setSearchDate] = useState('');

  const fetchTransactions = async (date = '') => {
    let url = '/transactions';
    if (date) url += `?date=${date}`;
    const res = await api.get(url);
    setTransactions(res.data);
  };

  const handleSubmit = async e => {
    e.preventDefault();
    await api.post('/transactions', form);
    setForm({ description: '', amount: '' });
    fetchTransactions();
  };

  const handleDateSearch = (e) => {
    const value = e.target.value;
    setSearchDate(value);
    fetchTransactions(value);
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input placeholder="Description" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
        <input placeholder="Amount" type="number" value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} />
        <button type="submit">Add</button>
      </form>

      <input
        type="date"
        value={searchDate}
        onChange={handleDateSearch}
        placeholder="Search by date"
      />

      {transactions.length === 0 ? (
  <p style={{ textAlign: 'center', marginTop: '1rem' }}>No transactions found.</p>
) : (
  <ul>
    {transactions.map(tx => (
      <li key={tx._id}>
        <strong>{tx.description}</strong>: ${tx.amount} &nbsp;&nbsp; 
        <small>{formatDate(tx.date)}</small>
      </li>
    ))}
  </ul>
)}

    </div>
  );
};

export default Dashboard;
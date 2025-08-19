import React, { useEffect, useState } from 'react';
import api from '../services/api';
import TransactionChart from './TransactionChart';

const Dashboard = ({ user, onLogout }) => {
  const [transactions, setTransactions] = useState([]);
  const [form, setForm] = useState({ description: '', amount: '' });
  const [searchDate, setSearchDate] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 5;

  // Fetch transactions for logged-in user
  const fetchTransactions = async (date = '') => {
    try {
      let url = `/api/transactions/${user.userId}`;
      if (date) url += `?date=${date}`;
      const res = await api.get(url);
      setTransactions(res.data);
      setCurrentPage(1);
    } catch (err) {
      console.error('Fetch error:', err);
    }
  };

  // Add new transaction with userId
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/api/transactions', { ...form, userId: user.userId });
      setForm({ description: '', amount: '' });
      fetchTransactions();
    } catch (err) {
      console.error('Add transaction error:', err);
    }
  };

  const handleDateSearch = (e) => {
    const value = e.target.value;
    setSearchDate(value);
    fetchTransactions(value);
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/api/transactions/${id}`);
      fetchTransactions();
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  useEffect(() => {
    if (user) fetchTransactions();
  }, [user]);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = transactions.slice(indexOfFirstRecord, indexOfLastRecord);
  const totalPages = Math.ceil(transactions.length / recordsPerPage);

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(prev => prev + 1);
  };

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage(prev => prev - 1);
  };

  return (
    
    <div style={styles.container}>
      <button onClick={onLogout} style={styles.logoutBtn}>Logout</button>
      
      <h2>Welcome, {user.email}</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          placeholder="Description"
          value={form.description}
          onChange={e => setForm({ ...form, description: e.target.value })}
          style={styles.input}
        />
        <input
          placeholder="Amount"
          type="number"
          value={form.amount}
          onChange={e => setForm({ ...form, amount: e.target.value })}
          style={styles.input}
        />
        <button type="submit" style={styles.addBtn}>Add</button>
      </form>

      <input
        type="date"
        value={searchDate}
        onChange={handleDateSearch}
        style={styles.dateInput}
      />

      {transactions.length === 0 ? (
        <p style={{ textAlign: 'center', marginTop: '1rem' }}>No transactions found.</p>
      ) : (
        <>
          <div style={styles.tableWrapper}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Description</th>
                  <th style={styles.th}>Amount</th>
                  <th style={styles.th}>Date</th>
                  <th style={styles.th}>Action</th>
                </tr>
              </thead>
              <tbody>
                {currentRecords.map(tx => (
                  <tr key={tx._id} style={{ textAlign: 'center' }}>
                    <td style={styles.td}>{tx.description}</td>
                    <td style={styles.td}>${tx.amount}</td>
                    <td style={styles.td}>{formatDate(tx.date)}</td>
                    <td style={styles.td}>
                      <button
                        onClick={() => handleDelete(tx._id)}
                        style={styles.deleteBtn}
                      >
                        ❌
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div style={styles.pagination}>
            <button onClick={handlePrev} disabled={currentPage === 1} style={styles.pageBtn}>◀</button>
            <span>Page {currentPage} of {totalPages}</span>
            <button onClick={handleNext} disabled={currentPage === totalPages} style={styles.pageBtn}>▶</button>
          </div>
        </>
      )}

      <TransactionChart transactions={transactions} />
    </div>
  );
};


const styles = {
  container: {
    padding: '1rem',
    maxWidth: '1000px',
    margin: '0 auto'
  },
  form: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '10px',
    marginBottom: '1rem',
    justifyContent: 'center'
  },
  input: {
    padding: '7px',
    fontSize: '16px'
  },
  addBtn: {
    padding: '5px 16px', // fixed negative padding
    backgroundColor: '#5381b3ff',
    color: 'white',
    border: 'none',
    fontSize: '16px',
    borderRadius: '5px',
    cursor: 'pointer'
  },
  dateInput: {
    padding: '7px',
    fontSize: '16px',
    marginTop: '1rem',
    marginBottom: '2.5rem',
    width: '100%',
    maxWidth: '250px'
  },
  tableWrapper: {
    overflowX: 'auto'
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    minWidth: '600px'
  },
  th: {
    borderBottom: '2px solid #ccc',
    padding: '10px',
    backgroundColor: '#f4f4f4'
  },
  td: {
    padding: '10px',
    borderBottom: '1px solid #ddd'
  },
  deleteBtn: {
    background: '#d8cbcbff', // fixed color
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    padding: '6px 16px',
    fontSize: '14px',
    cursor: 'pointer'
  },
  pagination: {
    display: 'flex',
    justifyContent: 'center',
    gap: '1rem',
    marginTop: '20px',
    flexWrap: 'wrap'
  },
  pageBtn: {
    padding: '6px 12px',
    background: '#5381b3ff',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    fontSize: '14px',
    cursor: 'pointer',
    minWidth: '70px'
  },

  logoutBtn: {
  padding: '8px 20px',
  backgroundColor: '#ff4d4d',
  color: 'white',
  border: 'none',
  borderRadius: '6px',
  fontSize: '15px',
  cursor: 'pointer',
  fontWeight: 'bold',
  transition: 'background 0.3s'
}


};

// ... keep your styles as before
export default Dashboard;

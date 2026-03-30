import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth.jsx';
import { apiPost } from '../api.js';

export default function AdminDashboard() {
  const auth = useAuth();
  const navigate = useNavigate();
  const [summary, setSummary] = useState({ total_members: null, total_savings: null, total_loans: null });
  const [status, setStatus] = useState('');

  useEffect(() => {
    if (!auth.authenticated || auth.role !== 'admin') {
      navigate('/login');
      return;
    }
    loadSummary();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auth, navigate]);

  const loadSummary = async () => {
    setStatus('Loading dashboard...');
    try {
      const data = await apiPost('admin-summary');
      setSummary({
        total_members: Number(data.total_members || 0),
        total_savings: Number(data.total_savings || 0),
        total_loans: Number(data.total_loans || 0),
      });
      setStatus('Dashboard loaded successfully.');
    } catch (error) {
      setStatus(`Error: ${error.message}`);
    }
  };

  const formatCurrency = (value) => {
    if (value == null) {
      return '--';
    }
    return `UGX ${Number(value).toLocaleString()}`;
  };

  const signOut = () => {
    auth.logout();
    navigate('/login');
  };

  return (
    <div className="page-shell">
      <header className="page-header">
        <div>
          <h1>Admin Dashboard</h1>
          <p>Totals for members, savings, loans, and net funds.</p>
        </div>
        <button className="secondary" onClick={signOut}>
          Logout
        </button>
      </header>

      <section className="dashboard-card">
        <div className="summary-item">
          <span>Total Members</span>
          <strong>{summary.total_members ?? '--'}</strong>
        </div>
        <div className="summary-item">
          <span>Total Savings</span>
          <strong>{formatCurrency(summary.total_savings)}</strong>
        </div>
        <div className="summary-item">
          <span>Total Loans</span>
          <strong>{formatCurrency(summary.total_loans)}</strong>
        </div>
        <div className="summary-item">
          <span>Net Funds</span>
          <strong>{formatCurrency((summary.total_savings || 0) - (summary.total_loans || 0))}</strong>
        </div>
      </section>

      <section className="card">
        <button onClick={loadSummary}>Refresh Dashboard</button>
        <pre className="response">{status}</pre>
      </section>
    </div>
  );
}

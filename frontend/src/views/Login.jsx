import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth.jsx';

export default function Login() {
  const auth = useAuth();
  const navigate = useNavigate();
  const [role, setRole] = useState('member');
  const [memberNumber, setMemberNumber] = useState('');
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState('');

  useEffect(() => {
    if (auth.authenticated) {
      navigate(auth.role === 'admin' ? '/admin' : '/member', { replace: true });
    }
  }, [auth, navigate]);

  const handleSubmit = (event) => {
    event.preventDefault();
    setError('');

    try {
      if (role === 'admin') {
        auth.loginAdmin(username.trim(), password.trim());
        navigate('/admin');
      } else {
        auth.loginMember(memberNumber.trim());
        navigate('/member');
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="page-shell">
      <div className="panel">
        <h1>SACCO Login</h1>
        <p>Choose your role and sign in.</p>

        <form className="form-grid" onSubmit={handleSubmit}>
          <label>
            Role
            <select value={role} onChange={(event) => setRole(event.target.value)}>
              <option value="member">Member</option>
              <option value="admin">Admin</option>
            </select>
          </label>

          {role === 'member' ? (
            <label>
              Member Number
              <input
                value={memberNumber}
                onChange={(event) => setMemberNumber(event.target.value)}
                placeholder="3047"
              />
            </label>
          ) : (
            <>
              <label>
                Username
                <input value={username} onChange={(event) => setUsername(event.target.value)} />
              </label>
              <label>
                Password
                <input
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                />
              </label>
            </>
          )}

          <button type="submit">Continue</button>
        </form>

        <p className="hint">
          Admin credentials: <strong>admin/admin123</strong>.
          <br />
          Member login uses your member number.
        </p>

        {error && <p className="error-message">{error}</p>}
      </div>
    </div>
  );
}

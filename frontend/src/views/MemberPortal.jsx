import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth.jsx';
import { apiPost } from '../api.js';

export default function MemberPortal() {
  const auth = useAuth();
  const navigate = useNavigate();
  const [register, setRegister] = useState({ member_number: '', name: '', phone: '', password: '' });
  const [deposit, setDeposit] = useState({ member_number: auth.memberNumber || '', amount: '', reference: '' });
  const [balance, setBalance] = useState({ member_number: auth.memberNumber || '' });
  const [loan, setLoan] = useState({ member_number: auth.memberNumber || '', amount: '' });
  const [repay, setRepay] = useState({ member_number: auth.memberNumber || '', amount: '' });
  const [registerResult, setRegisterResult] = useState('');
  const [depositResult, setDepositResult] = useState('');
  const [balanceResult, setBalanceResult] = useState('');
  const [loanResult, setLoanResult] = useState('');
  const [repayResult, setRepayResult] = useState('');

  useEffect(() => {
    if (!auth.authenticated || auth.role !== 'member') {
      navigate('/login');
      return;
    }

    setDeposit((prev) => ({ ...prev, member_number: auth.memberNumber }));
    setBalance((prev) => ({ ...prev, member_number: auth.memberNumber }));
    setLoan((prev) => ({ ...prev, member_number: auth.memberNumber }));
    setRepay((prev) => ({ ...prev, member_number: auth.memberNumber }));
  }, [auth, navigate]);

  const signOut = () => {
    auth.logout();
    navigate('/login');
  };

  const submitHandler = async (event, data, path, setter, resetFields) => {
    event.preventDefault();
    setter('Sending...');
    try {
      const response = await apiPost(path, data);
      setter(typeof response === 'string' ? response : JSON.stringify(response, null, 2));
      if (resetFields) {
        resetFields();
      }
    } catch (error) {
      setter(`Error: ${error.message}`);
    }
  };

  return (
    <div className="page-shell">
      <header className="page-header">
        <div>
          <h1>Member Portal</h1>
          <p>Member {auth.memberNumber}</p>
        </div>
        <button className="secondary" onClick={signOut}>
          Logout
        </button>
      </header>

      <div className="dashboard-card">
        <div className="summary-item">
          <span>Role</span>
          <strong>{auth.role}</strong>
        </div>
        <div className="summary-item">
          <span>Member Number</span>
          <strong>{auth.memberNumber}</strong>
        </div>
      </div>

      <section className="card">
        <h2>Register Member</h2>
        <form
          className="form-grid"
          onSubmit={(event) =>
            submitHandler(event, register, 'add-member', setRegisterResult, () =>
              setRegister({ member_number: '', name: '', phone: '', password: '' }),
            )
          }
        >
          <label>
            Member Number
            <input
              value={register.member_number}
              onChange={(event) => setRegister({ ...register, member_number: event.target.value })}
              required
            />
          </label>
          <label>
            Full Name
            <input
              value={register.name}
              onChange={(event) => setRegister({ ...register, name: event.target.value })}
              required
            />
          </label>
          <label>
            Phone
            <input
              value={register.phone}
              onChange={(event) => setRegister({ ...register, phone: event.target.value })}
              required
            />
          </label>
          <label>
            Password
            <input
              type="password"
              value={register.password}
              onChange={(event) => setRegister({ ...register, password: event.target.value })}
              required
            />
          </label>
          <button type="submit">Register</button>
        </form>
        <pre className="response">{registerResult}</pre>
      </section>

      <section className="card">
        <h2>Deposit Savings</h2>
        <form
          className="form-grid"
          onSubmit={(event) =>
            submitHandler(event, deposit, 'deposit', setDepositResult, () =>
              setDeposit({ member_number: auth.memberNumber, amount: '', reference: '' }),
            )
          }
        >
          <label>
            Member Number
            <input value={deposit.member_number} disabled />
          </label>
          <label>
            Amount
            <input
              type="number"
              min="1"
              value={deposit.amount}
              onChange={(event) => setDeposit({ ...deposit, amount: event.target.value })}
              required
            />
          </label>
          <label>
            Reference
            <input
              value={deposit.reference}
              onChange={(event) => setDeposit({ ...deposit, reference: event.target.value })}
              required
            />
          </label>
          <button type="submit">Deposit</button>
        </form>
        <pre className="response">{depositResult}</pre>
      </section>

      <section className="card">
        <h2>Check Balance</h2>
        <form
          className="form-grid"
          onSubmit={(event) => submitHandler(event, balance, 'check-balance', setBalanceResult)}
        >
          <label>
            Member Number
            <input value={balance.member_number} disabled />
          </label>
          <button type="submit">Check Balance</button>
        </form>
        <pre className="response">{balanceResult}</pre>
      </section>

      <section className="card">
        <h2>Request Loan</h2>
        <form
          className="form-grid"
          onSubmit={(event) =>
            submitHandler(event, loan, 'request-loan', setLoanResult, () =>
              setLoan({ member_number: auth.memberNumber, amount: '' }),
            )
          }
        >
          <label>
            Member Number
            <input value={loan.member_number} disabled />
          </label>
          <label>
            Amount
            <input
              type="number"
              min="1"
              value={loan.amount}
              onChange={(event) => setLoan({ ...loan, amount: event.target.value })}
              required
            />
          </label>
          <button type="submit">Request Loan</button>
        </form>
        <pre className="response">{loanResult}</pre>
      </section>

      <section className="card">
        <h2>Repay Loan</h2>
        <form
          className="form-grid"
          onSubmit={(event) =>
            submitHandler(event, repay, 'repay-loan', setRepayResult, () =>
              setRepay({ member_number: auth.memberNumber, amount: '' }),
            )
          }
        >
          <label>
            Member Number
            <input value={repay.member_number} disabled />
          </label>
          <label>
            Amount
            <input
              type="number"
              min="1"
              value={repay.amount}
              onChange={(event) => setRepay({ ...repay, amount: event.target.value })}
              required
            />
          </label>
          <button type="submit">Repay Loan</button>
        </form>
        <pre className="response">{repayResult}</pre>
      </section>
    </div>
  );
}

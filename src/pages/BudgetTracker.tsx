import React, { useState, useEffect } from 'react';
import '../styles/BudgetTracker.css'; // Assuming you have a CSS file for styles

type TransactionType = 'income' | 'expense';

interface Transaction {
  id: string;
  name: string;
  amount: number;
  type: TransactionType;
  recurrence: 'monthly' | 'weekly' | 'daily';
  dateAdded: Date;
}

const BudgetTracker: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem('budgetTransactions');
    return saved ? JSON.parse(saved) : [];
  });
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<TransactionType>('income');
  const [recurrence, setRecurrence] = useState<'monthly' | 'weekly' | 'daily'>('monthly');
  const [filter, setFilter] = useState<'all' | TransactionType>('all');
  const [editingId, setEditingId] = useState<string | null>(null);

  // Save to localStorage whenever transactions change
  useEffect(() => {
    localStorage.setItem('budgetTransactions', JSON.stringify(transactions));
  }, [transactions]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !amount) return;
    
    const transactionAmount = parseFloat(amount);
    if (isNaN(transactionAmount)) return;

    if (editingId) {
      // Update existing transaction
      setTransactions(transactions.map(t => 
        t.id === editingId ? { 
          ...t, 
          name, 
          amount: transactionAmount, 
          type, 
          recurrence 
        } : t
      ));
      setEditingId(null);
    } else {
      // Add new transaction
      const newTransaction: Transaction = {
        id: Date.now().toString(),
        name,
        amount: transactionAmount,
        type,
        recurrence,
        dateAdded: new Date()
      };
      setTransactions([...transactions, newTransaction]);
    }

    // Reset form
    setName('');
    setAmount('');
    setType('income');
    setRecurrence('monthly');
  };

  const handleEdit = (transaction: Transaction) => {
    setName(transaction.name);
    setAmount(transaction.amount.toString());
    setType(transaction.type);
    setRecurrence(transaction.recurrence);
    setEditingId(transaction.id);
  };

  const handleDelete = (id: string) => {
    setTransactions(transactions.filter(t => t.id !== id));
  };

  const filteredTransactions = filter === 'all' 
    ? transactions 
    : transactions.filter(t => t.type === filter);

  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = totalIncome - totalExpenses;

  return (
    <div className="budget-tracker">
      <h1>Monthly Budget Tracker</h1>
      
      <div className="summary">
        <div className="summary-item">
          <h3>Income</h3>
          <p className="income">${totalIncome.toFixed(2)}</p>
        </div>
        <div className="summary-item">
          <h3>Expenses</h3>
          <p className="expense">${totalExpenses.toFixed(2)}</p>
        </div>
        <div className="summary-item">
          <h3>Balance</h3>
          <p className={balance >= 0 ? 'income' : 'expense'}>
            ${balance.toFixed(2)}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="transaction-form">
        <h2>{editingId ? 'Edit Transaction' : 'Add Transaction'}</h2>
        
        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="amount">Amount</label>
          <input
            type="number"
            id="amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            min="0.01"
            step="0.01"
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="type">Type</label>
          <select
            id="type"
            value={type}
            onChange={(e) => setType(e.target.value as TransactionType)}
          >
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
        </div>
        
        <div className="form-group">
          <label htmlFor="recurrence">Recurrence</label>
          <select
            id="recurrence"
            value={recurrence}
            onChange={(e) => setRecurrence(e.target.value as 'monthly' | 'weekly' | 'daily')}
          >
            <option value="monthly">Monthly</option>
            <option value="weekly">Weekly</option>
            <option value="daily">Daily</option>
          </select>
        </div>
        
        <button type="submit" className="submit-btn">
          {editingId ? 'Update' : 'Add'} Transaction
        </button>
        
        {editingId && (
          <button 
            type="button" 
            className="cancel-btn"
            onClick={() => {
              setEditingId(null);
              setName('');
              setAmount('');
              setType('income');
              setRecurrence('monthly');
            }}
          >
            Cancel
          </button>
        )}
      </form>

      <div className="transaction-list">
        <div className="filter-controls">
          <h2>Transactions</h2>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as 'all' | TransactionType)}
          >
            <option value="all">All</option>
            <option value="income">Income</option>
            <option value="expense">Expenses</option>
          </select>
        </div>
        
        {filteredTransactions.length === 0 ? (
          <p>No transactions found</p>
        ) : (
          <ul>
            {filteredTransactions.map((transaction) => (
              <li key={transaction.id} className={transaction.type}>
                <div className="transaction-info">
                  <span className="name">{transaction.name}</span>
                  <span className="amount">
                    {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toFixed(2)}
                  </span>
                  <span className="recurrence">{transaction.recurrence}</span>
                  <span className="date">
                    Added: {new Date(transaction.dateAdded).toLocaleDateString()}
                  </span>
                </div>
                <div className="transaction-actions">
                  <button 
                    onClick={() => handleEdit(transaction)}
                    className="edit-btn"
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => handleDelete(transaction.id)}
                    className="delete-btn"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default BudgetTracker;
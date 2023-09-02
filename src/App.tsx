import { BrowserRouter, Routes, Route } from 'react-router-dom'
import LoginForm from './components/LoginForm';
import UserDashboard from './components/UserDashboard'
import UserTransactions from './components/UserTransactions';
import UserProfile from './components/UserProfile';
import AdminDashboard from './components/AdminDashboard';
import AdminTransactions from './components/AdminTransactions';
import HandleRedirect from './components/HandleRedirect';
import TransactionStore from './models/TransactionStore'
import { TransactionContext } from './context/transactionContext';
import './App.css';



const App = () => {
  // const myStoreInstance = new TransactionStore()
  return (
    <TransactionContext.Provider value={new TransactionStore()}>
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginForm />} />
        <Route path="/user-dashboard" element={<UserDashboard />} />
        <Route path="/user-transactions" element={<UserTransactions />} />
        <Route path='/user-profile' element={<UserProfile />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/admin-transactions" element={<AdminTransactions />} />
        <Route path="*" element={<HandleRedirect />} />
      </Routes>
    </BrowserRouter>
    </TransactionContext.Provider>
  );
}

export default App;

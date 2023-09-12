import { BrowserRouter, Routes, Route } from 'react-router-dom'
import LoginForm from './components/LoginForm';
import UserDashboard from './components/UserDashboard'
import UserTransactions from './components/UserTransactions';
import UserProfile from './components/UserProfile';
import AdminDashboard from './components/AdminDashboard';
import AdminTransactions from './components/AdminTransactions';
import HandleRedirect from './components/HandleRedirect';
import {TransactionContextProvider } from './context/transactionContext';
import './App.css';
import {LOGIN_PATH,USER_DASHBOARD_PATH,USER_TRANSACTIONS_PATH,USER_PROFILE_PATH,ADMIN_DASHBOARD_PATH,ADMIN_TRANSACTIONS_PATH,REDIRECT_PATH} from './constants/NavigationConstants'

const App = () => {
  return (
    <TransactionContextProvider>
    <BrowserRouter>
      <Routes>
        <Route path={LOGIN_PATH} element={<LoginForm />} />
        <Route path={USER_DASHBOARD_PATH} element={<UserDashboard />} />
        <Route path={USER_TRANSACTIONS_PATH} element={<UserTransactions />} />
        <Route path={USER_PROFILE_PATH} element={<UserProfile />} />
        <Route path={ADMIN_DASHBOARD_PATH} element={<AdminDashboard />} />
        <Route path={ADMIN_TRANSACTIONS_PATH} element={<AdminTransactions />} />
        <Route path={REDIRECT_PATH} element={<HandleRedirect />} />
      </Routes>
    </BrowserRouter>
    </TransactionContextProvider>
    
  );
}

export default App;

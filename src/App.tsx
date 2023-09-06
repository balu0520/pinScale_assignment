import { BrowserRouter, Routes, Route } from 'react-router-dom'
import LoginForm from './components/LoginForm';
import UserDashboard from './components/UserDashboard'
import UserTransactions from './components/UserTransactions';
import UserProfile from './components/UserProfile';
import AdminDashboard from './components/AdminDashboard';
import AdminTransactions from './components/AdminTransactions';
import HandleRedirect from './components/HandleRedirect';
import GraphqlComponent from './components/GraphqlComponent'
import {TransactionContextProvider } from './context/transactionContext';
import './App.css';



const App = () => {
  return (
    <TransactionContextProvider>
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginForm />} />
        <Route path="/user-dashboard" element={<UserDashboard />} />
        <Route path="/user-transactions" element={<UserTransactions />} />
        <Route path='/user-profile' element={<UserProfile />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/admin-transactions" element={<AdminTransactions />} />
        <Route path='/sample-gql' element={<GraphqlComponent />} />
        <Route path="*" element={<HandleRedirect />} />
      </Routes>
    </BrowserRouter>
    </TransactionContextProvider>
    
  );
}

export default App;

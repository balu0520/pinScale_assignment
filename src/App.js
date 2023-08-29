import { BrowserRouter, Routes, Route } from 'react-router-dom'
import LoginForm from './components/LoginForm';
import UserDashboard from './components/UserDashboard'
import UserTransactions from './components/UserTransactions';
import UserProfile from './components/UserProfile';
import AdminDashboard from './components/AdminDashboard';
import AdminTransactions from './components/AdminTransactions';
import HandleRedirect from './components/HandleRedirect';
import './App.css';


const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route exact path="/user-dashboard" element={<UserDashboard />} />
        <Route exact path="/login" element={<LoginForm />} />
        <Route exact path="/user-transactions" element={<UserTransactions />} />
        <Route exact path='/user-profile' element={<UserProfile />} />
        <Route exact path="/admin-dashboard" element={<AdminDashboard />} />
        <Route exact path="/admin-transactions" element={<AdminTransactions />} />
        <Route path="*" element={<HandleRedirect />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

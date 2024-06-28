import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import './App.css';
import UserManager from './components/admin/UserManager';
import Login from './components/Login';
import LayoutAdmin from './components/admin/LayoutAdmin';
import PropTypes from 'prop-types';
import MainContent from './components/admin/MainContent';
import SideContent from './components/admin/SideContent';
import Register from './components/Register';
import LayoutUser from './components/user/LayoutUser';
import BioPage from './components/user/layout/BioPage01';
import PersonalInfor from './components/user/PersonalInfor';

const Admin = ({ accessToken }) => {
    return (
        <LayoutAdmin accessToken={accessToken}>
            <MainContent />
            <SideContent />
        </LayoutAdmin>
    );
};

Admin.propTypes = {
    accessToken: PropTypes.string.isRequired,
};

const User = ({ accessToken }) => {
    return (
        <LayoutUser accessToken={accessToken}>
            <BioPage />
        </LayoutUser>
    );
};

User.propTypes = {
    accessToken: PropTypes.string.isRequired,
};

const App = () => {
    const initialIsLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const initialUserRole = localStorage.getItem('userRole') || '';
    const initialAccessToken = localStorage.getItem('accessToken') || '';

    const [isLoggedIn, setIsLoggedIn] = useState(initialIsLoggedIn);
    const [userRole, setUserRole] = useState(initialUserRole);
    const [accessToken, setAccessToken] = useState(initialAccessToken);

    const handleLogin = (status, role, token) => {
        setIsLoggedIn(status);
        setUserRole(role);
        setAccessToken(token);
        localStorage.setItem('isLoggedIn', status.toString());
        localStorage.setItem('userRole', role);
        localStorage.setItem('accessToken', token);
    };

    useEffect(() => {
        setIsLoggedIn(localStorage.getItem('isLoggedIn') === 'true');
        setUserRole(localStorage.getItem('userRole'));
        setAccessToken(localStorage.getItem('accessToken'));
    }, []);

    return (
        <Router>
            <Routes>
                <Route path="/login" element={<Login onLogin={handleLogin} />} />
                <Route path="/register" element={<Register />} />
                <Route
                    path="/admin"
                    element={isLoggedIn && userRole === 'admin' ? <Admin accessToken={accessToken} /> : <Navigate to="/login" />}
                />
                <Route
                    path="/admin/user-manager"
                    element={isLoggedIn && userRole === 'admin' ? <UserManager accessToken={accessToken} /> : <Navigate to="/login" />}
                />
                <Route
                    path="/user"
                    element={isLoggedIn && userRole === 'user' ? <User accessToken={accessToken} /> : <Navigate to="/login" />}
                />
                <Route
                    path="/user/personal-info"
                    element={isLoggedIn && userRole === 'user' ? <PersonalInfor accessToken={accessToken} /> : <Navigate to="/login" />}
                />
                <Route path="*" element={<Navigate to="/login" />} />

            </Routes>
        </Router>
    );
};

export default App;

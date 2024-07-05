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
import PersonalInfor from './components/user/PersonalInfor';
import BioManager from './components/admin/BioManager';
import Home from './components/user/Home';
import UserProfile02 from './components/user/layout/BioPage02';
import UserProfile from './components/user/layout/BioPage01';
import View from './components/user/view';
import NotFoundPage from './components/user/404';

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
            <Home />
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
        const checkLoginStatus = () => {
            const loggedIn = localStorage.getItem('isLoggedIn') === 'true';
            const role = localStorage.getItem('userRole');
            const token = localStorage.getItem('accessToken');

            setIsLoggedIn(loggedIn);
            setUserRole(role);
            setAccessToken(token);
        };

        checkLoginStatus();
    }, []);

    const RequireAuth = ({ children, role }) => {
        if (!isLoggedIn) {
            return <Navigate to="/login" />;
        }
        if (role && userRole !== role) {
            return <Navigate to="/login" />;
        }
        return children;
    };

    RequireAuth.propTypes = {
        children: PropTypes.node.isRequired,
        role: PropTypes.string,
    };

    return (
        <Router>
            <Routes>
                <Route path="/viewuser/:herfid" element={<View currentInterface="desktop" />} />
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login onLogin={handleLogin} />} />
                <Route path="/register" element={<Register />} />
                <Route path="*" element={<NotFoundPage />} />
                <Route
                    path="/admin"
                    element={
                        <RequireAuth role="admin">
                            <Admin accessToken={accessToken} />
                        </RequireAuth>
                    }
                />
                <Route
                    path="/admin/user-manager"
                    element={
                        <RequireAuth role="admin">
                            <UserManager accessToken={accessToken} />
                        </RequireAuth>
                    }
                />
                <Route
                    path="/admin/bio-manager"
                    element={
                        <RequireAuth role="admin">
                            <BioManager accessToken={accessToken} />
                        </RequireAuth>
                    }
                />
                <Route
                    path="/user/bio01"
                    element={
                        <RequireAuth role="user">
                            <UserProfile accessToken={accessToken} />
                        </RequireAuth>
                    }
                />
                <Route
                    path="/user/bio02"
                    element={
                        <RequireAuth role="user">
                            <UserProfile02 accessToken={accessToken} />
                        </RequireAuth>
                    }
                />
                <Route
                    path="/user/personal-info"
                    element={
                        <RequireAuth role="user">
                            <PersonalInfor accessToken={accessToken} />
                        </RequireAuth>
                    }
                />
                <Route path="*" element={<NotFoundPage />} />
            </Routes>
        </Router>
    );
};

export default App;

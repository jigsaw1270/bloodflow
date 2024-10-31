import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../components/Header/Header';
import { useLocation } from 'react-router-dom';

const Main = () => {
    const location = useLocation();
    const isLoginPage = location.pathname === '/login';

    return (
        <div>
            {/* Only show header if not on login page */}
            {!isLoginPage && <Header  />}
            <Outlet />
        </div>
    );
};

export default Main;
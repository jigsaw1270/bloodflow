// components/Home/Home.jsx
import React from 'react';
import { useAuth } from '../../contexts/Authcontext';

const Home = () => {
    const { user } = useAuth();

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Welcome, {user.displayName || user.email}!
            </h2>
            <p className="text-gray-600">
                This is your protected home page. Only authenticated users can see this content.
            </p>
        </div>
    );
};

export default Home;
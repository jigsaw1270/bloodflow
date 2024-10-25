import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/Authcontext';
import { getAuth, signOut } from 'firebase/auth';

const Header = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const auth = getAuth();

    const handleSignOut = async () => {
        try {
            await signOut(auth);
            navigate('/login');
        } catch (error) {
            console.error('Error signing out:', error);
        }
    };

    return (
        <nav className="bg-white shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                <div className="flex justify-between items-center">
                    <div className="flex space-x-8">
                        <Link 
                            to="/" 
                            className="text-gray-900 hover:text-gray-600 font-medium"
                        >
                            Home
                        </Link>
                    </div>
                    <div className="flex items-center space-x-4">
                        {user ? (
                            <div className="flex items-center space-x-4">
                                <span className="text-sm text-gray-500">
                                    {user.displayName || user.email}
                                </span>
                                <button
                                    onClick={handleSignOut}
                                    className="text-sm text-red-600 hover:text-red-800"
                                >
                                    Sign Out
                                </button>
                            </div>
                        ) : (
                            <Link 
                                to="/login"
                                className="text-gray-900 hover:text-gray-600 font-medium"
                            >
                                Login
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Header;
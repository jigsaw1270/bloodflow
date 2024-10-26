import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/Authcontext';
import { getAuth, signOut } from 'firebase/auth';

const Header = () => {
    const { user } = useAuth();
    const auth = getAuth();

    const handleSignOut = async () => {
        try {
            await signOut(auth);
            localStorage.removeItem('user');
            setTimeout(() => {
                window.location.reload(); // Force a reload after a short delay
            }, 1000); // Adjust the delay as needed (100 ms is just an example)
        } catch (error) {
            console.error('Error signing out:', error);
        }
    };

    return (
        <div className="bg-white shadow-sm">
            <div className="max-w-7xl mx-auto px-4 py-4">
                <div className="flex justify-between items-center">
                    <Link to="/" className="text-xl font-semibold text-gray-800">
                        Home
                    </Link>
                    
                    {user && (
                        <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-3">
                                <img 
                                    src={user.photoURL} 
                                    alt={user.displayName}
                                    className="w-8 h-8 rounded-full"
                                />
                                <span className="text-gray-700 font-medium">
                                    {user.displayName}
                                </span>
                            </div>
                            <button
                                onClick={handleSignOut}
                                className="px-4 py-2 text-sm text-red-600 hover:text-red-800 font-medium"
                            >
                                Sign Out
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Header;
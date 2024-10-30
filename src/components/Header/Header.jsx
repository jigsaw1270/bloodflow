import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/Authcontext';
import { getAuth, signOut } from 'firebase/auth';
import SpaceButton from '../Button/SpaceButton';

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
        <div className="bg-white-skyblue shadow-sm rounded-xl">
            <div className="max-w-7xl mx-auto px-4 py-4">
                <div className="md:flex justify-between items-center">
                    <Link to="/" className="text-2xl font-bold text-white font-telma">
                        Bloodflow
                    </Link>
                    
                    {user && (
                        <div className="flex items-center justify-between space-x-4 font-clash">
                            <div className="md:flex md:items-center md:space-x-3">
                                <img 
                                    src={user.photoURL} 
                                    alt={user.displayName}
                                    className="w-8 h-8 rounded-full"
                                />
                                <span className="text-gray-700 font-medium">
                                    {user.displayName}
                                </span>
                            </div>
                        <button className='btn btn-sm btn-outline btn-pale-yellow' onClick={handleSignOut}>Sign out</button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Header;
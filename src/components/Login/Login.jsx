import React, { useState } from 'react';
import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
import { useNavigate } from 'react-router-dom';
import { Sprout } from 'lucide-react';
import SpaceButton from '../Button/SpaceButton';
import svglogin from '../../assets/images/login.svg'

const Login = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const auth = getAuth();

    const handleSignIn = async (provider) => {
        try {
            setLoading(true);
            setError(null);
            const result = await signInWithPopup(auth, provider);
            const { from } = location.state || { from: { pathname: "/" } };
            navigate(from);  // Redirect to previous location or default to "/"
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const buttonText = (
        <>
       <div className='flex items-center justify-between space-x-4'>
       <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M21.35 11.1h-9.17v2.73h6.51c-.33 3.81-3.5 5.44-6.5 5.44C8.36 19.27 5 16.25 5 12c0-4.1 3.2-7.27 7.2-7.27c3.09 0 4.9 1.97 4.9 1.97L19 4.72S16.56 2 12.1 2C6.42 2 2.03 6.8 2.03 12c0 5.05 4.13 10 10.22 10c5.35 0 9.25-3.67 9.25-9.09c0-1.15-.15-1.81-.15-1.81Z"
            />
          </svg>
          <span>{loading ? 'Signing in...' : 'Continue with Google'}</span>
       </div>
        </>
      );

    return (
        <div className="min-h-screen bg-lavender-pink-gradient">
        <h1 className='text-5xl font-telma my-4 pt-8 text-light-green'>Bloodflow</h1>
            <div className='flex flex-col items-center justify-center p-4 rounded-xl'>
            <div className='flex flex-col items-center'>
                <Sprout className='size-20 text-light-green text-center'/>
                <h1 className='font-semibold text-xl  font-clash md:px-20 text-light-green'>Menstrual blood is the only source of blood that is not automatically induced. Yet in modern society, this is the most hidden blood, the one so rarely spoken of and almost never seen, except privately by women.</h1>
                <img src={svglogin} alt="svglogin" className='w-[20rem]' />
            </div>
                <div className="bg-light-green rounded-2xl shadow-lg w-full max-w-md overflow-hidden p-8">
                    <div className="space-y-4">
                        {error && (
                            <div className="bg-red-50 text-red-500 p-4 rounded-lg text-sm mb-4">
                                {error}
                            </div>
                        )}

                        <SpaceButton
                        text={buttonText}
                            onClick={() => handleSignIn(new GoogleAuthProvider())}
                            disabled={loading}
                            // className="w-full bg-white hover:bg-gray-50 text-gray-800 font-semibold py-3 px-4 border border-gray-300 rounded-lg shadow-sm transition duration-200 flex items-center justify-center space-x-2"
                        >
                        </SpaceButton>
                        <small className='font-clash underline text-deep-purple'>sign up  using your gmail</small>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default Login;
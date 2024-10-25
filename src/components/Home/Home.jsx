import React from 'react';
import { useAuth } from '../../contexts/Authcontext';
import PeriodTracker from '../PeriodTracker';

const Home = () => {
    const { user } = useAuth();

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            {/* Empty for now - ready for additional content */}
            <PeriodTracker/>
        </div>
    );
};

export default Home;
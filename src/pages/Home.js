import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
    return (
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
            <h2>Home</h2>
            <div style={{ margin: '20px' }}>
                <Link to="/login">
                    <button>Go to Login</button>
                </Link>
            </div>
            <div style={{ margin: '20px' }}>
                <Link to="/profile">
                    <button>Go to Profile</button>
                </Link>
            </div>
        </div>
    );
}

export default Home;
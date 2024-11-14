import React from 'react';
import { Link } from 'react-router-dom';
import useLogout from "../hooks/useLogout";
function Home() {
    const logout = useLogout();

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
            <div style={{ margin: '20px' }}>
                <button onClick={logout}>Logout</button>
            </div>
        </div>
    );
}

export default Home;
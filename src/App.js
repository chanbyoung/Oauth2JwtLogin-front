import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from "./pages/Home";
import SocialLoginButtons from './components/SocialLoginButtons';
import LoginSuccess from './pages/LoginSuccess';
import AdditionalSetup from "./pages/AdditionalSetUp";
import MemberProfile from "./pages/MemberProfile";
import TestPage from './pages/test';
function App() {
    return (
        <Router>
            <Routes>
                <Route path='/test' element={<TestPage/>}/>
                <Route path="/" element={<Home/>}/>
                <Route path="/login" element={<SocialLoginButtons/>}/>
                <Route path="/success-page" element={<LoginSuccess/>}/>
                <Route path="/signUp/setUp" element={<AdditionalSetup/>}/>
                <Route path="/profile" element={<MemberProfile/>}/>
            </Routes>
        </Router>
    );
}

export default App;
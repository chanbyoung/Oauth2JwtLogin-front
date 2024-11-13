// src/pages/LoginSuccess.js
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const LoginSuccess = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const retrieveTokens = () => {
            const accessToken = getCookie("accessToken");
            const refreshToken = getCookie("refreshToken");

            if (accessToken && refreshToken) {
                // 로컬 스토리지에 토큰 저장
                localStorage.setItem("accessToken", accessToken);
                localStorage.setItem("refreshToken", refreshToken);

                // 토큰 로그 출력
                console.log("Access Token:", accessToken);
                console.log("Refresh Token:", refreshToken);

                // 홈 페이지로 이동
                navigate('/home');
            } else {
                console.error("토큰이 존재하지 않습니다.");
                // 로그인 페이지로 리다이렉트
                navigate('/login');
            }
        };

        // Helper function to get specific cookie value by name
        const getCookie = (name) => {
            const cookieString = document.cookie;
            console.log("모든 쿠키:", cookieString); // 전체 쿠키 문자열 출력
            const cookies = cookieString.split("; ").reduce((acc, cookie) => {
                const [key, value] = cookie.split("=");
                acc[key] = value;
                return acc;
            }, {});
            return cookies[name] || null;
        };

        retrieveTokens();
    }, [navigate]);

    return (
        <div>
            <p>로그인 성공! 잠시만 기다려주세요...</p>
        </div>
    );
};

export default LoginSuccess;
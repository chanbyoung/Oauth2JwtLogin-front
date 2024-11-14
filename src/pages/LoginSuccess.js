import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';

const LoginSuccess = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        const urlParams = new URLSearchParams(location.search);
        const account = urlParams.get('account');
        const tempToken = urlParams.get('tempToken');
        const isGuest = urlParams.get('isGuest') === 'true';

        if (!tempToken) {
            console.error("tempToken이 존재하지 않음");
            navigate('/login');
            return;
        }

        const fetchTokens = async () => {
            try {
                console.log("토큰 발급 요청 중...");
                const response = await axiosInstance.get(`/api/v1/auth/issue-final-token`, { params: { tempToken } });
                console.log("응답 받음:", response);

                const { accessToken, refreshToken } = response.data.data || {};

                if (accessToken && refreshToken) {
                    console.log("토큰 발급 성공");
                    localStorage.setItem('accessToken', accessToken);
                    localStorage.setItem('refreshToken', refreshToken);

                    if (isGuest) {
                        navigate(`/signUp/setUp?account=${account}`);
                    } else {
                        navigate('/');
                    }
                } else {
                    throw new Error("토큰 발급 실패: 토큰이 존재하지 않습니다.");
                }
            } catch (error) {
                console.error("토큰 발급 실패:", error.response || error.message);
                navigate('/login');
            } finally {
                setLoading(false);
            }
        };

        fetchTokens();
    }, [location.search, navigate]);

    return (
        <div>
            {loading ? <p>로그인 성공! 잠시만 기다려주세요...</p> : null}
        </div>
    );
};

export default LoginSuccess;
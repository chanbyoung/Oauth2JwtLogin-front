import React from 'react';

const SocialLoginButtons = () => {
    const handleLogin = (provider) => {
        // 각 소셜 로그인 API의 엔드포인트 URL로 리디렉션
        window.location.href = `http://localhost:8080/oauth2/authorization/${provider}`;
    };

    return (
        <div>
            <button onClick={() => handleLogin('google')}>구글 로그인</button>
            <button onClick={() => handleLogin('kakao')}>카카오 로그인</button>
            <button onClick={() => handleLogin('naver')}>네이버 로그인</button>
        </div>
    );
};

export default SocialLoginButtons;
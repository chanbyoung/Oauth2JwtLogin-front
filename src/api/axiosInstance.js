import axios from "axios";

const getToken = () => {
    return localStorage.getItem('accessToken');
};

// Axios 인스턴스 생성
const axiosInstance = axios.create({
    baseURL: 'http://localhost:8080', // 서버 API 엔드포인트로 설정
    withCredentials: true,
});

// 요청 인터셉터 설정
axiosInstance.interceptors.request.use(
    (config) => {
        const token = getToken();
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`; // JWT 토큰을 헤더에 추가
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

const refreshRefreshToken = async () => {
    try {
        const refreshToken = localStorage.getItem('refreshToken');
        console.log('Refresh Token:', refreshToken); // 디버깅 로그
        if (!refreshToken) throw new Error('No refresh token available');
        const response = await axios.post('http://localhost:8080/api/v1/auth/refresh/reissue', { refreshToken });
        console.log('서버 응답:', response.data); // 서버 응답 확인
        const newRefreshToken = response.data.refreshToken;
        localStorage.setItem('refreshToken', newRefreshToken); // 새 리프레시 토큰 저장
        console.log('Refresh token successfully renewed');
    } catch (err) {
        console.error('Failed to renew refresh token:', err);
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
    }
};

// 응답 인터셉터 설정 (토큰 만료 및 리프레시 토큰 만료 임박 처리)
axiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        const originalRequest = error.config;
        if (error.response && error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                const refreshToken = localStorage.getItem('refreshToken'); // refresh token 가져오기
                if (refreshToken) {
                    // 새 accessToken 요청
                    const response = await axios.post('http://localhost:8080/api/v1/auth/access/refresh', { refreshToken });
                    const newAccessToken = response.data.accessToken; // 새 accessToken
                    localStorage.setItem('accessToken', newAccessToken); // accessToken 저장
                    originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
                    console.log('재발급 성공!');

                    if (response.data && response.data.refreshTokenWillExpire) {
                        console.log('Refresh token is about to expire, renewing...');
                        await refreshRefreshToken(); // 리프레시 토큰 재발급
                    }
                    
                    return axiosInstance(originalRequest); // 실패한 요청 재시도
                }
            } catch (err) {
                console.error('Refresh token expired, logging out...');
                // Refresh 토큰 만료 처리
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');
                window.location.href = '/login'; // 로그인 페이지로 리다이렉트
            }
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;
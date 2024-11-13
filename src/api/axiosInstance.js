// src/api/axiosInstance.js
import axios from 'axios';

// 토큰을 가져오는 함수
const getAccessToken = () => localStorage.getItem('accessToken');
const getRefreshToken = () => localStorage.getItem('refreshToken');

// axios 인스턴스 생성
const axiosInstance = axios.create({
    baseURL: 'http://localhost:8080',
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
});

// 요청 인터셉터 설정: 모든 요청에 accessToken을 헤더에 추가
axiosInstance.interceptors.request.use(
    (config) => {
        const token = getAccessToken();
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// 응답 인터셉터 설정: 401 에러 시 토큰 갱신 로직 추가
axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        if (error.response && error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                // 토큰 갱신 요청
                const refreshToken = getRefreshToken();
                const response = await axios.post('http://localhost:8080/auth/refresh', {
                    refreshToken,
                });

                const newAccessToken = response.data.accessToken;
                localStorage.setItem('accessToken', newAccessToken);

                // 갱신된 토큰을 헤더에 넣어 원래 요청 재시도
                originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
                return axiosInstance(originalRequest);
            } catch (refreshError) {
                console.error('토큰 갱신에 실패했습니다.', refreshError);
                // 필요 시 로그아웃 처리 및 로그인 페이지로 리다이렉트
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;
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

// 응답 인터셉터 설정 (토큰 만료 시 처리)
axiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        const originalRequest = error.config;
        if (error.response && error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                const refreshToken = localStorage.getItem('refreshToken'); // refresh token을 저장해 둔 위치에서 가져옴
                if (refreshToken) {
                    // 새 accessToken 요청
                    const response = await axios.post('http://localhost:8080/api/v1/auth/refresh', { refreshToken });
                    const newAccessToken = response.data.data.accessToken; // data 형식에 맞게 접근 (예: { data: { accessToken: ... } })
                    localStorage.setItem('accessToken', newAccessToken); // 새 accessToken 저장
                    originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
                    return axiosInstance(originalRequest); // 실패한 요청 재시도
                }
            } catch (err) {
                // Refresh 토큰이 만료된 경우 로그아웃 처리 등 추가 대응
                console.error('Refresh token expired, logging out...');
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');
                window.location.href = '/login'; // 로그인 페이지로 리다이렉트
            }
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;
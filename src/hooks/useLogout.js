import { useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
function useLogout() {
    const navigate = useNavigate();

    const logout = async () => {
        const accessToken = localStorage.getItem('accessToken');

        if (accessToken) {
            try {
                await axiosInstance.post(
                    '/api/v1/auth/logout',
                    {},
                    {
                        headers: {
                            Authorization: `Bearer ${accessToken}`,
                        },
                    }
                );

                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');
                navigate('/login');
            } catch (error) {
                console.error('로그아웃 중 에러 발생:', error);
            }
        }
    };

    return logout;
}

export default useLogout;
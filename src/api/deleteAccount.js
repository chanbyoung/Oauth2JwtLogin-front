import axiosInstance from './axiosInstance';

const deleteAccount = async () => {
    const confirmed = window.confirm("계정을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.");
    if (confirmed) {
        try {
            const response = await axiosInstance.delete('/api/v1/auth/delete');
            if (response.status === 204) {
                alert("계정이 성공적으로 삭제되었습니다.");
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');
                window.location.href = '/login';
            }
        } catch (error) {
            console.error("계정 삭제 중 오류가 발생했습니다:", error);
            alert(error.response?.data?.message || "계정 삭제에 실패했습니다.");
        }
    }
};

export default deleteAccount;
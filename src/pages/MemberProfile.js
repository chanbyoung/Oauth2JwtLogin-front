import React, { useEffect, useState } from 'react';
import axiosInstance from '../api/axiosInstance'; // axiosInstance를 import

const MemberProfile = () => {
    const [profile, setProfile] = useState({ nickname: "", profileImageUrl: "" });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await axiosInstance.get('/api/v1/member/profile'); // axiosInstance 사용
                setProfile(response.data);
            } catch (error) {
                console.error("프로필 정보를 가져오는 중 오류가 발생했습니다:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    if (loading) return <p>로딩 중...</p>;

    // profileImageUrl 로그 출력
    console.log("프로필 이미지 URL:", profile.profileImageUrl);

    return (
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <h2>{profile.nickname}</h2>
            {profile.profileImageUrl ? (
                <img
                    src={`http://localhost:8080${profile.profileImageUrl}`}
                    alt="프로필 이미지"
                    style={{ width: '150px', height: '150px', borderRadius: '50%' }}
                />
            ) : (
                <p>프로필 이미지가 없습니다.</p>
            )}
        </div>
    );
};

export default MemberProfile;
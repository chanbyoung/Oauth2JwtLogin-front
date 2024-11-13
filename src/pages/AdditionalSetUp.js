import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const AdditionalSetup = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [memberAccount, setMemberAccount] = useState(null);
    const [nickname, setNickname] = useState("");
    const [profileImage, setProfileImage] = useState(null);

    // 쿼리 파라미터에서 member_account 값 가져오기
    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const account = queryParams.get("account");
        setMemberAccount(account);
    }, [location]);

    // 닉네임 및 프로필 이미지 제출 핸들러
    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("nickname", nickname);
        formData.append("profileImage", profileImage);

        try {
            const response = await fetch(`http://localhost:8080/api/v1/member/${memberAccount}/additional-setup`, {
                method: "POST",
                body: formData,
            });

            if (response.ok) {
                alert("추가 설정이 완료되었습니다.");
                navigate("/success-page"); // 추가 설정 완료 후 홈 페이지로 이동
            } else {
                console.error("추가 설정 실패:", response.statusText);
            }
        } catch (error) {
            console.error("추가 설정 중 오류:", error);
        }
    };

    // 이미지 파일 선택 핸들러
    const handleFileChange = (e) => {
        setProfileImage(e.target.files[0]);
    };

    return (
        <div>
            <h2>추가 설정 페이지</h2>
            {memberAccount ? (
                <div>
                    <p>회원 계정: {memberAccount}</p>
                    <form onSubmit={handleSubmit}>
                        <div>
                            <label>닉네임: </label>
                            <input
                                type="text"
                                value={nickname}
                                onChange={(e) => setNickname(e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <label>프로필 이미지: </label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                            />
                        </div>
                        <button type="submit">설정 완료</button>
                    </form>
                </div>
            ) : (
                <p>회원 정보를 불러오는 중...</p>
            )}
        </div>
    );
};

export default AdditionalSetup;
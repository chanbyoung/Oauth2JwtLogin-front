// src/components/TestPage.js

import React, { useState, useEffect } from 'react';
import axiosInstance from '../api/axiosInstance';
import ProfileUpdate from '../components/ProfileUpdate';

const TestPage = () => {
  const [testResponse, setTestResponse] = useState('');
  const [profile, setProfile] = useState(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [profileError, setProfileError] = useState(null);

  // 페이지가 로드될 때 테스트 요청 보내기
  useEffect(() => {
    const sendTestRequest = async () => {
      try {
        const res = await axiosInstance.get('/api/v1/auth/test');
        if (res.status === 204) {
          setTestResponse('요청 성공: No Content (204)');
        } else {
          setTestResponse(`요청 성공: ${res.status}`);
        }
      } catch (error) {
        setTestResponse(`요청 실패: ${error.message}`);
      }
    };

    sendTestRequest(); // 요청 실행
  }, []); // 빈 배열을 의존성으로 전달하여 한 번만 실행

  // 페이지가 로드될 때 프로필 조회 요청 보내기
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axiosInstance.get('/api/v1/member/profile');
        setProfile(res.data);
      } catch (error) {
        setProfileError(
          error.response?.data?.message ||
            error.message ||
            '프로필을 불러오는 중 오류가 발생했습니다.'
        );
      } finally {
        setProfileLoading(false);
      }
    };

    fetchProfile(); // 프로필 요청 실행
  }, []); // 빈 배열을 의존성으로 전달하여 한 번만 실행

  return (
    <div style={styles.container}>
      <h1>테스트 요청 페이지</h1>

      {/* 테스트 요청 응답 결과 출력 */}
      <div style={styles.section}>
        <h3>테스트 요청 응답:</h3>
        <pre>{testResponse}</pre>
      </div>

      {/* 프로필 조회 응답 출력 */}
      <div style={styles.section}>
        <h3>회원 프로필:</h3>
        {profileLoading ? (
          <p>프로필을 불러오는 중...</p>
        ) : profileError ? (
          <p style={styles.error}>오류: {profileError}</p>
        ) : profile ? (
          <div style={styles.profileContainer}>
            <p>
              <strong>이름:</strong> {profile.name}
            </p>
            <p>
              <strong>직업:</strong> {profile.jobName}
            </p>
            {profile.profileImage && (
              <div style={styles.imageContainer}>
                <strong>프로필 이미지:</strong>
                <img
                  src={
                    profile.profileImage.startsWith('http')
                      ? profile.profileImage
                      : `${process.env.REACT_APP_BACKEND_URL}${profile.profileImage}`
                  }
                  alt="프로필"
                  style={styles.image}
                />
              </div>
            )}
          </div>
        ) : (
          <p>프로필 정보가 없습니다.</p>
        )}
      </div>

      {/* 프로필 업데이트 컴포넌트 추가 */}
      <div style={styles.section}>
        <ProfileUpdate />
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: '20px',
    fontFamily: 'Arial, sans-serif',
    maxWidth: '800px',
    margin: '0 auto',
  },
  section: {
    marginTop: '20px',
    padding: '15px',
    background: '#f8f9fa',
    borderRadius: '8px',
  },
  profileContainer: {
    marginTop: '10px',
  },
  imageContainer: {
    marginTop: '10px',
  },
  image: {
    width: '200px',
    height: '200px',
    objectFit: 'cover',
    borderRadius: '50%',
    marginTop: '10px',
  },
  error: {
    color: 'red',
  },
};

export default TestPage;
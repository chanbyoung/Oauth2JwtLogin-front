// src/components/ProfileUpdate.js

import React, { useState } from 'react';
import axiosInstance from '../api/axiosInstance';

const ProfileUpdate = () => {
  const [name, setName] = useState('');
  const [jobName, setJobName] = useState('');
  const [profileImage, setProfileImage] = useState(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setProfileImage(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // FormData 객체 생성
    const formData = new FormData();
    formData.append('name', name);
    formData.append('jobName', jobName);
    if (profileImage) {
      formData.append('profileImage', profileImage);
    }

    try {
      setLoading(true);
      setMessage('');

      // PUT 요청 보내기
      const response = await axiosInstance.put('/api/update', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 204) {
        setMessage('프로필이 성공적으로 업데이트되었습니다.');
      }
    } catch (error) {
      // 오류 메시지 처리
      setMessage(
        error.response?.data?.message ||
          error.message ||
          '프로필 업데이트에 실패했습니다.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h2>프로필 업데이트</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.formGroup}>
          <label>이름:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            style={styles.input}
          />
        </div>
        <div style={styles.formGroup}>
          <label>직업:</label>
          <input
            type="text"
            value={jobName}
            onChange={(e) => setJobName(e.target.value)}
            required
            style={styles.input}
          />
        </div>
        <div style={styles.formGroup}>
          <label>프로필 이미지:</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            style={styles.input}
          />
        </div>
        <button type="submit" disabled={loading} style={styles.button}>
          {loading ? '업데이트 중...' : '업데이트'}
        </button>
      </form>
      {message && <p style={styles.message}>{message}</p>}
    </div>
  );
};

const styles = {
  container: {
    padding: '20px',
    fontFamily: 'Arial, sans-serif',
    maxWidth: '600px',
    margin: '20px auto',
    border: '1px solid #ddd',
    borderRadius: '8px',
    background: '#f9f9f9',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
  },
  formGroup: {
    marginBottom: '15px',
  },
  input: {
    padding: '8px',
    fontSize: '16px',
    marginTop: '5px',
    width: '100%',
    boxSizing: 'border-box',
  },
  button: {
    padding: '10px',
    fontSize: '16px',
    background: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  message: {
    marginTop: '15px',
    color: 'green',
  },
};

export default ProfileUpdate;
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LoginScreen } from '../../components/login/loginScreen';
import { getCookie } from '../../cookie';

const Start = () => {
  // 만약 인증 토큰이 있으면 홈페이지로 이동
  // 만약 인증 토큰이 없으면 로그인 스크린으로 보여줌.
  const token = !!getCookie('AccessToken');
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      navigate('/home');
    }
  }, []);

  return (
    <>
      <LoginScreen />
    </>
  );
};

export default Start;

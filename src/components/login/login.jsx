import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Envelope, Gogo, GoSignupLink, LoginForm, LoginInput, LoginWrap } from './loginstyle';
import { setCookie } from '../../cookie';
import { BASE_URL } from '../../api/baseURL';

export const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isActive, setIsActive] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    // 둘다 값이 있으면 setIsActive가 true
    if (email && password) {
      setIsActive(true);
    } else {
      setIsActive(false);
    }
  }, [email, password]);

  async function login() {
    if (isActive === true) {
      try {
        const res = await axios.post(`${BASE_URL}/user/login`, {
          headers: {
            'Content-type': 'application/json',
          },
          user: {
            email,
            password,
          },
        });

        if (res.data.message === '이메일 또는 비밀번호가 일치하지 않습니다.') {
          setMessage('이메일 또는 비밀번호가 일치하지 않습니다.');
        } else {
          // 토큰 검증 기능
          // data가 valid 상태일 때만 local storage에 유저 정보가 추가되고, axois 실패 시 콘솔에 에러 출력
          try {
            await axios
              .get(`${BASE_URL}/user/checktoken`, {
                headers: {
                  Authorization: `Bearer ${res.data.user.token}`,
                  'Content-type': 'application/json',
                },
              })
              .then((data) => {
                if (data.data.isValid) {
                  setMessage('');
                  // localStorage.setItem('AccessToken', res.data.user.token);
                  // localStorage.setItem('AccountName', res.data.user.accountname);
                  setCookie('AccessToken', res.data.user.token, {
                    path: '/',
                    secure: true,
                    sameSite: 'strict',
                  });
                  setCookie('AccountName', res.data.user.accountname, {
                    path: '/',
                    secure: true,
                    sameSite: 'strict',
                  });
                  navigate('/');
                } else {
                  alert('유효하지 않은 접근입니다');
                }
              })
              .catch((error) => {
                console.log(error);
              });
          } catch (error) {
            console.log(error);
          }
        }
      } catch (error) {
        console.log(error);
      }
    }
  }

  return (
    <Envelope>
      <section className='envbox'>
        <div className='env'>
          <div className='openEnv'>
            <label className='top'></label>
            <div className='content'>
              <p className='title'>로그인</p>
              <LoginForm>
                <LoginWrap>
                  <LoginInput
                    type='text'
                    id='email'
                    name='email'
                    placeholder='이메일'
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <LoginInput
                    type='password'
                    id='password'
                    name='password'
                    placeholder='비밀번호'
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <span className='message'>{message}</span>
                </LoginWrap>
                <Gogo bg='#85CE2D' isActive={isActive} onClick={login} type='button'>
                  로그인
                </Gogo>
              </LoginForm>

              <span className='joinMessage'>앗! 아직 럭킷메이트가 아니신가요?</span>
              <GoSignupLink to={'/join'}>회원가입</GoSignupLink>
            </div>
            <div className='rest'></div>
          </div>
        </div>
      </section>
    </Envelope>
  );
};

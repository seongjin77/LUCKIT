import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Follow } from '../../components/follow/follow';
import { FollowPageWrap, FollowPageUl } from './followstyle';
import { FollowerHeader } from '../../components/header/header';
import { getCookie } from '../../cookie';
import { BASE_URL } from '../../api/baseURL';

export const YourFollow = () => {
  /* 상대방 프로필에서 팔로워 팔로잉 누를때 이동하는 페이지 */
  // 상대방 계정 아이디를 가져 와야함.
  useEffect(() => {
    getFollowerList();
    getFollowingList();
  }, []);

  const location = useLocation();
  const accountname = location.state.accountname;
  const followURL = `${BASE_URL}/profile/${accountname}/follower?limit=1000`;
  const followingURL = `${BASE_URL}/profile/${accountname}/following?limit=1000`;
  const token = getCookie('AccessToken');
  const target = useLocation()?.state.text;
  const [followerList, setFollowerList] = useState([]);
  const [followingList, setFollowingList] = useState([]);

  async function getFollowerList() {
    await fetch(followURL, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-type': 'application/json',
      },
    })
      .then((data) => data.json())
      .then((data) => setFollowerList([...data]));
  }

  async function getFollowingList() {
    await fetch(followingURL, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-type': 'application/json',
      },
    })
      .then((data) => data.json())
      .then((data) => setFollowingList([...data]));
  }

  return (
    <>
      <Helmet>
        <title>LUCKIT - Follow </title>
        <meta name='description' content='럭킷 팔로우 페이지입니다. 럭킷들이 팔로우한 럭킷 메이트들을 확인해보세요!' />
      </Helmet>
      <FollowerHeader target={target} />
      <FollowPageWrap>
        <FollowPageUl>
          {/* 조건부 렌더링. Follow에 내려주는 프롭스 값이 다름 */}
          {target === 'followers'
            ? followerList.map((user) => {
                return <Follow user={user} key={user._id} />;
              })
            : followingList.map((user) => {
                return <Follow user={user} key={user._id} />;
              })}
        </FollowPageUl>
      </FollowPageWrap>
    </>
  );
};

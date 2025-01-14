import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Helmet } from 'react-helmet-async';
import { NavBar } from '../../components/navbar/navBar';
import { AxiosFollow } from '../../reducers/getFollowSlice';
import DefaultHome from './defaultHome';
import { HomeWrap } from './homestyle';
import { MarketFeedHome } from './MarketFeedHome';
import { getCookie } from '../../cookie';
import { BASE_URL } from '../../api/baseURL';

export const Home = () => {
  const [scrollTopData, setScrollTopData] = useState(false);
  const accountName = getCookie('AccountName');
  const dispatch = useDispatch();
  const followingData = useSelector((state) => state.followInfoSlice.followData);
  const followimgURL = `${BASE_URL}/profile/${accountName}/following?limit=100`;

  useEffect(() => {
    dispatch(AxiosFollow(followimgURL));
  }, []);

  const onScroll = (e) => {
    if (e.currentTarget.scrollTop >= 300) {
      setScrollTopData(true);
    } else if (e.currentTarget.scrollTop < 300) {
      setScrollTopData(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>LUCKIT - Home </title>
        <meta name='description' content='럭킷 홈페이지입니다. 럭킷메이트들에게 매칭신청을 해보세요!' />
      </Helmet>
      <HomeWrap onScroll={onScroll}>
        {followingData.length > 0 ? (
          <MarketFeedHome scrollTopData={scrollTopData} followingData={followingData} />
        ) : (
          <DefaultHome />
        )}
        <NavBar />
      </HomeWrap>
    </>
  );
};

export default Home;

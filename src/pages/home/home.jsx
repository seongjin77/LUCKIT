/* eslint-disable */
import React, { Suspense, lazy, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Helmet } from 'react-helmet-async';
import { NavBar } from '../../components/navbar/navBar';
import { AxiosFollow } from '../../reducers/getFollowSlice';
import DefaultHome from './defaultHome';
import { HomeWrap } from './homestyle';
// import { MarketFeedHome } from './MarketFeedHome';
import { getCookie } from '../../cookie';
import { Loading } from '../../components/loading/loading';

const MarketFeedHome = lazy(()=> import('./MarketFeedHome'))

export const Home = () => {
  const [scrollTopData, setScrollTopData] = useState(false);
  const accountName = getCookie('Account Name');
  const dispatch = useDispatch();
  const followingData = useSelector((state) => state.followInfoSlice.followData);
  const followimgURL = `https://mandarin.api.weniv.co.kr/profile/${accountName}/following?limit=1000`;

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
            <Suspense fallback={<Loading/>}>
              <MarketFeedHome scrollTopData={scrollTopData} followingData={followingData} />
            </Suspense>
              ) : (
                <DefaultHome />
                )}
          <NavBar />
        </HomeWrap>
    </>
  );
};

export default Home;

/* eslint-disable */
import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Helmet } from 'react-helmet-async';
import { ProfileAndChatHeader } from '../../components/header/header';
import { MarketPreviewPost } from '../../components/market-preview-post/marketPreviewPost';
import { ProfileBox } from '../../components/profile-box/profileBox';
import {
  ProfileWrap,
  SnsPostBtn,
  NavLinkStyle,
  ImgAlbumBox,
  ImgAlbumList,
  SnsPostWrap,
  SnsPostBox,
  MultiImgLayers,
} from './myprofilestyle';
import { NavBar } from '../../components/navbar/navBar';
import MainSnsPost from '../../components/mainpost/mainSnsPost';
import { ProfilePostUploadBtn } from '../../components/button/iconBtn';
import { AxiosSnsPost } from '../../reducers/getSnsPostSlice';
import { ListAndAlbumBtn } from '../../components/button/button';
import { getCookie } from '../../cookie';
import { useInView } from 'react-intersection-observer';

export const Profile = () => {
  const [imgList, setImgList] = useState(true);
  const [imgAlbum, setImgAlbum] = useState(false);
  const myAccountName = getCookie('Account Name');
  const { id } = useParams();
  const snsPostData = useSelector((state) => state.snsPostSlice.snspost);
  const dispatch = useDispatch();
  const limitNum = useRef(10);
  //const snsPostURL = `https://mandarin.api.weniv.co.kr/post/${id}/userpost/?limit=${limitNum.current}`;
  const isEnd = useSelector((state) => state.snsPostSlice.endpoint);

  //console.log('확인', isEnd);

  const snsPostURL = (개수) => {
    const url = `https://mandarin.api.weniv.co.kr/post/${id}/userpost/?limit=${개수}`;

    return url;
  };

  useEffect(() => {
    dispatch(AxiosSnsPost(snsPostURL(limitNum.current)));
    console.log('첫 리덕스 성크로 데이터 불러옴');
  }, [id]);

  // const [ref, inView] = useInView();

  // useEffect(() => {
  //   console.log('인뷰 실행');
  //   if (snsPostData.length !== 0 && inView && !isEnd) {
  //     limitNum.current += 10;

  //     console.log('snsPostURL', snsPostURL(limitNum.current));
  //     dispatch(AxiosSnsPost(snsPostURL(limitNum.current)));
  //   }
  // }, [inView]);

  const target = useRef();

  const callback = (entries) => {
    if(entries[0].isIntersecting && !isEnd){
      console.log('관측되었습니다.');
      limitNum.current += 10
      dispatch(AxiosSnsPost(snsPostURL(limitNum.current)));
    }
  };

  const observer = new IntersectionObserver(callback, { threshold: 1 });
  
  useEffect(()=> {
    if(target.current){
      observer.observe(target.current)
    }
  },[snsPostData]) // 바뀐 데이터를 가져오면 target.current가 존재. 따라서 target 관측시작.


  const onClickListBtn = () => {
    setImgList(true);
    setImgAlbum(false);
  };

  const onClickAlbumBtn = () => {
    setImgList(false);
    setImgAlbum(true);
  };

  const onError = (e) => {
    e.target.style.display = 'none';
  };

  return (
    <>
      <Helmet>
        <title>LUCKIT - 럭킷 프로필</title>
        <meta name='description' content='럭킷 프로필페이지 입니다. 럭킷들의 프로필을 조회해보세요! ' />
      </Helmet>
      <ProfileAndChatHeader />
      <ProfileWrap>
        <ProfileBox />
        <MarketPreviewPost />
        <SnsPostBox style={{ backgroundColor: 'yellow' }}>
          <h2>sns 게시글 피드</h2>
          <SnsPostBtn>
            <ListAndAlbumBtn
              onClickListBtn={onClickListBtn}
              onClickAlbumBtn={onClickAlbumBtn}
              imgList={imgList}
              imgAlbum={imgAlbum}
            />
            {id === myAccountName ? <ProfilePostUploadBtn pathName='/snsupload' /> : null}
          </SnsPostBtn>
          {snsPostData.length !== 0 ? (
            <>
              {/* 무한 스크롤 구현 부분. mainSnsPost가 각각의 게시글 버튼에 따라서 렌더링 시키는 부분이 다름. */}
              <ul>
                {imgList &&
                  snsPostData.map((post, index) => {
                    // post의 마지막 요소만 target 설정.
                    return snsPostData.length - 1 === index ? (
                      <SnsPostWrap style={{ backgroundColor: 'blue' }} ref={target} key={post.id}>
                        <MainSnsPost data={post} />
                      </SnsPostWrap>
                    ) : (
                      <SnsPostWrap style={{ backgroundColor: 'red' }} key={post.id}>
                        <MainSnsPost data={post} />
                      </SnsPostWrap>
                    );
                  })}
              </ul>
              <ImgAlbumBox>
                {imgAlbum &&
                  snsPostData.map((post) => {
                    const imgArr = post.image !== '' ? post.image.split(',') : [];
                    const thumbImg = post.image.split(',')[0];

                    return (
                      <>
                        {post.image ? (
                          <ImgAlbumList key={post.id}>
                            <NavLinkStyle to={`/snspost/${post.id}`}>
                              {imgArr.length > 1 ? (
                                <MultiImgLayers>
                                  <img src={thumbImg} onError={onError} alt='게시글 이미지' />
                                </MultiImgLayers>
                              ) : (
                                <img src={thumbImg} onError={onError} alt='게시글 이미지' />
                              )}
                            </NavLinkStyle>
                          </ImgAlbumList>
                        ) : null}
                      </>
                    );
                  })}
              </ImgAlbumBox>
            </>
          ) : null}
        </SnsPostBox>
      </ProfileWrap>
      <NavBar />
    </>
  );
};

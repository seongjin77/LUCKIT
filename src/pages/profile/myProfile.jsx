/* eslint-disable */
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
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
import { BASE_URL } from '../../api/baseURL';
// import { useInView } from 'react-intersection-observer';

export const Profile = () => {
  const [imgList, setImgList] = useState(true);
  const [imgAlbum, setImgAlbum] = useState(false);
  const myAccountName = getCookie('Account Name');
  const { id } = useParams();
  const snsPostData = useSelector((state) => state.snsPostSlice.snspost);
  const dispatch = useDispatch();
  const limitNum = useRef(10);
  const isEnd = useSelector((state) => state.snsPostSlice.endpoint);
  const snsPostURL = (num) => {
    const url = `${BASE_URL}/post/${id}/userpost/?limit=${num}`;
    return url;
  };

  useLayoutEffect(()=>{
    dispatch(AxiosSnsPost(snsPostURL(limitNum.current)));
  },[id])

  // const [ref, inView] = useInView();

  // useEffect(() => {
  //   if (inView && !isEnd) {
  //     limitNum.current += 10;
  //     dispatch(AxiosSnsPost(snsPostURL(limitNum.current)));
  //   }
  // }, [inView]);

  /// 순수 observer api만 사용
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
        <SnsPostBox>
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
              <ul>
                {imgList &&
                  snsPostData.map((post) => {
                    // post의 마지막 요소만 target 설정.
                   return<SnsPostWrap key={post.id}>
                          <MainSnsPost data={post} />
                        </SnsPostWrap>
                  })}
                  <li ref={target}></li>
              </ul>
              <ImgAlbumBox>
                {imgAlbum &&
                  snsPostData.map((post) => {
                    console.log('확인합니다',post);
                    const imgArr = post.image !== '' ? post.image.split(',') : [];
                    const thumbImg = post.image.split(',')[0];
                    const modifyImg = thumbImg.includes("mandarin.api") ? thumbImg.replace("mandarin.api", "api.mandarin") : thumbImg

                    return (
                      <>
                        {post.image ? (
                          <ImgAlbumList key={post.id}>
                            <NavLinkStyle to={`/snspost/${post.id}`}>
                              {imgArr.length > 1 ? (
                                <MultiImgLayers>
                                  <img src={modifyImg} onError={onError} alt='게시글 이미지' />
                                </MultiImgLayers>
                              ) : (
                                <img src={modifyImg} onError={onError} alt='게시글 이미지' />
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

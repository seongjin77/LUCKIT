import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ProductUploadHeader } from '../../header/header';
import { MarketImage } from './marketImage';
import { MarketInput } from './marketInput';
import { InputWrap, MarketForm } from './marketinputstyle';
import { getCookie } from '../../../cookie';
import { BASE_URL } from '../../../api/baseURL';

export const MarketUpload = () => {
  // 데이터 전송에 필요한 유저 토큰
  const [userToken, setUserToken] = useState();
  const [itemName, setItemName] = useState('');
  const [itemDetail, setItemDetail] = useState('');
  const [isActive, setIsActive] = useState('');
  const [disabled, setIsDisabled] = useState('');
  const [itemImage, setItemImage] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    setUserToken(getCookie('Access Token'));
  }, []);

  useEffect(() => {
    if (itemName.length > 1 && itemDetail.length > 1) {
      setIsActive(true);
      setIsDisabled(false);
    } else {
      setIsActive(false);
      setIsDisabled(true);
    }
  });

  const handleSubmit = async (event) => {
    event.preventDefault();
    event.stopPropagation();
    try {
      await axios
        .post(
          `${BASE_URL}/product`,
          {
            product: {
              itemName: itemName,
              price: 99999999,
              link: itemDetail,
              itemImage: itemImage,
            },
          },
          {
            headers: {
              Authorization: `Bearer ${userToken}`,
              'Content-type': 'application/json',
            },
          }
        )
        .then((res) => {
          const id = res.data.product.author.accountname;

          (function () {
            navigate(`/profile/${id}`);
          })();
        });
    } catch (error) {
      alert('이미지를 넣어주세요');
      console.error(error);
    }
  };

  return (
    <MarketForm method='POST' encType='multipart/form-data' onSubmit={handleSubmit}>
      <ProductUploadHeader isActive={isActive} disabled={disabled} />
      <h1 className='a11y-hidden'>럭킷 메이트 등록 페이지</h1>
      <InputWrap>
        <MarketImage itemImage={itemImage} setItemImage={setItemImage} />
        <MarketInput
          itemName={itemName}
          setItemName={setItemName}
          itemDetail={itemDetail}
          setItemDetail={setItemDetail}
          setIsActive={setIsActive}
          setIsDisabled={setIsDisabled}
        />
      </InputWrap>
    </MarketForm>
  );
};

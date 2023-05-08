import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { getCookie } from '../../../cookie';
import { BASE_URL } from '../../../api/baseURL';
import {
  CommentInpWrap,
  CommentInpform,
  CommentUserImg,
  CommentUserImgBox,
  CommentTextInput,
  CommentSubmitBtn,
} from './commentinputstyle';

const CommentInput = ({ getComments, postId }) => {
  const [comment, setComment] = useState('');
  const [isValid, setIsValid] = useState(false);
  const [authorImg, setAuthorImg] = useState('');
  const token = getCookie('AccessToken');
  const accountName = getCookie('AccountName');

  useEffect(() => {
    if (accountName) {
      axios({
        url: `${BASE_URL}/profile/${accountName}`,
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-type': 'application/json',
        },
      })
        .then((response) => {
          setAuthorImg(response.data.profile.image);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [accountName]);

  const handleInput = (e) => {
    setComment(e.target.value);
  };

  const changeButton = (e) => {
    e.target.value.length > 0 ? setIsValid(true) : setIsValid(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios({
      url: `${BASE_URL}/post/${postId}/comments`,
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-type': 'application/json',
      },
      data: {
        comment: {
          content: `${comment}`,
        },
      },
    })
      .then((response) => {
        setComment('');
        setIsValid(false);
        getComments();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <CommentInpWrap>
      <CommentInpform>
        <CommentUserImgBox>
          <CommentUserImg authorImg={authorImg} />
        </CommentUserImgBox>
        <CommentTextInput
          type='text'
          value={comment}
          placeholder='댓글 입력하기...'
          onChange={handleInput}
          onKeyUp={changeButton}
        />
        <CommentSubmitBtn onClick={handleSubmit} disabled={!isValid}>
          게시
        </CommentSubmitBtn>
      </CommentInpform>
    </CommentInpWrap>
  );
};

export default CommentInput;

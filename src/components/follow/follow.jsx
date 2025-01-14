import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FollowBtn } from '../button/button';
import { FollowInfoWrap, FollowLi } from './followstyle';
import DefaultUserImg from '../../assets/icon/basic-profile-img-.png';
import { getCookie } from '../../cookie';
import { BASE_URL } from '../../api/baseURL';

export const Follow = ({ user }) => {
  const unfollowURL = `${BASE_URL}/profile/${user.accountname}/unfollow`;
  const followURL = `${BASE_URL}/profile/${user.accountname}/follow`;
  const token = getCookie('AccessToken');
  const myAccountName = getCookie('AccountName');
  const [isFollow, setIsFollow] = useState(user.isfollow);
  const navigate = useNavigate();

  const unfollow = async () => {
    await fetch(unfollowURL, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-type': 'application/json',
      },
    });
  };
  const follow = async () => {
    await fetch(followURL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-type': 'application/json',
      },
    });
  };

  const followToggle = () => {
    setIsFollow(!isFollow);

    if (isFollow === true) {
      unfollow();
    } else if (isFollow === false) {
      follow();
    }
  };

  const goYourProfile = () => {
    navigate(`/profile/${user.accountname}`);
  };

  const onErrorImg = (e) => {
    e.target.src = DefaultUserImg;
  };

  return (
    <FollowLi>
      <FollowInfoWrap onClick={goYourProfile}>
        <img
          onError={onErrorImg}
          src={user.image.includes('mandarin.api') ? user.image.replace('mandarin.api', 'api.mandarin') : user.image}
          alt='프로필사진'
        />
        <div>
          <p className='userAccount'>{user.username}</p>
          <p className='userIntro'>{user.accountname}</p>
        </div>
      </FollowInfoWrap>
      {user.accountname !== myAccountName ? (
        <FollowBtn isFollow={isFollow} onClick={followToggle} size='middle' />
      ) : null}
    </FollowLi>
  );
};

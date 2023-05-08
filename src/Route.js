import React from 'react';
import { Navigate } from 'react-router-dom';
import { getCookie } from './cookie';

export function PrivateRoute({ children }) {
  // const token =!!getCookie("AccessToken");
  const token = !!getCookie('AccessToken');

  return token ? children : <Navigate to='/login' />;
}

export function PublicRoute({ children }) {
  // const token =!!getCookie("AccessToken");
  const token = !!getCookie('AccessToken');

  return token ? <Navigate to='/home' /> : children;
}

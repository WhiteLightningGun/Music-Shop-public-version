/** @jsxImportSource @emotion/react */
//import { css } from '@emotion/react';
import './App.css';
import { useContext, useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import FrontPageTemplate from './FrontPageTemplate';
import {
  AlbumData,
  SongData,
  PurchasedAlbumData,
  PurchasedSongData,
} from './ScaffoldData';
import AlbumsPage from './AlbumsPage';
import AlbumPage from './AlbumPage';
import LoginPage from './LoginPage';
import { MyLoginContext } from './LoggedInContext';
import { GetAlbums, GetPurchasedSongs } from './JsonConverters';
import { GetPurchasedAlbums } from './JsonConverters';
import RegisterPage from './Register';
import PasswordReset from './PasswordReset';
import { CheckLoggedIn } from './PostLogin';
import AdminPage from './AdminPage';
import { CheckIsAdmin } from './IsAdminCheck';
import { CartProvider, MyCartContext } from './CartContext';
import Checkout from './Checkout';
import { set } from 'react-hook-form';

const Logout = ({ setLoggedIn }: any) => {
  const context = useContext(MyCartContext);

  const {
    setCartSongData,
    setCartAlbumData,
    setPurchasedSongs,
    setPurchasedAlbums,
  } = context || {};
  const clickHandler = () => {
    sessionStorage.setItem('Bearer', '');
    localStorage.setItem('refresh', '');
    setLoggedIn(false);
    setCartSongData
      ? setCartSongData([])
      : console.log('setCartSongData is undefined or something');
    setCartAlbumData
      ? setCartAlbumData([])
      : console.log('setCartAlbumData is undefined or something');
    setPurchasedSongs
      ? setPurchasedSongs([])
      : console.log('setPurchasedSongs is undefined or something');
    setPurchasedAlbums
      ? setPurchasedAlbums([])
      : console.log('setPurchasedAlbums is undefined or something');
  };
  return (
    <div>
      <button onClick={clickHandler} className="btn btn-danger btn-login">
        <span className="badge">LOGOUT</span>
      </button>
    </div>
  );
};

export default Logout;

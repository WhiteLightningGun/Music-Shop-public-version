/** @jsxImportSource @emotion/react */
//import { css } from '@emotion/react';
import './App.css';
import { useContext } from 'react';
import { MyCartContext } from './CartContext';

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
    localStorage.setItem('purchasedAlbums', '');
    localStorage.setItem('purchasedSongs', '');

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

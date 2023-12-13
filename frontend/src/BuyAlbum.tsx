/** @jsxImportSource @emotion/react */
import { useState, useRef, useEffect, useCallback, useContext } from 'react';
import { AlbumData } from './ScaffoldData';
import { MyCartContext } from './CartContext';
import BuyAlbumAddToCart from './BuyAlbumAddToCart';
import BuyAlbumRemoveFromCart from './BuyAlbumRemoveFromCart';

interface Props {
  data: AlbumData;
}

function BuyAlbum({ data }: Props) {
  const context = useContext(MyCartContext);
  const { cartAlbumData, setCartAlbumData, cartSongData, setCartSongData } =
    context || {};

  const addToCart = (data: AlbumData) => {
    let thisAlbumId = data.AlbumID;
    setCartAlbumData
      ? setCartAlbumData((prevSongs) => [...prevSongs, data])
      : console.log('setCartSongData is undefined or something');

    if (setCartSongData) {
      setCartSongData((prevSongs) =>
        prevSongs.filter((song) => song.albumID !== thisAlbumId),
      );
    }
  };

  const removeFromCart = (data: AlbumData) => {
    setCartAlbumData
      ? setCartAlbumData((prevAlbums) =>
          prevAlbums.filter((album) => album.AlbumID !== data.AlbumID),
        )
      : console.log('setCartSongData is undefined or something');
  };
  //conditionally render depending on if the album is in the cart
  const isInCart = cartAlbumData?.some(
    (album: AlbumData) => album.AlbumID === data.AlbumID,
  );
  return (
    <>
      {isInCart ? (
        <BuyAlbumRemoveFromCart onClick={() => removeFromCart(data)} />
      ) : (
        <BuyAlbumAddToCart onClick={() => addToCart(data)} data={data} />
      )}
    </>
  );
}

export default BuyAlbum;

// < BuyAlbumRemoveFromCart onClick = {() -> removeFromCart(data) } />
// <BuyAlbumAddToCart onClick={() => addToCart(data)} data={data} />;

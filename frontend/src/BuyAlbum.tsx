/** @jsxImportSource @emotion/react */
import { useState, useRef, useEffect, useContext } from 'react';
import { AlbumData, PurchasedSongData, SongData } from './ScaffoldData';
import { MyCartContext } from './CartContext';
import BuyAlbumAddToCart from './BuyAlbumAddToCart';
import BuyAlbumRemoveFromCart from './BuyAlbumRemoveFromCart';

interface Props {
  data: AlbumData;
}

function BuyAlbum({ data }: Props) {
  const context = useContext(MyCartContext);
  const {
    cartAlbumData,
    setCartAlbumData,
    setCartSongData,
    purchasedSongData,
  } = context || {};

  const originalPrice = useRef<number>(data.AlbumPrice);

  const [priceDiscount, setPriceDiscount] = useState<number>(0);

  let songsInThisAlbum: SongData[] = data.TrackList;

  useEffect(() => {
    if (purchasedSongData) {
      setPriceDiscount(getAlbumDiscount(songsInThisAlbum, purchasedSongData));
    }
  }, [purchasedSongData, songsInThisAlbum, cartAlbumData]);

  const addToCart = (data: AlbumData) => {
    let thisAlbumId = data.AlbumID;
    let dataUpdated: AlbumData;
    if (priceDiscount > 0) {
      dataUpdated = data;
      dataUpdated.AlbumPrice = originalPrice.current - priceDiscount;
      setCartAlbumData
        ? setCartAlbumData((prevAlbums) => [...prevAlbums, dataUpdated])
        : console.log('setCartSongData is undefined or something');
    } else {
      setCartAlbumData
        ? setCartAlbumData((prevAlbums) => [...prevAlbums, data])
        : console.log('setCartSongData is undefined or something');
    }

    //remove songs with this albumID to prevent double dipping
    if (setCartSongData) {
      setCartSongData((prevSongs) =>
        prevSongs.filter((song) => song.albumID !== thisAlbumId),
      );
    }
    //data.AlbumPrice = originalPrice.current;
  };

  const allSongPurchases = establishSongPurchases();

  function establishSongPurchases() {
    if (purchasedSongData) {
      return purchasedSongData;
    } else {
      let emptySongData: PurchasedSongData[] = [];
      return emptySongData;
    }
  }

  const removeFromCart = (data: AlbumData) => {
    if (priceDiscount > 0) {
      data.AlbumPrice = originalPrice.current;
    }
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
        <BuyAlbumAddToCart
          onClick={() => addToCart(data)}
          data={data}
          purchasedSongData={allSongPurchases}
          priceDiscount={priceDiscount}
          originalPrice={originalPrice.current}
        />
      )}
    </>
  );
}

export default BuyAlbum;

function getAlbumDiscount(
  songsInThisAlbum: SongData[],
  purchasedSongData: PurchasedSongData[],
): number {
  const purchasedSongNames = purchasedSongData.map((song) => String(song));

  const intersectingSongs = songsInThisAlbum.filter((song) =>
    purchasedSongNames.includes(song.FilePathName),
  );

  const priceSum = intersectingSongs.reduce(
    (sum, song) => sum + song.SongPrice,
    0,
  );

  return priceSum;
}

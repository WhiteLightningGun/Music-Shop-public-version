/** @jsxImportSource @emotion/react */
import { useState, useRef, useEffect, useCallback, useContext } from 'react';
import { AlbumData, PurchasedSongData, SongData } from './ScaffoldData';

interface Props {
  data: AlbumData;
  onClick: () => void;
  purchasedSongData: PurchasedSongData[];
  priceDiscount: number;
  originalPrice: number;
}

const BuyAlbumAddToCart: React.FC<Props> = ({
  onClick,
  data,
  purchasedSongData,
  priceDiscount,
  originalPrice,
}: Props) => {
  // price needs to reflect previous purchases, use the songs in albums data to calculate the discount
  let songsInThisAlbum: SongData[] = data.TrackList;

  return (
    <span onClick={onClick} style={{ cursor: 'pointer' }}>
      {priceDiscount > 0 ? (
        <>
          <p>
            Buy Album: <del>£{originalPrice.toFixed(2)}</del> £
            {(originalPrice - priceDiscount).toFixed(2)}
          </p>
        </>
      ) : (
        <p>Buy Album: £{originalPrice.toFixed(2)} </p>
      )}
    </span>
  );
};

export default BuyAlbumAddToCart;

function getAlbumDiscount(
  songsInThisAlbum: SongData[],
  purchasedSongData: PurchasedSongData[],
): number {
  // Filter songsInThisAlbum to only include songs that exist in purchasedFilePathNames
  const intersectingSongs = [];
  for (let i = 0; i < songsInThisAlbum.length; i++) {
    //test to see if the song is in the purchasedSongData array, and return a bool if true
    let songIsInPurchasedSongData = purchasedSongData.some(
      (song) => String(song) === songsInThisAlbum[i].FilePathName,
    );
    if (songIsInPurchasedSongData) {
      intersectingSongs.push(songsInThisAlbum[i]);
    }
  }

  let priceSum = intersectingSongs
    .map((song) => song.SongPrice)
    .reduce((a, b) => a + b, 0);

  return priceSum;
}

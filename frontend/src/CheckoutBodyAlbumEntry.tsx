/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import React, { useContext, useState } from 'react';
import { AlbumData, SongData } from './ScaffoldData';
import { PayPalButtons } from '@paypal/react-paypal-js';
import configData from './config.json';
import CheckoutBodyPayPal from './CheckoutBodyPayPal';
import { MyCartContext, CartProvider } from './CartContext';
import CheckoutBodySongEntry from './CheckoutBodyAlbumEntry';
import * as Icon from 'react-bootstrap-icons';

interface Props {
  album: AlbumData;
  removeAlbum: (song: AlbumData) => void;
}

function CheckoutBodyAlbumEntry({ album, removeAlbum }: Props) {
  const clickHandler = () => {
    removeAlbum(album);
  };
  return (
    <div className="row text-dark normal-font-light py-1">
      <div className="col-2 ">
        <img src={album.FrontCoverPath} className="img-fluid" alt="album pic" />
      </div>
      <div className="col-8 text-start mb-0">
        <h3>{album.AlbumName}</h3>
        <p>
          Release Date: {new Date(album.ReleaseDate).toISOString().slice(0, 10)}
        </p>
        <p>Track Count: {album.TrackCount}</p>
        <p>Price: £{album.AlbumPrice.toFixed(2)}</p>
      </div>
      <div className="col-2 text-center">
        <Icon.Trash
          className="text-dark fs-2 icon-hover-effect mt-4"
          onClick={clickHandler}
        />
        <br></br>
        <small>Remove Album</small>
      </div>
    </div>
  );
}

export default CheckoutBodyAlbumEntry;

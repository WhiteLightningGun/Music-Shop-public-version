/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import React, { useContext, useState } from 'react';
import { AlbumData, SongData } from './ScaffoldData';
import { PayPalButtons } from '@paypal/react-paypal-js';
import configData from './config.json';
import CheckoutBodyPayPal from './CheckoutBodyPayPal';
import { MyCartContext, CartProvider } from './CartContext';
import * as Icon from 'react-bootstrap-icons';

interface Props {
  data: SongData;
  removeSong: (song: SongData) => void;
}

function CheckoutBodySongEntry({ data, removeSong }: Props) {
  const clickHandler = () => {
    removeSong(data);
  };
  return (
    <div className="row text-dark normal-font-light py-1">
      <div className="col-10 text-start mb-0">
        <h4>{data.songName}</h4>
        <p>{data.AlbumName}</p>
        <p>Price: £{data.SongPrice.toFixed(2)}</p>
      </div>
      <div className="col-2 text-center">
        <Icon.Trash
          className="text-dark fs-4 icon-hover-effect mt-2"
          onClick={clickHandler}
        />
        <br></br>
        <small>Remove</small>
      </div>
    </div>
  );
}

export default CheckoutBodySongEntry;

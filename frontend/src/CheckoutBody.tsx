/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import React, { useContext, useState } from 'react';
import { AlbumData, SongData } from './ScaffoldData';
import { PayPalButtons } from '@paypal/react-paypal-js';
import configData from './config.json';
import CheckoutBodyPayPal from './CheckoutBodyPayPal';
import { MyCartContext, CartProvider } from './CartContext';
import * as Icon from 'react-bootstrap-icons';

function CheckoutBody() {
  const context = useContext(MyCartContext);
  const { cartSongData, setCartSongData, cartAlbumData, setCartAlbumData } =
    context || {};
  const [totalItems, setTotalItems] = useState(0);
  return (
    <>
      <div
        css={css`
          background: #ffffff;
        `}
      >
        <div className="container">
          <br></br>
          <div className="text-dark normal-font-light no-underline py-1">
            <h2>Checkout</h2>
          </div>
          <div className="row text-dark normal-font-light py-1">
            <div className="col-2 ">
              <img
                src="https://localhost:7158/images/3b9325cb-1bd5-4786-9212-b81d882ba8b2.jpg"
                className="img-fluid"
                alt="album pic"
              />
            </div>
            <div className="col-8  text-start">
              <h3>Unknown Feels</h3>
              <p>Release Date: 2020-04-13</p>
              <p>Track Count: 3</p>
              <p>Price: £4.00</p>
            </div>
            <div className="col-2 mb-5 text-center">
              <Icon.Trash className="text-dark fs-2 icon-hover-effect " />
              <br></br>
              <small>Remove Album</small>
            </div>
          </div>
          <CheckoutBodyPayPal />
        </div>
      </div>
    </>
  );
}

export default CheckoutBody;

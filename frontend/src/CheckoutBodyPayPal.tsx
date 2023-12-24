/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import React from 'react';
import { AlbumData, SongData } from './ScaffoldData';
import { PayPalButtons } from '@paypal/react-paypal-js';
import configData from './config.json';

interface CartBodyEntry {
  id: string;
  value: string;
  productID: string;
}

interface Props {
  songData: SongData[] | undefined;
  albumData: AlbumData[] | undefined;
}

function CheckoutBodyPayPal({ songData, albumData }: Props) {
  const createOrder = () => {
    console.log('createOrder was called');
    let cartBody = mapDataToCartBodyEntry(songData, albumData);

    return fetch(`${configData.SERVER_URL}/api/payments/create-order`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${sessionStorage.getItem('Bearer')}`,
      },
      // use the "body" param to optionally pass additional order information
      // like product ids and quantities
      body: JSON.stringify({
        cart: cartBody,
      }),
    })
      .then((response) => response.json())
      .then((order) => order.id);
  };
  const onApprove = async (data: any, actions: any) => {
    const response = await fetch(
      `${configData.SERVER_URL}/api/payments/capture-paypal-order`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${sessionStorage.getItem('Bearer')}`,
        },
        body: JSON.stringify({
          orderID: data.orderID,
        }),
      },
    );
    const orderData = await response.json();
    const name = orderData.payer.name.given_name;
    alert(`Transaction completed by ${name}`);
  };

  return (
    <>
      <div className="row">
        <div className=" col-md-6 mx-auto">
          <PayPalButtons
            style={{ layout: 'horizontal' }}
            onApprove={onApprove}
            createOrder={createOrder}
          />
        </div>
      </div>
    </>
  );
}

export default CheckoutBodyPayPal;

function mapDataToCartBodyEntry(
  songData: SongData[] | undefined,
  albumData: AlbumData[] | undefined,
): CartBodyEntry[] {
  const cart: CartBodyEntry[] = [];

  songData
    ? songData.forEach((song) => {
        cart.push({
          id: song.songName,
          value: String(song.SongPrice),
          productID: song.FilePathName,
        });
      })
    : console.log('no songs in cart');

  albumData
    ? albumData.forEach((album) => {
        cart.push({
          id: album.AlbumName,
          value: String(album.AlbumPrice),
          productID: album.AlbumID,
        });
      })
    : console.log('no album in cart');

  return cart;
}

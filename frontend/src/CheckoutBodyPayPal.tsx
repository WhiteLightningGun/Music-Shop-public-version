/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import React from 'react';
import { AlbumData, SongData } from './ScaffoldData';
import { PayPalButtons } from '@paypal/react-paypal-js';
import configData from './config.json';
import { Navigate, useNavigate } from 'react-router-dom';

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
  const navigate = useNavigate();
  const createOrder = async () => {
    console.log('createOrder was called');
    let cartBody = mapDataToCartBodyEntry(songData, albumData);

    const response = await fetch(
      `${configData.SERVER_URL}/api/payments/create-order`,
      {
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
      },
    );
    const order = await response.json();
    return order.id;
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

  const onError = (err: any) => {
    console.log('something went wrong');
    navigate('/error'); // create a new page for error
  };

  return (
    <>
      <div className="row">
        <div className=" col-md-6 mx-auto">
          <PayPalButtons
            style={{ layout: 'horizontal' }}
            onApprove={onApprove}
            createOrder={createOrder}
            onError={onError}
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

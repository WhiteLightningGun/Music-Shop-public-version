/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import React from 'react';
import { AlbumData, SongData } from './ScaffoldData';
import { PayPalButtons } from '@paypal/react-paypal-js';
import configData from './config.json';

function CheckoutBodyPayPal() {
  const createOrder = () => {
    console.log('createOrder was called');
    return fetch(`${configData.SERVER_URL}/api/payments/create-order`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      // use the "body" param to optionally pass additional order information
      // like product ids and quantities
      body: JSON.stringify({
        cart: [
          {
            id: 'Prod-ID-1',
            quantity: '1', // i.e. used as price later
          },
        ],
      }),
    })
      .then((response) => response.json())
      .then((order) => order.id);
  };
  const onApprove = (data: any, actions: any) => {
    console.log('onApprove was called');
    console.log(`orderId: ${data}}`);
    console.log(`orderId: ${data.orderID}}`);
    return fetch(`${configData.SERVER_URL}/api/payments/capture-paypal-order`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        orderID: data.orderID,
      }),
    })
      .then((response) => response.json())
      .then((orderData) => {
        const name = orderData.payer.name.given_name;
        alert(`Transaction completed by ${name}`);
      });
  };

  return (
    <>
      <PayPalButtons
        style={{ layout: 'horizontal' }}
        onApprove={onApprove}
        createOrder={createOrder}
      />
    </>
  );
}

export default CheckoutBodyPayPal;

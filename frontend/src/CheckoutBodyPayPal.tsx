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
          {
            id: 'Prod-ID-2',
            quantity: '1', // i.e. used as price later
          },
        ],
      }),
    })
      .then((response) => response.json())
      .then((order) => order.id);
  };
  const onApprove = async (data: any, actions: any) => {
    console.log(`orderId: ${data}}`);
    console.log(`orderId: ${data.orderID}}`);
    const response = await fetch(
      `${configData.SERVER_URL}/api/payments/capture-paypal-order`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
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

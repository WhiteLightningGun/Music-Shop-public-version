/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import react from 'react';
import Header from './Header';
import FooterTemplate from './FooterTemplate';
import CheckoutBody from './CheckoutBody';
import AlbumPageBody from './AlbumPageBody';
import { AlbumData, SongData } from './ScaffoldData';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';

const initialOptions = {
  clientId:
    'AQXQUpv0ZAajfVapD8LyOdFqB8bc8FkqCw56ySupuPzFFONTji3OxrQCTp3gaTif3dfW-zTbPyw2oDtz',
  currency: 'GBP',
  intent: 'capture',
};

function Checkout() {
  return (
    <>
      <Header />
      <PayPalScriptProvider options={initialOptions}>
        <CheckoutBody />
      </PayPalScriptProvider>
      <FooterTemplate />
    </>
  );
}

export default Checkout;

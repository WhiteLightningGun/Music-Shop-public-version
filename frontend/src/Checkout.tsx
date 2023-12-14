/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import react from 'react';
import Header from './Header';
import FooterTemplate from './FooterTemplate';
import CheckoutBody from './CheckoutBody';
import AlbumPageBody from './AlbumPageBody';
import { AlbumData, SongData } from './ScaffoldData';

function Checkout() {
  return (
    <>
      <Header />
      <CheckoutBody />
      <FooterTemplate />
    </>
  );
}

export default Checkout;

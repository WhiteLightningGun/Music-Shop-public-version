/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import react from 'react';
import Header from './Header';
import FooterTemplate from './FooterTemplate';
import AlbumPageBody from './AlbumPageBody';
import { AlbumData } from './ScaffoldData';

interface Props {
  data: AlbumData;
}

function AlbumPage({ data }: Props) {
  if (!data) {
    return (
      <>
        <Header />
        <p>Tell the admin to fix his website.</p>
        <FooterTemplate />
      </>
    );
  }
  return (
    <>
      <Header />
      <AlbumPageBody data={data} />
      <FooterTemplate />
    </>
  );
}

export default AlbumPage;

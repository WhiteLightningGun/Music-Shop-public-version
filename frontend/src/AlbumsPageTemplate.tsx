/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import React from 'react';
import HeaderTemplateTwo from './Header';
import AlbumsPageBodyTemplate from './AlbumsPageBodyTemplate';
import FooterTemplate from './FooterTemplate';

function AlbumsPageTemplate() {
  return (
    <>
      <HeaderTemplateTwo />
      <AlbumsPageBodyTemplate />
      <FooterTemplate />
    </>
  );
}

export default AlbumsPageTemplate;

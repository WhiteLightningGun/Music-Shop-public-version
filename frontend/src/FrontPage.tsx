/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import React, { useEffect } from 'react';
import HeaderTemplateTwo from './Header';
import FooterTemplate from './FooterTemplate';
import ETLogoPic from './PlaceholderData/Images/ETLogoPicB.jpg';
import { Link } from 'react-router-dom';
import { useLoginContext } from './LoggedInContext';
import FrontPageBody from './FrontPageBody';
import Loading from './Loading';

interface Props {
  loading: boolean;
}

function FrontPage({ loading }: Props) {
  useEffect(() => {}, [loading]);
  return (
    <>
      <HeaderTemplateTwo />
      {loading ? <Loading /> : <FrontPageBody />}
      <FooterTemplate />
    </>
  );
}

export default FrontPage;

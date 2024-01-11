/** @jsxImportSource @emotion/react */
import { useEffect } from 'react';
import HeaderTemplateTwo from './Header';
import FooterTemplate from './FooterTemplate';
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

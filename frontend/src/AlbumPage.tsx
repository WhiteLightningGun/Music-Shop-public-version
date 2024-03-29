/** @jsxImportSource @emotion/react */
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
        <p>If you see this tell the admin to fix his stupid website.</p>
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

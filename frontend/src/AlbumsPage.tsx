/** @jsxImportSource @emotion/react */
import { useEffect, useState } from 'react';
import Header from './Header';
import AlbumsPageBody from './AlbumsPageBody';
import FooterTemplate from './FooterTemplate';
import { AlbumData } from './ScaffoldData';
import Loading from './Loading';

interface Props {
  data: AlbumData[];
}

function AlbumsPage({ data }: Props) {
  const [albums, setLoadedAlbums] = useState<AlbumData[]>([]);

  useEffect(() => {
    setLoadedAlbums(data);
  }, [data]);

  return (
    <>
      <Header />
      {albums.length < 1 ? <Loading /> : <AlbumsPageBody data={albums} />}
      <FooterTemplate />
    </>
  );
}
export default AlbumsPage;

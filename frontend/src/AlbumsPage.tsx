/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import react from 'react';
import { useEffect, useState } from 'react';
import Header from './Header';
import AlbumsPageBody from './AlbumsPageBody';
import FooterTemplate from './FooterTemplate';
import { AlbumData, getAlbums } from './ScaffoldData';
import { GetAlbums } from './JsonConverters';
import Loading from './Loading';

function AlbumsPage() {
  const [albums, setLoadedAlbums] = useState<AlbumData[]>([]);

  useEffect(() => {
    const beginLoadAlbums = async () => {
      let loadedAlbums: AlbumData[] = await GetAlbums();
      setLoadedAlbums(loadedAlbums);
    };
    beginLoadAlbums();
  }, []);

  return (
    <>
      <Header />
      {albums.length < 1 ? <Loading /> : <AlbumsPageBody data={albums} />}
      <FooterTemplate />
    </>
  );
}
export default AlbumsPage;

/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import react, { useContext } from 'react';
import * as Icon from 'react-bootstrap-icons';
import { GetDownload } from './Data';
import { AlbumData, SongData } from './ScaffoldData';
import configData from './config.json';
import { Link } from 'react-router-dom';
import { MyCartContext } from './CartContext';
import SongInCart from './AlbumPageSongEntryControlsInCart';
import AddToCart from './AlbumPageSongEntryControlsAddToCart';

interface Props {
  data: SongData;
}

function AlbumPageSongEntryLogin() {
  return (
    <span className="fs-7 m-1 text-end text-light">
      &nbsp;&nbsp;
      <span className="text-glow" style={{ cursor: 'pointer' }}>
        <Link className="text-glow" to="/login">
          Login
        </Link>
      </span>
    </span>
  );
}

export { AlbumPageSongEntryLogin };

function AlbumPageSongEntryControls({ data }: Props) {
  const context = useContext(MyCartContext);

  const { cartSongData, setCartSongData } = context || {};

  const Download = (songdata: any) => {
    // download function here
    GetDownload(songdata);
  };
  const addToCart = (data: SongData) => {
    setCartSongData
      ? setCartSongData((prevSongs) => [...prevSongs, data])
      : console.log('setCartSongData is undefined or something');
  };

  const removeFromCart = (data: SongData) => {
    setCartSongData
      ? setCartSongData((prevSongs) =>
          prevSongs.filter((song) => song.FilePathName !== data.FilePathName),
        )
      : console.log('setCartSongData is undefined or something');
  };

  const isInCart = cartSongData?.some(
    (song: SongData) => song.FilePathName === data.FilePathName,
  );
  return (
    <span className="fs-7 m-1 text-end text-light">
      &nbsp;&nbsp;
      {isInCart ? (
        <SongInCart onClick={() => removeFromCart(data)} />
      ) : (
        <AddToCart onClick={() => addToCart(data)} />
      )}
      <span
        className="text-glow text-light"
        style={{ cursor: 'pointer' }}
        onClick={() => {
          Download(data);
        }}
        id={data.songName}
      >
        &nbsp;
        <Icon.Download className="mb-1 fs-5 text-white text-glow" />
      </span>
    </span>
  );
}

export { AlbumPageSongEntryControls };

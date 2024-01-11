/** @jsxImportSource @emotion/react */
import { useContext } from 'react';
import * as Icon from 'react-bootstrap-icons';
import { GetDownload } from './Data';
import { AlbumData, SongData } from './ScaffoldData';
import { Link } from 'react-router-dom';
import { MyCartContext } from './CartContext';
import SongInCart from './AlbumPageSongEntryControlsInCart';
import AddToCart from './AlbumPageSongEntryControlsAddToCart';
import SongInCartDumb from './AlbumPageSongEntryControlsInCartDumb';

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

  const {
    cartSongData,
    setCartSongData,
    cartAlbumData,
    purchasedSongData,
    purchasedAlbumData,
  } = context || {};

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

  const isOwned =
    purchasedSongData?.some(
      (song) => String(song) === String(data.FilePathName),
    ) ||
    purchasedAlbumData?.some((album) => String(album) === String(data.albumID))
      ? true
      : false;

  const isInCart = cartSongData?.some(
    (song: SongData) => song.FilePathName === data.FilePathName,
  );

  const isAlbumInCart = cartAlbumData?.some(
    (song: AlbumData) => song.AlbumID === data.albumID,
  );
  return (
    <span className="fs-7 m-1 text-end text-light">
      &nbsp;&nbsp;
      {isOwned ? (
        <></>
      ) : isAlbumInCart ? (
        <SongInCartDumb />
      ) : isInCart ? (
        <SongInCart onClick={() => removeFromCart(data)} />
      ) : (
        <AddToCart onClick={() => addToCart(data)} />
      )}
      {isOwned ? (
        <span
          className="text-glow text-light"
          style={{ cursor: 'pointer' }}
          onClick={() => {
            Download(data);
          }}
          id={data.songName}
        >
          Download &nbsp;
          <Icon.Download className="mb-1 fs-5 text-white text-glow" />
        </span>
      ) : (
        <></>
      )}
    </span>
  );
}

export { AlbumPageSongEntryControls };

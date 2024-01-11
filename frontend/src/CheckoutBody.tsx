/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { useContext, useEffect, useState } from 'react';
import {
  AlbumData,
  PurchasedAlbumData,
  PurchasedSongData,
  SongData,
} from './ScaffoldData';
import CheckoutBodyPayPal from './CheckoutBodyPayPal';
import { MyCartContext } from './CartContext';
import CheckoutBodyAlbumEntry from './CheckoutBodyAlbumEntry';
import CheckoutBodySongEntry from './CheckoutBodySongEntry';
import { Link } from 'react-router-dom';
import { GetPurchasedAlbums, GetPurchasedSongs } from './JsonConverters';

function CheckoutBody() {
  const context = useContext(MyCartContext);

  const {
    cartSongData,
    setCartSongData,
    cartAlbumData,
    setCartAlbumData,
    setPurchasedAlbums,
    setPurchasedSongs,
  } = context || {};
  const [totalItems, setTotalItems] = useState(0);

  useEffect(() => {
    let total = 0;
    if (cartSongData) {
      total += cartSongData.length;
    }
    if (cartAlbumData) {
      total += cartAlbumData.length;
    }
    setTotalItems(total);
  }, [cartSongData, cartAlbumData]);

  const removeSong = (data: SongData) => {
    setCartSongData
      ? setCartSongData((prevSongs) =>
          prevSongs.filter((song) => song.FilePathName !== data.FilePathName),
        )
      : console.log('setCartSongData is undefined or something');
  };
  const removeAlbum = (data: AlbumData) => {
    setCartAlbumData
      ? setCartAlbumData((prevSongs) =>
          prevSongs.filter((song) => song.AlbumID !== data.AlbumID),
        )
      : console.log('setCartSongData is undefined or something');
  };

  const clearCart = () => {
    if (setCartAlbumData && setCartSongData) {
      setCartAlbumData([]);
      setCartSongData([]);
    }
  };

  const refreshUserPurchases = async () => {
    let purchasedAlbums: PurchasedAlbumData[] = await GetPurchasedAlbums();
    let purchasedSongs: PurchasedSongData[] = await GetPurchasedSongs();
    if (setPurchasedAlbums && setPurchasedSongs) {
      setPurchasedAlbums(purchasedAlbums);
      setPurchasedSongs(purchasedSongs);
      const purchasedAlbumsData = JSON.stringify(purchasedAlbums);
      localStorage.setItem('purchasedAlbums', purchasedAlbumsData);
      const purchasedSongsData = JSON.stringify(purchasedSongs);
      localStorage.setItem('purchasedAlbums', purchasedSongsData);
    }
  };

  function calculateTotalPrice(
    cartSongData: SongData[] | undefined,
    cartAlbumData: AlbumData[] | undefined,
  ) {
    let total = 0;
    if (cartSongData) {
      total += cartSongData.reduce((sum, song) => sum + song.SongPrice, 0);
    }

    if (cartAlbumData) {
      total += cartAlbumData.reduce((sum, album) => sum + album.AlbumPrice, 0);
    }
    return total.toFixed(2);
  }
  return (
    <>
      <div
        css={css`
          background: #ffffff;
          min-height: 85vh;
        `}
      >
        <div className="container">
          <br></br>
          <div className="text-dark normal-font-light no-underline py-1">
            <h1 className="text-decoration-underline">Checkout</h1>
            {totalItems ? <p>Total Items - {totalItems}</p> : null}
          </div>
          {cartAlbumData && cartAlbumData.length > 0 ? (
            <div className="text-dark normal-font-light no-underline py-1 text-start">
              <h2>Albums</h2>
            </div>
          ) : null}
          {cartAlbumData
            ? cartAlbumData.map((album, i) => (
                <CheckoutBodyAlbumEntry
                  album={album}
                  key={i}
                  removeAlbum={removeAlbum}
                />
              ))
            : null}

          {cartSongData && cartSongData.length > 0 ? (
            <>
              <hr className="my-3" style={{ borderTop: '1px solid #dee2e6' }} />
              <div className="text-dark normal-font-light no-underline py-1 mt-1 text-start">
                <h2>Songs</h2>
              </div>
            </>
          ) : null}

          {cartSongData
            ? cartSongData.map((song, i) => (
                <CheckoutBodySongEntry
                  data={song}
                  removeSong={removeSong}
                  key={i}
                />
              ))
            : null}

          {checkData(cartSongData, cartAlbumData) ? (
            <>
              <hr className="my-3" style={{ borderTop: '1px solid #dee2e6' }} />
              <h4>TOTAL PRICE</h4>
              <h5>£{calculateTotalPrice(cartSongData, cartAlbumData)}</h5>
              <CheckoutBodyPayPal
                songData={cartSongData}
                albumData={cartAlbumData}
                clearCart={clearCart}
                refreshUserPurchases={refreshUserPurchases}
              />{' '}
            </>
          ) : (
            <>
              <p className="text-dark normal-font-light no-underline py-1 mt-1 text-start">
                Nothing to see here!
              </p>
              <Link className="nav-link normal-font" to="/Albums">
                <button
                  type="button"
                  className="btn normal-font btn-login btn-info"
                >
                  <span className="badge fs-3">Return To Albums</span>
                </button>
              </Link>
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default CheckoutBody;

function checkData(
  cartSongData: any[] | undefined,
  cartAlbumData: any[] | undefined,
): boolean {
  let result = false;

  if (
    (cartSongData && cartSongData.length > 0) ||
    (cartAlbumData && cartAlbumData.length > 0)
  ) {
    result = true;
  }
  return result;
}

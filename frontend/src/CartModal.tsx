/** @jsxImportSource @emotion/react */
import styled from '@emotion/styled';
import { css } from '@emotion/react';
import * as Icon from 'react-bootstrap-icons';
import { useContext, useEffect } from 'react';
import { MyCartContext, CartProvider } from './CartContext';
import CartModalSongEntry from './CartModalSongEntry';
import { SongData } from './ScaffoldData';

export default CartModal;

function CartModal({ props }: any) {
  const context = useContext(MyCartContext);

  const { cartSongData, setCartSongData, cartAlbumData, setCartAlbumData } =
    context || {};

  useEffect(() => {}, [cartSongData]);

  const removeSong = (data: SongData) => {
    setCartSongData
      ? setCartSongData((prevSongs) =>
          prevSongs.filter((song) => song.FilePathName !== data.FilePathName),
        )
      : console.log('setCartSongData is undefined or something');
  };

  function calculateTotalPrice(cartSongData: SongData[] | undefined) {
    let total = 0;
    if (cartSongData) {
      total = cartSongData.reduce((sum, song) => sum + song.SongPrice, 0);
    }
    return total.toFixed(2);
  }

  return (
    <>
      <button
        className="btn btn-outline-dark"
        type="button"
        id="cart-button"
        data-bs-toggle="modal"
        data-bs-target="#cartModal"
      >
        <Icon.Cart className="mb-1" />
        <span className="badge bg-dark text-white ms-2 rounded-pill">
          {cartSongData ? cartSongData.length : 0}
        </span>
      </button>

      <div
        className="modal fade"
        id="cartModal"
        aria-labelledby="cartModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5
                className="modal-title text-dark normal-font-light"
                id="cartModalLabel"
              >
                Cart
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <h4>SONGS</h4>
              {cartSongData && cartSongData.length > 0 ? (
                cartSongData.map((song, i) => (
                  <CartModalSongEntry
                    key={i}
                    songData={song}
                    removeSong={removeSong}
                  />
                ))
              ) : (
                <p>-</p>
              )}
              <hr className="my-3" style={{ borderTop: '1px solid #dee2e6' }} />
              <h4>ALBUMS</h4>
              {cartAlbumData && cartAlbumData.length > 0 ? (
                <p>Cart has stuff init</p>
              ) : (
                <p>-</p>
              )}
              <hr className="my-3" style={{ borderTop: '1px solid #dee2e6' }} />
              <h4>TOTAL</h4>
              <h5>£{calculateTotalPrice(cartSongData)}</h5>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                <span className="badge">CLOSE</span>
              </button>
              <button
                type="button"
                className="btn normal-font btn-login btn-info"
              >
                <span className="badge">CHECKOUT</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

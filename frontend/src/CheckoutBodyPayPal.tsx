/** @jsxImportSource @emotion/react */
import { AlbumData, SongData } from './ScaffoldData';
import { PayPalButtons, usePayPalScriptReducer } from '@paypal/react-paypal-js';
import configData from './config.json';
import { useNavigate } from 'react-router-dom';

interface CartBodyEntry {
  id: string;
  value: string;
  productID: string;
}

interface Props {
  songData: SongData[] | undefined;
  albumData: AlbumData[] | undefined;
  clearCart: () => void;
  refreshUserPurchases: () => void;
}

function CheckoutBodyPayPal({
  songData,
  albumData,
  clearCart,
  refreshUserPurchases,
}: Props) {
  const [{ isPending }] = usePayPalScriptReducer();

  const navigate = useNavigate();

  const createOrder = async () => {
    console.log('createOrder was called');
    let cartBody = mapDataToCartBodyEntry(songData, albumData);

    const response = await fetch(
      `${configData.SERVER_URL}/api/payments/create-order`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${sessionStorage.getItem('Bearer')}`,
        },
        // use the "body" param to optionally pass additional order information
        // like product ids and quantities
        body: JSON.stringify({
          cart: cartBody,
        }),
      },
    );
    const order = await response.json();
    return order.id;
  };
  const onApprove = async (data: any, actions: any) => {
    const response = await fetch(
      `${configData.SERVER_URL}/api/payments/capture-paypal-order`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${sessionStorage.getItem('Bearer')}`,
        },
        body: JSON.stringify({
          orderID: data.orderID,
        }),
      },
    );
    const orderData = await response.json();
    const name = orderData.payer.name.given_name;
    clearCart();
    //update client state on songs and albums owned by this user
    refreshUserPurchases();
    alert(`Transaction completed by ${name}`);
    //clear cart here
  };

  const onError = (err: any) => {
    console.log('something went wrong');
    navigate('/error'); // create a new page for error
  };

  return (
    <>
      <div className="row">
        <div className=" col-md-6 mx-auto">
          {isPending ? (
            <>
              <div className="spinner-border text-info" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p>Loading Paypal</p>
            </>
          ) : (
            <PayPalButtons
              style={{ layout: 'horizontal' }}
              onApprove={onApprove}
              createOrder={createOrder}
              onError={onError}
            />
          )}
        </div>
      </div>
    </>
  );
}

export default CheckoutBodyPayPal;

function mapDataToCartBodyEntry(
  songData: SongData[] | undefined,
  albumData: AlbumData[] | undefined,
): CartBodyEntry[] {
  const cart: CartBodyEntry[] = [];

  songData
    ? songData.forEach((song) => {
        cart.push({
          id: song.songName,
          value: String(song.SongPrice),
          productID: song.FilePathName,
        });
      })
    : console.log('no songs in cart');

  albumData
    ? albumData.forEach((album) => {
        cart.push({
          id: album.AlbumName,
          value: String(album.AlbumPrice),
          productID: album.AlbumID,
        });
      })
    : console.log('no album in cart');

  return cart;
}

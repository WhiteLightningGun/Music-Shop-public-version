/** @jsxImportSource @emotion/react */
import Header from './Header';
import FooterTemplate from './FooterTemplate';
import CheckoutBody from './CheckoutBody';
import { PayPalScriptProvider } from '@paypal/react-paypal-js';

const initialOptions = {
  clientId:
    'AQXQUpv0ZAajfVapD8LyOdFqB8bc8FkqCw56ySupuPzFFONTji3OxrQCTp3gaTif3dfW-zTbPyw2oDtz',
  currency: 'GBP',
  intent: 'capture',
};

function Checkout() {
  return (
    <>
      <Header />
      <PayPalScriptProvider options={initialOptions}>
        <CheckoutBody />
      </PayPalScriptProvider>
      <FooterTemplate />
    </>
  );
}

export default Checkout;

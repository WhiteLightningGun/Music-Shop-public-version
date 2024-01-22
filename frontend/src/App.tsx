/** @jsxImportSource @emotion/react */
//import { css } from '@emotion/react';
import './App.css';
import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import FrontPage from './FrontPage';
import RequestEmailConfirm from './RequestEmailConfirmation';
import {
  AlbumData,
  PurchasedAlbumData,
  PurchasedSongData,
} from './ScaffoldData';
import AlbumsPage from './AlbumsPage';
import AlbumPage from './AlbumPage';
import LoginPage from './LoginPage';
import { MyLoginContext } from './LoggedInContext';
import { GetAlbums, GetPurchasedSongs } from './JsonConverters';
import { GetPurchasedAlbums } from './JsonConverters';
import RegisterPage from './Register';
import PasswordReset from './PasswordReset';
import { CheckLoggedIn } from './PostLogin';
import AdminPage from './AdminPage';
import { CheckIsAdmin } from './IsAdminCheck';
import { CartProvider } from './CartContext';
import Checkout from './Checkout';
import Account from './Account';
import { PurchasedProvider } from './PurchasesContext';
import About from './About';

function App() {
  const [albums, setLoadedAlbums] = useState<AlbumData[]>([]);
  const [loggedIn, setLoggedIn] = useState<boolean>(false);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [purchasedAlbums, setPurchasedAlbums] = useState<PurchasedAlbumData[]>(
    [],
  );
  const [purchasedSongs, setPurchasedSongs] = useState<PurchasedSongData[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);

    const beginLoadAlbums = async () => {
      let loadedAlbums: AlbumData[] = await GetAlbums();
      setLoadedAlbums(loadedAlbums);
    };

    const loggedInCheck = async () => {
      let loggedInCheck = await CheckLoggedIn();
      setLoggedIn(loggedInCheck);
    };

    const loggedInAdminCheck = async () => {
      let adminCheck = await CheckIsAdmin();
      setIsAdmin(adminCheck);
    };

    const beginLoadPurchasedAlbums = async () => {
      let purchasedAlbums: PurchasedAlbumData[] = await GetPurchasedAlbums();
      const purchasedAlbumsData = JSON.stringify(purchasedAlbums);
      localStorage.setItem('purchasedAlbums', purchasedAlbumsData);
      setPurchasedAlbums(purchasedAlbums);
    };

    const beginLoadPurchasedSongs = async () => {
      let purchasedSongs: PurchasedSongData[] = await GetPurchasedSongs();
      const purchasedSongsData = JSON.stringify(purchasedSongs);
      localStorage.setItem('purchasedSongs', purchasedSongsData);
      setPurchasedSongs(purchasedSongs);
    };

    Promise.all([
      beginLoadAlbums(),
      loggedInCheck(),
      loggedInAdminCheck(),
      beginLoadPurchasedAlbums(),
      beginLoadPurchasedSongs(),
    ]).then(() => setLoading(false));
  }, [isAdmin]);
  return (
    <PurchasedProvider
      initialPurchasedSongData={purchasedSongs}
      initialPurchasedAlbumData={purchasedAlbums}
    >
      <CartProvider>
        <MyLoginContext.Provider value={{ loggedIn }}>
          <BrowserRouter>
            <div className="App">
              <Routes>
                <Route path="passwordreset" element={<PasswordReset />} />
                <Route path="" element={<FrontPage loading={loading} />} />
                <Route path="Albums" element={<AlbumsPage data={albums} />} />
                {albums.map((albumInstance, i) => (
                  <Route
                    key={i}
                    path={'Albums/' + albumInstance.kebabCase}
                    element={<AlbumPage data={albumInstance} />}
                  />
                ))}
                <Route
                  path="Login"
                  element={<LoginPage setLoggedIn={setLoggedIn} />}
                />
                <Route
                  path="Register"
                  element={<RegisterPage setLoggedIn={setLoggedIn} />}
                />
                {isAdmin ? (
                  <Route path="Admin" element={<AdminPage />} />
                ) : null}
                <Route path="Checkout" element={<Checkout />} />
                <Route
                  path="RequestEmailConfirmation"
                  element={<RequestEmailConfirm />}
                />
                <Route path="About" element={<About />} />
                <Route
                  path="Account"
                  element={<Account albumData={albums} />}
                />
              </Routes>
            </div>
          </BrowserRouter>
        </MyLoginContext.Provider>
      </CartProvider>
    </PurchasedProvider>
  );
}

export default App;

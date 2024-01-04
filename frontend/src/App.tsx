/** @jsxImportSource @emotion/react */
//import { css } from '@emotion/react';
import './App.css';
import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import FrontPageTemplate from './FrontPageTemplate';
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

function App() {
  const [albums, setLoadedAlbums] = useState<AlbumData[]>([]);
  const [loggedIn, setLoggedIn] = useState<boolean>(false); // create function to check if bearer token is still valid
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [purchasedAlbums, setPurchasedAlbums] = useState<PurchasedAlbumData[]>(
    [],
  );
  const [purchasedSongs, setPurchasedSongs] = useState<PurchasedSongData[]>([]);

  useEffect(() => {
    const beginLoadAlbums = async () => {
      let loadedAlbums: AlbumData[] = await GetAlbums();
      setLoadedAlbums(loadedAlbums);
    };
    const LoggedInCheck = async () => {
      let loggedInCheck = await CheckLoggedIn();
      setLoggedIn(loggedInCheck);
    };
    const loggedInAdminCheck = async () => {
      let adminCheck = await CheckIsAdmin();
      setIsAdmin(adminCheck);
    };
    const beginLoadPurchasedAlbums = async () => {
      let purchasedAlbums: PurchasedAlbumData[] = await GetPurchasedAlbums();
      setPurchasedAlbums(purchasedAlbums);
    };
    const beginLoadPurchasedSongs = async () => {
      let purchasedSongs: PurchasedSongData[] = await GetPurchasedSongs();
      setPurchasedSongs(purchasedSongs);
    };
    loggedInAdminCheck();
    beginLoadAlbums();
    LoggedInCheck();
    beginLoadPurchasedAlbums();
    beginLoadPurchasedSongs();
  }, [isAdmin]);
  return (
    <CartProvider>
      <MyLoginContext.Provider value={{ loggedIn }}>
        <BrowserRouter>
          <div className="App ">
            <Routes>
              <Route path="passwordreset" element={<PasswordReset />} />
              <Route path="" element={<FrontPageTemplate />} />
              <Route path="Albums" element={<AlbumsPage />} />
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
              {isAdmin ? <Route path="Admin" element={<AdminPage />} /> : null}
              <Route path="Checkout" element={<Checkout />} />
            </Routes>
          </div>
        </BrowserRouter>
      </MyLoginContext.Provider>
    </CartProvider>
  );
}

export default App;

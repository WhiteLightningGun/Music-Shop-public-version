import React, { createContext, useState, ReactNode } from 'react';
import { SongData } from './ScaffoldData';
import { AlbumData } from './ScaffoldData';
import { PurchasedAlbumData, PurchasedSongData } from './ScaffoldData';

export type CartContent = {
  cartSongData: SongData[];
  cartAlbumData: AlbumData[];
};

export type CartContextType = {
  cartSongData: SongData[];
  setCartSongData: React.Dispatch<React.SetStateAction<SongData[]>>;
  cartAlbumData: AlbumData[];
  setCartAlbumData: React.Dispatch<React.SetStateAction<AlbumData[]>>;
  purchasedAlbumData: PurchasedAlbumData[];
  setPurchasedAlbums: React.Dispatch<
    React.SetStateAction<PurchasedAlbumData[]>
  >;
  purchasedSongData: PurchasedSongData[];
  setPurchasedSongs: React.Dispatch<React.SetStateAction<PurchasedSongData[]>>;
};

export const MyCartContext = createContext<CartContextType | undefined>(
  undefined,
);

type CartProviderProps = {
  children: ReactNode;
};

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [cartSongData, setCartSongData] = useState<SongData[]>([]);
  const [cartAlbumData, setCartAlbumData] = useState<AlbumData[]>([]);
  const [purchasedAlbumData, setPurchasedAlbums] = useState<
    PurchasedAlbumData[]
  >(() => {
    const savedAlbumData = localStorage.getItem('purchasedAlbums');
    return savedAlbumData ? JSON.parse(savedAlbumData) : [];
  });
  const [purchasedSongData, setPurchasedSongs] = useState<PurchasedSongData[]>(
    () => {
      const savedSongData = localStorage.getItem('purchasedSongs');
      return savedSongData ? JSON.parse(savedSongData) : [];
    },
  );
  return (
    <MyCartContext.Provider
      value={{
        cartSongData,
        setCartSongData,
        cartAlbumData,
        setCartAlbumData,
        purchasedAlbumData,
        setPurchasedAlbums,
        purchasedSongData,
        setPurchasedSongs,
      }}
    >
      {children}
    </MyCartContext.Provider>
  );
};

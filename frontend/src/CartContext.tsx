import React, { createContext, useState, ReactNode } from 'react';
import { SongData } from './ScaffoldData';
import { AlbumData } from './ScaffoldData';

export type CartContent = {
  cartSongData: SongData[];
  cartAlbumData: AlbumData[];
};

export type CartContextType = {
  cartSongData: SongData[];
  setCartSongData: React.Dispatch<React.SetStateAction<SongData[]>>;
  cartAlbumData: AlbumData[];
  setCartAlbumData: React.Dispatch<React.SetStateAction<AlbumData[]>>;
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
  return (
    <MyCartContext.Provider
      value={{
        cartSongData,
        setCartSongData,
        cartAlbumData,
        setCartAlbumData,
      }}
    >
      {children}
    </MyCartContext.Provider>
  );
};

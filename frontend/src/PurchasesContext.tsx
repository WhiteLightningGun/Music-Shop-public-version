import React, { createContext, useState, ReactNode } from 'react';
import { PurchasedAlbumData, PurchasedSongData } from './ScaffoldData';

export type PurchasedContent = {
  purchasedSongData: PurchasedSongData[];
  purchasedAlbumData: PurchasedAlbumData[];
};

export type PurchasedContextType = {
  purchasedSongData: PurchasedSongData[];
  setPurchasedSongData: React.Dispatch<
    React.SetStateAction<PurchasedSongData[]>
  >;
  purchasedAlbumData: PurchasedAlbumData[];
  setPurchasedAlbumData: React.Dispatch<
    React.SetStateAction<PurchasedAlbumData[]>
  >;
};

// Define your default values
const defaultPurchasedSongData: PurchasedSongData[] = [];
const defaultPurchasedAlbumData: PurchasedAlbumData[] = [];

// Use the default values in your context
export const MyPurchasedContext = createContext<PurchasedContextType>({
  purchasedSongData: defaultPurchasedSongData,
  setPurchasedSongData: () => {},
  purchasedAlbumData: defaultPurchasedAlbumData,
  setPurchasedAlbumData: () => {},
});

// Define the type for your props
type PurchasedProviderProps = {
  children: ReactNode;
  initialPurchasedSongData?: PurchasedSongData[];
  initialPurchasedAlbumData?: PurchasedAlbumData[];
};

export const PurchasedProvider: React.FC<PurchasedProviderProps> = ({
  children,
  initialPurchasedSongData = defaultPurchasedSongData,
  initialPurchasedAlbumData = defaultPurchasedAlbumData,
}) => {
  const [purchasedSongData, setPurchasedSongData] = useState<
    PurchasedSongData[]
  >(initialPurchasedSongData);
  const [purchasedAlbumData, setPurchasedAlbumData] = useState<
    PurchasedAlbumData[]
  >(initialPurchasedAlbumData);

  return (
    <MyPurchasedContext.Provider
      value={{
        purchasedSongData,
        setPurchasedSongData,
        purchasedAlbumData,
        setPurchasedAlbumData,
      }}
    >
      {children}
    </MyPurchasedContext.Provider>
  );
};

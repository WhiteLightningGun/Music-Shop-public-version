/** @jsxImportSource @emotion/react */
import { useState, useRef, useEffect, useCallback, useContext } from 'react';
import { AlbumData } from './ScaffoldData';

interface Props {
  data: AlbumData;
  onClick: () => void;
}

const BuyAlbumAddToCart: React.FC<Props> = ({ onClick, data }: Props) => {
  return (
    <span onClick={onClick} style={{ cursor: 'pointer' }}>
      <p>Buy Album: £{data.AlbumPrice.toFixed(2)}</p>
    </span>
  );
};

export default BuyAlbumAddToCart;

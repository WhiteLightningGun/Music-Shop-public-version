/** @jsxImportSource @emotion/react */
import styled from '@emotion/styled';
import { css } from '@emotion/react';
import * as Icon from 'react-bootstrap-icons';
import { useContext, useEffect } from 'react';
import { MyCartContext, CartProvider } from './CartContext';
import { AlbumData } from './ScaffoldData';

interface CartModalAlbumEntryProps {
  albumData: AlbumData;
  removeSong: (song: AlbumData) => void;
}

function CartModalAlbumEntry({
  albumData,
  removeSong,
}: CartModalAlbumEntryProps) {
  const clickHandler = () => {
    removeSong(albumData);
  };
  return (
    <div className="row">
      <div className="col-8">
        <p className="text-dark normal-font-light">{albumData.AlbumName}</p>
      </div>
      <div className="col-2 text-end">
        <p>£{albumData.AlbumPrice.toFixed(2)}</p>
      </div>
      <div className="col-2 text-end" onClick={clickHandler}>
        <Icon.Trash className="text-dark " />
      </div>
    </div>
  );
}

export default CartModalAlbumEntry;

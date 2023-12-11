/** @jsxImportSource @emotion/react */
import styled from '@emotion/styled';
import { css } from '@emotion/react';
import * as Icon from 'react-bootstrap-icons';
import { useContext, useEffect } from 'react';
import { MyCartContext, CartProvider } from './CartContext';
import { SongData } from './ScaffoldData';

interface CartModalSongEntryProps {
  songData: SongData;
}

function CartModalSongEntry({ songData }: CartModalSongEntryProps) {
  return (
    <div>
      <p className="text-dark normal-font-light">{songData.songName}</p>
    </div>
  );
}

export default CartModalSongEntry;

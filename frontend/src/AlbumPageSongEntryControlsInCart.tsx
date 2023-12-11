/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import react, { useContext } from 'react';
import * as Icon from 'react-bootstrap-icons';
import { GetDownload } from './Data';
import { AlbumData, SongData } from './ScaffoldData';
import configData from './config.json';
import { Link } from 'react-router-dom';
import { MyCartContext } from './CartContext';

interface Props {
  onClick: () => void;
}

function SongInCart({ onClick }: Props) {
  return (
    <span
      className="text-glow text-glow-green"
      style={{ cursor: 'pointer' }}
      onClick={onClick}
    >
      (IN CART) &nbsp;
    </span>
  );
}

export default SongInCart;

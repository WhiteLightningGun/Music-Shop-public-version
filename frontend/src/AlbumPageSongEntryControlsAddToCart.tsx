/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import react, { useContext } from 'react';
import * as Icon from 'react-bootstrap-icons';
import { GetDownload } from './Data';
import { AlbumData, SongData } from './ScaffoldData';
import configData from './config.json';
import { Link } from 'react-router-dom';

interface Props {
  onClick: () => void;
}

const AddToCart: React.FC<Props> = ({ onClick }) => {
  return (
    <span
      className="text-white text-glow"
      style={{ cursor: 'pointer' }}
      onClick={onClick}
    >
      Add To Cart &nbsp;
    </span>
  );
};

export default AddToCart;

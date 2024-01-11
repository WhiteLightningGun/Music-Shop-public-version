/** @jsxImportSource @emotion/react */
import * as Icon from 'react-bootstrap-icons';
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

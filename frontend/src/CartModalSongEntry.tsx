/** @jsxImportSource @emotion/react */
import * as Icon from 'react-bootstrap-icons';
import { SongData } from './ScaffoldData';

interface CartModalSongEntryProps {
  songData: SongData;
  removeSong: (song: SongData) => void;
}

function CartModalSongEntry({ songData, removeSong }: CartModalSongEntryProps) {
  const clickHandler = () => {
    removeSong(songData);
  };
  return (
    <div className="row">
      <div className="col-8">
        <p className="text-dark normal-font-light">{songData.songName}</p>
      </div>
      <div className="col-2 text-end">
        <p>£{songData.SongPrice.toFixed(2)}</p>
      </div>
      <div className="col-2 text-end" onClick={clickHandler}>
        <Icon.Trash className="text-dark " />
      </div>
    </div>
  );
}

export default CartModalSongEntry;

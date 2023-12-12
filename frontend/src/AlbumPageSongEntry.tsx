/** @jsxImportSource @emotion/react */
import { SongData } from './ScaffoldData';
import { useLoginContext } from './LoggedInContext';
import { AlbumPageSongEntryLogin } from './AlbumPageSongEntryControls';
import { AlbumPageSongEntryControls } from './AlbumPageSongEntryControls';

interface Props {
  data: SongData;
}

function AlbumPageSongEntry({ data }: Props) {
  const { loggedIn } = useLoginContext();
  return (
    <>
      <div className="bg-dark p-1 border border-rounded normal-font-light">
        <div className="row">
          <div className="col-8 d-flex align-items-center justify-content-start">
            <span>
              &nbsp;{data.AlbumPosition}. &nbsp;{data.songName}&nbsp;£
              {data.SongPrice.toFixed(2)}&nbsp;
            </span>
          </div>
          <div className="col-4 d-flex align-items-center justify-content-end">
            {loggedIn ? (
              <AlbumPageSongEntryControls data={data} />
            ) : (
              <AlbumPageSongEntryLogin />
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default AlbumPageSongEntry;

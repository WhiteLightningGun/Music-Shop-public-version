/** @jsxImportSource @emotion/react */
import { AlbumData } from './ScaffoldData';
import { Link } from 'react-router-dom';
import config from './config.json';

interface Props {
  album: AlbumData;
}

function AccountBodyPurchase({ album }: Props) {
  const albumLinkHref = `${config.CLIENT_URL}/Albums/${album.kebabCase}`;
  return (
    <>
      <div className="row text-dark normal-font-light py-1">
        <div className="col-2 ">
          <Link className="nav-link normal-font" to={albumLinkHref}>
            <img
              src={album.FrontCoverPath}
              className="img-fluid"
              alt="album pic"
            />
          </Link>
        </div>
        <div className="col-8 text-start mb-0">
          <h3>{album.AlbumName}</h3>
          {album.TrackList.map((song, k) => (
            <p key={k}>{song.songName}</p>
          ))}
        </div>
      </div>
    </>
  );
}
export default AccountBodyPurchase;

/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { AlbumData } from './ScaffoldData';
import AlbumPageSongEntry from './AlbumPageSongEntry';
import { Link } from 'react-router-dom';
import AudioPlayer from './AudioPlayer';
import ReturnToTop from './ReturnToTop';

interface Props {
  data: AlbumData;
}

function AlbumPageBody({ data }: Props) {
  return (
    <>
      <div
        css={css`
          background: #ffffff;
        `}
      >
        <div className="container">
          <br></br>
          <div className="text-dark normal-font-light no-underline py-1">
            <h3>
              <span>
                <Link
                  className="text-dark normal-font-light no-underline"
                  to="/"
                >
                  Home
                </Link>
              </span>
              &nbsp; /&nbsp;
              <span>
                <Link
                  className="text-dark normal-font-light no-underline"
                  to="/Albums"
                >
                  Album
                </Link>
              </span>
              &nbsp;/&nbsp;{data.AlbumName}
            </h3>
          </div>
          <br></br>
          <div className="row m-2 text-dark normal-font-light py-1 align-items-center">
            <div className="col-md-6 mb-5">
              <img
                src={data.FrontCoverPath}
                className="img-fluid"
                alt="album pic"
              />
            </div>
            <AudioPlayer data={data} />
          </div>

          <div className="text-dark normal-font-light text-start ">
            <h3>Track List</h3>
            {data.TrackList.map((song, i) => (
              <AlbumPageSongEntry data={song} key={i} albumID={data.AlbumID} />
            ))}
          </div>
        </div>
        <ReturnToTop />
      </div>
    </>
  );
}

export default AlbumPageBody;

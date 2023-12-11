/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import React from 'react';
import { AlbumData } from './ScaffoldData';
import { Link } from 'react-router-dom';

interface Props {
  album: AlbumData;
}
function AlbumCard({ album }: Props) {
  return (
    <div className="col-md-4">
      <div className="card no-border">
        <img
          src={album.FrontCoverPath}
          className="card-img-top img-thumbnail no-border"
          alt="an album"
        />
        <div className="mb-3 mt-1">
          <p className="normal-font-light text-dark">
            Released:&nbsp;
            {new Date(album.ReleaseDate).toISOString().slice(0, 10)}
          </p>
          <h4 className="card-text normal-font">{album.AlbumName}</h4>
          <Link className="normal-font" to={album.kebabCase}>
            Listen and Buy
          </Link>
        </div>
      </div>
    </div>
  );
}

export default AlbumCard;

/* {data.ReleaseDate.toISOString().slice(0, 10)} */

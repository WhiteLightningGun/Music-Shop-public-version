/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import React from 'react';
import { Link } from 'react-router-dom';
import { AlbumData } from './ScaffoldData';
import AlbumCard from './AlbumCard';

interface Props {
  data: AlbumData[];
}

function AlbumsPageBody({ data }: Props) {
  return (
    <>
      <div
        css={css`
          background: #ffffff;
          min-height: 85vh;
        `}
      >
        <div className="container">
          <br></br>
          <div className="text-dark normal-font-light py-1">
            <h3>
              <span>
                <Link
                  className="text-dark normal-font-light no-underline"
                  to="/"
                >
                  Home
                </Link>
              </span>
              &nbsp;/&nbsp;
              <span>Album</span>
            </h3>
          </div>

          <div className="row">
            {data.map((albumInstance, i) => (
              <AlbumCard album={albumInstance} key={i} />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default AlbumsPageBody;

/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import albumPic from './PlaceholderData/Images/albumCover1.jpg';
import albumPic2 from './PlaceholderData/Images/albumCover2.jpg';
import albumPic3 from './PlaceholderData/Images/albumCover3.jpg';

function AlbumsPageBodyTemplate() {
  return (
    <>
      <body
        css={css`
          background: #ffffff;
          min-height: 80vh;
        `}
      >
        <div className="container">
          <br></br>
          <div className="text-dark normal-font-light py-1">
            <h3> Home / Albums </h3>
          </div>

          <div className="row">
            <div className="col-md-4">
              <div className="card no-border">
                <img
                  src={albumPic}
                  className="card-img-top img-thumbnail no-border"
                  alt="an album"
                />
                <div className="mb-3 mt-1">
                  <p className="normal-font-light text-dark">Released 2022</p>
                  <h4 className="card-text normal-font">Unknown Feels</h4>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card no-border">
                <img
                  src={albumPic2}
                  className="card-img-top img-thumbnail no-border"
                  alt="an album"
                />
                <div className="mb-3 mt-1">
                  <p className="normal-font-light text-dark">Released 2022</p>
                  <h4 className="card-text normal-font">Unknown Feels</h4>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card no-border">
                <img
                  src={albumPic3}
                  className="card-img-top img-thumbnail no-border"
                  alt="an album"
                />
                <div className="mb-3 mt-1">
                  <p className="normal-font-light text-dark">Released 2022</p>
                  <h4 className="card-text normal-font">Unknown Feels</h4>
                </div>
              </div>
            </div>
          </div>
        </div>
      </body>
    </>
  );
}

export default AlbumsPageBodyTemplate;

/** @jsxImportSource @emotion/react */
//import { css } from '@emotion/react';
import { css } from '@emotion/react';
import SeaGreenClouds from './PlaceholderData/Images/square sea green small.jpg';

function AboutBodyFrame() {
  return (
    <>
      <div
        className="row bg-dark text-light
      "
      >
        {' '}
        <div className="col-lg-6 mt-3">
          <div
            className="row bg-dark text-light
    "
          >
            <h1 className="text-start">About Electric Trojan</h1>
          </div>
          <div className="text-start normal-font text-white">
            <p>Here is some text about stuff about ET about stuff.</p>
          </div>
        </div>
        <div className="col-lg-6 my-4 p-3">
          <div className="text-center">
            <img
              css={css`
                max-height: 23vw;
                min-width: 21vw;
                min-height: 21vh;
              `}
              src={SeaGreenClouds}
              className="img-fluid border rounded ms-4"
              alt=""
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default AboutBodyFrame;

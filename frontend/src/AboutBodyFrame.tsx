/** @jsxImportSource @emotion/react */
//import { css } from '@emotion/react';
import { css } from '@emotion/react';
import { useState } from 'react';
import SeaGreenClouds from './PlaceholderData/Images/square sea green small.jpg';

function AboutBodyFrame() {
  const [isLoaded, setIsLoaded] = useState(false);
  return (
    <>
      <div
        style={{
          opacity: isLoaded ? 1 : 0,
          transition: 'opacity 1s ease-in-out',
        }}
      >
        <div
          className="row bg-dark text-light rounded ps-2
      "
        >
          <div className="col-lg-6 mt-3">
            <div
              className="row bg-dark text-light
    "
            >
              <h1 className="text-start">About Electric Trojan</h1>
            </div>
            <div className="text-start normal-font text-white">
              <p>
                Yes, I do write music. Hundreds of hours worth scattered all
                over the place across various projects. Here you may purchase
                and listen to some of the more popular stuff.
              </p>
              <p>Visit the albums page and have a look.</p>
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
                onLoad={() => setIsLoaded(true)}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default AboutBodyFrame;

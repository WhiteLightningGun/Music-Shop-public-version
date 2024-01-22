/** @jsxImportSource @emotion/react */
//import { css } from '@emotion/react';
import { css } from '@emotion/react';
import ETLogoPic from './PlaceholderData/Images/ETLogoPicB.jpg';

function AboutBodyFrame() {
  return (
    <>
      <div className="row d-flex align-items-center">
        <div>
          <h1
            className="my-2"
            css={css`
              background: #ffffff96;
            `}
          >
            About Me
          </h1>
        </div>
        <div className="text-center">
          <img
            css={css`
              max-height: 25vw;
              min-width: 21vw;
              min-height: 21vh;
            `}
            src={ETLogoPic}
            className="img-fluid align-top border rounded"
            alt=""
          />
        </div>
        <div
          className="m-3"
          css={css`
            background: #ffffff96;
          `}
        >
          <p>We've been, uhhhh, breakin' bucks here since 1842.</p>
          <p>Have you ever heard the legend of the unbreakable buck?</p>
        </div>
      </div>
    </>
  );
}

export default AboutBodyFrame;

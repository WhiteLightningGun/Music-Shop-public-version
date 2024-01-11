/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import albumPic from './PlaceholderData/Images/albumCover1.jpg';
import * as Icon from 'react-bootstrap-icons';
import Aragainz from './PlaceholderData/Audio/Aragainz.mp3';
import StringGrabber from './Data';

function AlbumPageBodyTemplate() {
  function handleClick() {
    StringGrabber();
  }

  return (
    <>
      <div
        css={css`
          background: #ffffff;
        `}
      >
        <div className="container">
          <br></br>
          <div className="text-dark normal-font-light py-1">
            <h3> Home / Albums / The Unknown Feels </h3>
          </div>
          <br></br>
          <div className="row m-2 text-dark normal-font-light py-1 align-items-center">
            <div className="col-md-6 mb-5">
              <img src={albumPic} className="img-fluid" alt="album pic" />
            </div>
            <div className="col-md-6 normal-font fs-4 ">
              <div className="">
                <audio src={Aragainz} />
                <span>
                  <p className="normal-font text-dark fs-5">
                    Livin' La Vida Troll Life
                  </p>
                  <p className="fs-6">1:23 / 3:14</p>
                  <input type="Range" max="100" value="44"></input>
                </span>
              </div>
              <p className="text-white fs-6">---</p>
              <div className="row">
                <div className="col-4 text-end">
                  <Icon.SkipBackward className="mb-1 fs-2" />
                </div>
                <div className="col-4">
                  <Icon.PlayCircle className="mb-1 fs-1" />
                </div>
                <div className="col-4 text-start">
                  <Icon.SkipForward className="mb-1 fs-2" />
                </div>
              </div>
              <br></br>
              <div className="text-start">
                <h4>Notes</h4>
                <p className="fs-6">Released: Feb 2022</p>
                <p className="fs-6">Track Count: 22</p>
                <p className="fs-6">Label: Chucks Agricultural Consortium</p>
              </div>
            </div>
          </div>

          <div className="text-dark normal-font-light text-start ">
            <h3>Track List</h3>
            <div className="bg-dark p-1 border border-rounded normal-font-light">
              01 - Intro (0:42)
              <span className="fs-7 m-1 text-end">
                <Icon.Cart className="mb-1 text-white" />
              </span>
            </div>
            <div className="bg-dark p-1 border border-rounded normal-font-light">
              02 - How to Seed and Feed, the right way! (Oh Yeaaaah!) (4:23)
              <span className="fs-7 m-1 text-end">
                <Icon.Cart className="mb-1 text-white" />
              </span>
            </div>
            <div className="bg-dark p-1 border border-rounded normal-font-light">
              03 - Livin' La Vida Troll Life (2:29)
              <span className="fs-7 m-1">
                <Icon.Cart className="mb-1 text-white" onClick={handleClick} />
              </span>
            </div>
          </div>
        </div>
        <div>Space filler, or breadcrumbs, or return to top button</div>
      </div>
    </>
  );
}

export default AlbumPageBodyTemplate;

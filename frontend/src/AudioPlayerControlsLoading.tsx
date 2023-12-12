/** @jsxImportSource @emotion/react */
import * as Icon from 'react-bootstrap-icons';

function AudioPlayerControlsLoading() {
  return (
    <div className="row">
      <div className="col-4 text-end">
        <Icon.SkipBackward className="mb-1 fs-2 text-dark" />
      </div>
      <div className="col-4">
        <Icon.DashCircle className="mb-1 fs-1 text-dark rotate-icon" />
      </div>
      <div className="col-4 text-start ">
        <Icon.SkipForward className="mb-1 fs-2 text-dark" />
      </div>
    </div>
  );
}

export default AudioPlayerControlsLoading;

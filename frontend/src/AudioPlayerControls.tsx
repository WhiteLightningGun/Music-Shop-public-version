/** @jsxImportSource @emotion/react */
import { useState, useRef, useEffect, useCallback } from 'react';
import * as Icon from 'react-bootstrap-icons';
import { AlbumData, SongData } from './ScaffoldData';
import AudioElement from './AudioElement';
import ProgressBar from './ProgressBar';
import configData from './config.json';
import { useLoginContext } from './LoggedInContext';

interface Props {
  decrementTrack: () => void;
  PlayClick: () => void;
  isPlaying: boolean;
  incrementTrack: () => void;
}

function AudioPlayerControls({
  decrementTrack,
  PlayClick,
  incrementTrack,
  isPlaying,
}: Props) {
  return (
    <div className="row">
      <div className="col-4 text-end">
        <Icon.SkipBackward
          className="mb-1 fs-2 icon-button"
          onClick={decrementTrack}
        />
      </div>
      <div className="col-4">
        {isPlaying ? (
          <Icon.PauseCircle
            className="mb-1 fs-1 icon-button"
            onClick={PlayClick}
          />
        ) : (
          <Icon.PlayCircle
            className="mb-1 fs-1 icon-button"
            onClick={PlayClick}
          />
        )}
      </div>
      <div className="col-4 text-start ">
        <Icon.SkipForward
          className="mb-1 fs-2 icon-button"
          onClick={incrementTrack}
        />
      </div>
    </div>
  );
}

export default AudioPlayerControls;

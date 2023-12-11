/** @jsxImportSource @emotion/react */
import { useState, useRef, useEffect, useCallback } from 'react';
import * as Icon from 'react-bootstrap-icons';
import { AlbumData, SongData } from './ScaffoldData';
import AudioElement from './AudioElement';
import ProgressBar from './ProgressBar';
import configData from './config.json';
import { useLoginContext } from './LoggedInContext';

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

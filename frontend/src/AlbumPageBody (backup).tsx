/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import react from 'react';
import { useState, useRef, useEffect, useCallback } from 'react';
import albumPic from './PlaceholderData/Images/albumCover1.jpg';
import * as Icon from 'react-bootstrap-icons';
import Aragainz from './PlaceholderData/Audio/Aragainz.mp3';
import { AlbumData, SongData } from './ScaffoldData';
import AlbumPageSongEntry from './AlbumPageSongEntry';
import AudioElement from './AudioElement';
import ProgressBar from './ProgressBar';
import { Link } from 'react-router-dom';

interface Props {
  data: AlbumData;
}

function AlbumPageBodyBackup({ data }: Props) {
  const [trackIndex, setTrackIndex] = useState<number>(0);
  const totalTrackCount = data.TrackList.length;
  const [currentSong, setCurrentSong] = useState<SongData>(
    data.TrackList[trackIndex],
  );
  const [timeProgress, setTimeProgress] = useState<number | undefined>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [duration, setDuration] = useState<number>(0);
  const playAnimationRef = useRef<any>();

  const audioRef = useRef<HTMLAudioElement>(null);
  const progressBarRef = useRef<HTMLInputElement>();

  const PlayClick = () => {
    if (audioRef.current?.paused) {
      audioRef.current?.play();
      setIsPlaying(true);
    } else {
      audioRef.current?.pause();
      setIsPlaying(false);
    }
  };

  const incrementTrack = () => {
    if (trackIndex + 1 >= totalTrackCount) {
      setTrackIndex(0);
      setCurrentSong(data.TrackList[0]);
    } else {
      setCurrentSong(data.TrackList[trackIndex + 1]);
      setTrackIndex(trackIndex + 1);
    }
    resetPlayer();
  };

  const decrementTrack = () => {
    if (trackIndex - 1 < 0) {
      setTrackIndex(totalTrackCount - 1);
      setCurrentSong(data.TrackList[totalTrackCount - 1]);
    } else {
      setCurrentSong(data.TrackList[trackIndex - 1]);
      setTrackIndex(trackIndex - 1);
    }
    resetPlayer();
  };
  const repeat = useCallback(() => {
    const currentTime = audioRef.current?.currentTime;
    setTimeProgress(currentTime);
    if (progressBarRef.current !== null) {
      progressBarRef.current!.value = String(currentTime);
    }
    playAnimationRef.current = requestAnimationFrame(repeat);
  }, []);

  const resetPlayer = () => {
    audioRef.current?.pause();
    setIsPlaying(false);
    setTimeProgress(0);
    if (progressBarRef.current !== null) {
      progressBarRef.current!.value = '0';
    }
  };

  useEffect(() => {
    if (isPlaying) {
      audioRef.current?.play();
      playAnimationRef.current = requestAnimationFrame(repeat);
    } else {
      audioRef.current?.pause();
      cancelAnimationFrame(playAnimationRef.current);
    }
  }, [isPlaying, audioRef, repeat]);

  return (
    <>
      <div
        css={css`
          background: #ffffff;
        `}
      >
        <div className="container">
          <br></br>
          <div className="text-dark normal-font-light no-underline py-1">
            <h3>
              <span>
                <Link
                  className="text-dark normal-font-light no-underline"
                  to="/"
                >
                  Home
                </Link>
              </span>
              &nbsp; /&nbsp;
              <span>
                <Link
                  className="text-dark normal-font-light no-underline"
                  to="/Albums"
                >
                  Album
                </Link>
              </span>
              &nbsp; /&nbsp;{data.AlbumName}
            </h3>
          </div>
          <br></br>
          <div className="row m-2 text-dark normal-font-light py-1 align-items-center">
            <div className="col-md-6 mb-5">
              <img
                src={data.FrontCoverPath}
                className="img-fluid"
                alt="album pic"
              />
            </div>
            <div className="col-md-6 normal-font fs-4 " id="audio player">
              <div className="">
                <AudioElement
                  data={currentSong}
                  audioRef={audioRef}
                  setDuration={setDuration}
                  progressBarRef={progressBarRef}
                />
                <span>
                  <p className="normal-font text-dark fs-5">
                    {currentSong.songName}
                  </p>
                  <ProgressBar
                    progressBarRef={progressBarRef}
                    audioRef={audioRef}
                    timeProgress={timeProgress}
                    duration={duration}
                    setTimeProgress={setTimeProgress}
                  />
                </span>
              </div>
              <p className="text-white fs-6">---</p>
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
              <br></br>
              <div className="text-start">
                <h4>Notes</h4>
                <p className="fs-6">
                  Released:&nbsp;
                  {data.ReleaseDate.toISOString().slice(0, 10)}
                </p>
                <p className="fs-6">Track Count: {data.TrackCount}</p>
              </div>
            </div>
          </div>

          <div className="text-dark normal-font-light text-start ">
            <h3>Track List</h3>
            {data.TrackList.map((song, i) => (
              <AlbumPageSongEntry data={song} key={i} />
            ))}
          </div>
        </div>
        <div>Space filler, or breadcrumbs, or return to top button</div>
      </div>
    </>
  );
}

export default AlbumPageBodyBackup;

/** @jsxImportSource @emotion/react */
import { useState, useRef, useEffect, useCallback } from 'react';
import * as Icon from 'react-bootstrap-icons';
import { AlbumData, SongData } from './ScaffoldData';
import AudioElement from './AudioElement';
import ProgressBar from './ProgressBar';
import configData from './config.json';
import { useLoginContext } from './LoggedInContext';
import AudioPlayerControls from './AudioPlayerControls';
import AudioPlayerControlsLoading from './AudioPlayerControlsLoading';

interface Props {
  data: AlbumData;
}

function AudioPlayer({ data }: Props) {
  const { loggedIn } = useLoginContext();
  const [trackIndex, setTrackIndex] = useState<number>(0);
  const totalTrackCount = data.TrackList.length;
  const [currentSong, setCurrentSong] = useState<SongData>(
    data.TrackList[trackIndex],
  );
  const [timeProgress, setTimeProgress] = useState<number | undefined>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [duration, setDuration] = useState<number>(0);
  const [isAudioLoading, setIsAudioLoading] = useState<boolean>(false);
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
    <div className="col-md-6 normal-font fs-4 " id="audio player">
      <div className="">
        <AudioElement
          data={currentSong}
          audioRef={audioRef}
          setDuration={setDuration}
          progressBarRef={progressBarRef}
          isAudioLoading={isAudioLoading}
          setIsAudioLoading={setIsAudioLoading}
        />
        <span>
          <p className="normal-font text-dark fs-5">{currentSong.songName}</p>
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
      {isAudioLoading ? (
        <AudioPlayerControlsLoading />
      ) : (
        <AudioPlayerControls
          decrementTrack={decrementTrack}
          PlayClick={PlayClick}
          incrementTrack={incrementTrack}
          isPlaying={isPlaying}
        />
      )}

      <br></br>
      <div className="text-start">
        <h4>Notes</h4>
        <p className="fs-6">
          Released:&nbsp;
          {new Date(data.ReleaseDate).toISOString().slice(0, 10)}
        </p>
        <p className="fs-6">Track Count: {data.TrackCount}</p>
        {!loggedIn ? (
          <p className="fs-6">
            <a href={`${configData.CLIENT_URL}/login`}>Login</a>&nbsp; / &nbsp;
            <a href={`${configData.CLIENT_URL}/register`}>Register</a> to hear
            the full track.
          </p>
        ) : (
          <p>Buy Album</p>
        )}
      </div>
    </div>
  );
}
export default AudioPlayer;

/*

{data.ReleaseDate.toISOString().slice(0, 10)}

*/

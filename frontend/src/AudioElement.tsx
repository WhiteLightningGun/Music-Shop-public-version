/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import react from 'react';
import { useState, useRef, useEffect, useContext } from 'react';
import { SongData } from './ScaffoldData';
import configData from './config.json';

interface Props {
  data: SongData;
  audioRef: any;
  setDuration: any;
  progressBarRef: any;
  isAudioLoading: boolean;
  setIsAudioLoading: (isAudioLoading: boolean) => void;
}

function AudioElement({
  data,
  audioRef,
  setDuration,
  progressBarRef,
  isAudioLoading,
  setIsAudioLoading,
}: Props) {
  const onLoadedMetadata = () => {
    const seconds = audioRef.current.duration;
    setDuration(seconds);
    progressBarRef.current.max = seconds;
  };
  const [audioUrl, setAudioUrl] = useState<string>('');
  useEffect(() => {
    const url = async () => {
      let url = await loadAudioWithToken(
        `${configData.SERVER_URL}/api/music/MusicFileArg?fileGetCode=${data.FilePathName}`,
        sessionStorage.getItem('Bearer'),
      );
      setAudioUrl(url);
      setIsAudioLoading(false);
    };
    url();
    //while waiting for url to finish loading, set audioUrl to empty string, lock out controls to prevent errors
    setIsAudioLoading(true);
  }, [data.FilePathName, setIsAudioLoading]);

  return (
    <>
      <audio
        src={audioUrl}
        id="audioElement"
        ref={audioRef}
        onLoadedMetadata={onLoadedMetadata}
      />
    </>
  );
}

export default AudioElement;

async function loadAudioWithToken(url: string, token: string | null) {
  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Network response was not ok');
  }

  const blob = await response.blob();
  const blobUrl = URL.createObjectURL(blob);
  return blobUrl;
}

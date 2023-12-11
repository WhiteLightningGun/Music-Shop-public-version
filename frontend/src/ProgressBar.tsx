import React from 'react';
import FormatTime from './FormatTime';

interface Props {
  progressBarRef: any;
  audioRef: any;
  timeProgress: any;
  duration: any;
  setTimeProgress: any;
}

function ProgressBar({
  progressBarRef,
  audioRef,
  timeProgress,
  duration,
  setTimeProgress,
}: Props) {
  const handleProgressChange = () => {
    audioRef.current.currentTime = progressBarRef.current.value;
    setTimeProgress(progressBarRef.current.value);
  };
  return (
    <>
      <p className="fs-6">
        {FormatTime(timeProgress)} / {FormatTime(duration)}
      </p>
      <input
        type="Range"
        max="100"
        defaultValue={0}
        ref={progressBarRef}
        onChange={handleProgressChange}
      ></input>
    </>
  );
}

export default ProgressBar;

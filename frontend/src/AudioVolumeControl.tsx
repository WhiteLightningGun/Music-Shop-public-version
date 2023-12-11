import React, { useState, ChangeEvent, RefObject } from 'react';

interface VolumeControlProps {
  audioRef: RefObject<HTMLAudioElement>;
}

const VolumeControl: React.FC<VolumeControlProps> = ({ audioRef }) => {
  const [volume, setVolume] = useState<number>(1);

  const handleVolumeChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  return (
    <div className="volume-control">
      <input
        type="range"
        min="0"
        max="1"
        step="0.01"
        value={volume}
        onChange={handleVolumeChange}
      />
    </div>
  );
};

export default VolumeControl;

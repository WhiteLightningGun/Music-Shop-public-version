// https://localhost:7158/api/Music/MusicHello
import configData from './config.json';
import { SongData } from './ScaffoldData';

const StringGrabber = () => {
  fetch('https://localhost:7158/api/Music/MusicHello')
    .then((response) => response.text())
    .then((data) => console.log(data));

  console.log('StringGrabber clicked, loading...');
};

export default StringGrabber;

/**
 * This function returns files in mp3 format
 */
async function GetDownload(data: SongData) {
  const response = await fetch(
    `${configData.SERVER_URL}/api/Music/MusicFileArgDownload?fileGetCode=${data.FilePathName}`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem('Bearer')}`,
      },
    },
  );

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const blob = await response.blob();
  const downloadUrl = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = downloadUrl;
  link.download = `${data.songName}.mp3`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
export { GetDownload };

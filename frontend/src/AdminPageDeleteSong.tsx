import React from 'react';
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { AlbumManagerJsonModel } from './JsonConverters';
import configData from './config.json';

interface AlbumManagerJsons {
  data: AlbumManagerJsonModel[];
}

let defaultSong = [
  {
    id: 1,
    songName: 'defaultsong',
    albumName: 'defaultalbum',
    albumId: 'defaultalbumid',
    length: '3:22',
    fileGetCode: 'defaultfilegetcode',
    albumPosition: 1,
    kebabCaseName: 'defaultkebabcasename',
  },
];

function AdminPageDeleteSong({ data }: AlbumManagerJsons) {
  const [notification, setNotification] = useState<string>('');
  const [songs, setSongs] = useState(defaultSong);
  const [selectedAlbumID, setSelectedAlbumID] = useState<string>('');
  const [selectedSongID, setSelectedSongID] = useState<string>('');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const onSubmit = async (data: any) => {
    if (!window.confirm(`Are you sure you want to delete this song?`)) {
      return;
    }

    let result = await postFormData(selectedSongID);
    if (result) {
      setNotification('Song deleted successfully');
      reset();
    } else {
      setNotification('Something went wrong, try again');
      console.log(errors);
    }
  };

  const albumSelectChange = (e: any) => {
    setSelectedAlbumID(e.target.value);
    getSongsListForAlbum(e.target.value).then((data) => {
      setSongs(data);
    });
  };

  const handleSongChange = (e: any) => {
    setSelectedSongID(e.target.value);
  };

  return (
    <div className="py-2 my-1 bg-light">
      <h2>Delete Song</h2>
      <small>currently selected albumID: {selectedAlbumID}</small>
      <form onSubmit={handleSubmit(onSubmit)} className="m-3">
        <div className="form-group">
          <label>Select Album</label>
          <select
            {...register('AlbumID')}
            onChange={albumSelectChange}
            className="form-control"
          >
            {data.map((album, index) => (
              <option key={index} value={album.albumId}>
                {album.albumName}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Select Song</label>
          <select
            {...register('SongName')}
            className="form-control"
            onChange={handleSongChange}
          >
            {songs
              ? songs.map((song, index) => (
                  <option key={index} value={song.fileGetCode}>
                    {song.songName}
                  </option>
                ))
              : null}
          </select>
        </div>
        <button type="submit" className="btn btn-danger mt-3">
          Delete
        </button>
        <p>{notification}</p>
      </form>
    </div>
  );
}

export default AdminPageDeleteSong;

async function getSongsListForAlbum(albumID: string) {
  const response = await fetch(
    `${configData.SERVER_URL}/api/Account/SongsByAlbumList?albumID=${albumID}`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem('Bearer')}`,
      },
    },
  );

  if (!response.ok) {
    // handle error
    console.log('Error getting songs list');
    return;
  }
  // handle success
  const data = await response.json();
  return data;
}

async function postFormData(SongID: string) {
  const response = await fetch(
    `${configData.SERVER_URL}/api/Account/DeleteSong?songID=${SongID}`,
    {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem('Bearer')}`,
      },
    },
  );

  if (!response.ok) {
    // handle error
    console.log('server !response.ok');
    return false;
  }
  // handle success
  return true;
}

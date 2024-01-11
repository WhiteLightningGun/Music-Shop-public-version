import { useState } from 'react';
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

function AdminPagePutSong({ data }: AlbumManagerJsons) {
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
    console.log(data.SongID);
    let result = await postFormData(
      data.NewSongName,
      data.SongID,
      data.songLength,
      data.AlbumPosition,
      data.SongPrice,
    );
    if (result) {
      setNotification('Song amended successfully');
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
    let newID = e.target.value;
    setSelectedSongID(newID);
  };

  return (
    <div className="py-2 my-1 bg-light">
      <h2>Amend Song</h2>
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
            {...register('SongID')}
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

        <div className="form-group">
          <label>New Song Name</label>
          <input
            type="string"
            {...register('NewSongName')}
            className="form-control"
            required
            placeholder="Enter new song name"
          />
        </div>

        <div className="form-group">
          <label>Song Price</label>
          <input
            type="number"
            step=".01"
            {...register('SongPrice')}
            className="form-control"
            required
          />
        </div>

        <div className="form-group">
          <label>Album Position</label>
          <input
            type="number"
            {...register('AlbumPosition')}
            className="form-control"
            required
          />
        </div>
        <button type="submit" className="btn btn-primary mt-3">
          Submit
        </button>
        <p>{notification}</p>
      </form>
    </div>
  );
}

export default AdminPagePutSong;

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

async function postFormData(
  SongName: string,
  SongID: string,
  SongLength: string,
  AlbumPosition: number,
  SongPrice: number,
) {
  const formData = new FormData();
  formData.append('SongName', SongName);
  formData.append('SongID', SongID);
  formData.append('SongLength', SongLength);
  formData.append('AlbumPosition', AlbumPosition.toString());
  formData.append('SongPrice', SongPrice.toString());

  const response = await fetch(`${configData.SERVER_URL}/api/Account/PutSong`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${sessionStorage.getItem('Bearer')}`,
    },
    body: formData,
  });

  if (!response.ok) {
    // handle error
    const errorData = await response.json();
    console.log('Error updating song:', errorData);
    return false;
  }
  // handle success
  return true;
}

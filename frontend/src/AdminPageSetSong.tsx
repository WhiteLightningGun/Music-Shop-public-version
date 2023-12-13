import React from 'react';
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { AlbumManagerJsonModel } from './JsonConverters';
import configData from './config.json';

interface AlbumManagerJsons {
  data: AlbumManagerJsonModel[];
}

function AdminPageSetSong({ data }: AlbumManagerJsons) {
  const [notification, setNotification] = useState<string>('');
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const onSubmit = async (data: any) => {
    //console.log(data);
    let result = await postFormData(
      data.AlbumID,
      data.Mp3File[0],
      data.AlbumPosition,
      data.SongName,
      data.SongPrice,
    );
    if (result) {
      setNotification('Song uploaded successfully');
      reset();
    } else {
      setNotification('Something went wrong, try again');
      console.log(errors);
    }
  };

  return (
    <div className="py-2 bg-light">
      <h2>Upload New Song</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="m-3">
        <div className="form-group">
          <label>Song Name</label>
          <input
            defaultValue=""
            {...register('SongName')}
            className="form-control"
            required
          />
        </div>

        <div className="form-group">
          <label>Song Price</label>
          <input
            defaultValue=""
            {...register('SongPrice')}
            className="form-control"
            required
          />
        </div>

        <div className="form-group">
          <label>Select Album</label>
          <select {...register('AlbumID')} className="form-control">
            {data.map((album, index) => (
              <option key={index} value={album.albumId}>
                {album.albumName}
              </option>
            ))}
          </select>
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

        <div className="form-group p-2">
          <label className="text-normal px-2">MP3 File</label>
          <input
            type="file"
            {...register('Mp3File')}
            className="form-control-file"
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

export default AdminPageSetSong;

async function postFormData(
  selectedAlbumID: string,
  selectedFile: File | null,
  songPosition: number,
  songName: string,
  songPrice: number,
) {
  if (!selectedFile) {
    console.error('No file selected');
    return;
  }

  const formData = new FormData();
  formData.append('SongName', songName);
  formData.append('SongFile', selectedFile);
  formData.append('AlbumID', selectedAlbumID);
  formData.append('AlbumPosition', songPosition.toString());
  formData.append('SongPrice', songPrice.toString());

  const response = await fetch(`${configData.SERVER_URL}/api/Account/SetSong`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${sessionStorage.getItem('Bearer')}`,
    },
    body: formData,
  });

  if (!response.ok) {
    // handle error
    console.log('Error uploading file');
    return false;
  }
  // handle success
  return true;
}

/** @jsxImportSource @emotion/react */
import { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import configData from './config.json';
import { AlbumManagerJsonModel } from './JsonConverters';

interface AlbumManagerJsons {
  data: AlbumManagerJsonModel[];
  refreshAlbumData: () => void;
}

type FormData = {
  albumId: string;
};

const AdminPageDeleteAlbum = ({
  data,
  refreshAlbumData,
}: AlbumManagerJsons) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();
  const formRef = useRef<HTMLFormElement>(null);
  const [selectedAlbum, setSelectedAlbum] = useState<string | null>('');

  const [notification, setNotification] = useState<string>('');

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedIndex = e.target.selectedIndex;
    const selectedOptionText = e.target[selectedIndex].innerHTML;
    setSelectedAlbum(selectedOptionText);
  };

  const onSubmit = async (data: FormData) => {
    // Handle form submission logic here
    if (
      !window.confirm(
        `Are you sure you want to delete album: "${selectedAlbum}"?`,
      )
    ) {
      return;
    }
    let result = await postFormData(data.albumId);
    if (result) {
      if (formRef.current) formRef.current.reset();
      setNotification('Album deleted successfully');
      refreshAlbumData();
    } else {
      setNotification(`Something went wrong, try again.` + errors);
    }
  };

  return (
    <>
      <div className="bg-light my-2">
        <form onSubmit={handleSubmit(onSubmit)} ref={formRef}>
          <div>
            <h3>Delete Album</h3>
          </div>
          <div className="mb-3">
            <label htmlFor="albumId" className="form-label">
              Select Album:&nbsp;
            </label>
            <select
              {...register('albumId', { required: true })}
              id="albumId"
              onChange={handleChange}
            >
              {data.map((album, i) => (
                <option value={album.albumId} key={i}>
                  {album.albumName}
                </option>
              ))}
            </select>
          </div>
          <input type="submit" className="btn btn-danger" />
          <p>{notification}</p>
        </form>
      </div>
    </>
  );
};

export default AdminPageDeleteAlbum;

async function postFormData(albumID: string) {
  if (!albumID) {
    console.error('No album selected');
    return;
  }
  console.log(albumID);

  try {
    const response = await fetch(
      `${process.env.REACT_APP_SERVER_URL}/api/Account/ManageAlbum`,
      {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem('Bearer')}`,
          'Content-type': 'application/json; charset=UTF-8',
          accept: '*/*',
        },
        body: JSON.stringify(albumID),
      },
    );

    if (!response.ok) {
      // handle error
      console.log('Error uploading file');
      return false;
    }

    // handle success
    return true;
  } catch (error) {
    console.error('Error trying to delete', error);
    return false;
  }
}

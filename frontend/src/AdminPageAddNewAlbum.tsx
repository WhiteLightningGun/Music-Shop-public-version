/** @jsxImportSource @emotion/react */
import { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import configData from './config.json';

type FormData = {
  albumName: string;
  releaseDate: string;
  albumPrice: number;
};

const AdminPageAddNewAlbum = ({ refreshAlbumData }: any) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();
  const formRef = useRef<HTMLFormElement>(null);

  const [notification, setNotification] = useState<string>('');

  const onSubmit = async (data: FormData) => {
    // Handle form submission logic here
    console.log(data);
    let result = await postFormData(
      data.albumName,
      new Date(data.releaseDate),
      data.albumPrice,
    );
    if (result) {
      if (formRef.current) formRef.current.reset();
      setNotification('Album created successfully');
      refreshAlbumData();
    } else {
      setNotification('Something went wrong, try again');
    }
  };
  // album.AlbumPrice
  return (
    <>
      <div className="bg-light">
        <form onSubmit={handleSubmit(onSubmit)} ref={formRef}>
          <div>
            <h3>Create New Album</h3>
          </div>
          <div className="mb-3">
            <label htmlFor="albumName" className="form-label">
              Album Name:
            </label>
            <input
              {...register('albumName', { required: true })}
              type="text"
              className="form-control"
              id="albumName"
            />
            {errors.albumName && <p>This field is required</p>}
            <label htmlFor="albumPrice" className="form-label">
              Album Price:
            </label>
            <input
              {...register('albumPrice', { required: true })}
              type="number"
              className="form-control"
              id="albumPrice"
            />
            {errors.albumPrice && <p>This field is required</p>}
            <label htmlFor="releaseDate" className="form-label">
              Release Date:
            </label>
            <input
              {...register('releaseDate', { required: true })}
              type="date"
              className="form-control"
              id="releaseDate"
            />
            {errors.releaseDate && <p>This field is required</p>}
          </div>
          <input type="submit" className="btn btn-primary" />
        </form>
        <p className="text-danger">{notification}</p>
      </div>
      <div>
        <br></br>
      </div>
    </>
  );
};

export default AdminPageAddNewAlbum;

async function postFormData(
  albumName: string,
  releaseDate: Date | null,
  albumPrice: number,
) {
  if (!albumName || !releaseDate) {
    console.error('No file selected');
    return;
  }

  const formDataB = {
    albumName: albumName,
    releaseDate: releaseDate.toISOString(),
    albumPrice: albumPrice,
  };

  try {
    const response = await fetch(
      `${configData.SERVER_URL}/api/Account/ManageAlbum`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem('Bearer')}`,
          'Content-type': 'application/json; charset=UTF-8',
        },
        body: JSON.stringify(formDataB),
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
    console.error('Error uploading file:', error);
    return false;
  }
}

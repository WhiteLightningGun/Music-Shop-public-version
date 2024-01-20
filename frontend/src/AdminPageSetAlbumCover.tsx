/** @jsxImportSource @emotion/react */
import { useState, useRef } from 'react';
import { AlbumManagerJsonModel } from './JsonConverters';

interface AlbumManagerJsons {
  data: AlbumManagerJsonModel[];
}

function AdminPageSetAlbumCover({ data }: AlbumManagerJsons) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedAlbum, setSelectedAlbum] = useState<string>('');
  const formRef = useRef<HTMLFormElement>(null);
  const [notification, setNotification] = useState<string>('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedFile(e.target.files[0]);
    }
  };
  const handleAlbumChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedAlbum(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (selectedFile) {
      // Handle the file upload here
      let result = await postFormData(selectedAlbum, selectedFile);
      if (result) {
        if (formRef.current) formRef.current.reset();
        setSelectedFile(null);
        setSelectedAlbum('');
        setNotification('Album cover uploaded successfully');
      }
    } else {
      setNotification('Something went wrong, try again');
    }
  };

  return (
    <>
      <form
        ref={formRef}
        className="form-group bg-light p-1"
        onSubmit={handleSubmit}
      >
        <div>
          <h3>Upload album cover</h3>
        </div>
        <label htmlFor="form-control-albumid" id="albumSelect">
          Select Album To Upload Cover Art, remember to use jpg, jpeg or png
          file and perfect square ratio
        </label>
        <select
          className="form-control"
          onChange={handleAlbumChange}
          id="form-control-albumid"
        >
          {data.map((item, index) => (
            <option key={index} value={item.albumId}>
              {item.albumName}
            </option>
          ))}
        </select>
        <br></br>
        <div className="form-group">
          <input
            type="file"
            accept=".jpg,.png,.jpeg"
            onChange={handleFileChange}
            className="form-control-file"
            id="exampleFormControlFile1"
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Submit
        </button>
        <p>{notification}</p>
      </form>
    </>
  );
}

export default AdminPageSetAlbumCover;

async function postFormData(
  selectedAlbumID: string,
  selectedFile: File | null,
) {
  if (!selectedFile) {
    console.error('No file selected');
    return;
  }

  const formData = new FormData();
  formData.append('AlbumId', selectedAlbumID);
  formData.append('PictureFile', selectedFile);

  const response = await fetch(
    `${process.env.REACT_APP_SERVER_URL}/api/Account/SetAlbumCover`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem('Bearer')}`,
      },
      body: formData,
    },
  );

  if (!response.ok) {
    // handle error
    console.log('Error uploading file');
    return false;
  }
  // handle success
  return true;
}

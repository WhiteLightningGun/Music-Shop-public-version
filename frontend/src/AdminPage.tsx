/** @jsxImportSource @emotion/react */
import { useState, useEffect } from 'react';
import { CheckIsAdmin } from './IsAdminCheck';
import Header from './Header';
import FooterTemplate from './FooterTemplate';
import AdminPageSetAlbumCover from './AdminPageSetAlbumCover';
import AdminPageAddNewAlbum from './AdminPageAddNewAlbum';
import configData from './config.json';
import { AlbumManagerJsonModel } from './JsonConverters';
import AdminPageDeleteAlbum from './AdminPageDeleteAlbum';
import AdminPageSetSong from './AdminPageSetSong';
import AdminPagePutSong from './AdminPagePutSong';
import AdminPageDeleteSong from './AdminPageDeleteSong';

function AdminPage() {
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [albumData, setAlbumData] = useState<any>([]);

  useEffect(() => {
    const loggedInAdminCheck = async () => {
      let adminCheck = await CheckIsAdmin();
      setIsAdmin(adminCheck);
    };
    loggedInAdminCheck();
    ConvertAlbumsToList().then((data) => {
      setAlbumData(data);
    });
  }, []);

  const refreshAlbumData = () => {
    ConvertAlbumsToList().then((data) => {
      setAlbumData(data);
    });
  };
  return (
    <>
      <Header />
      <div className="container">
        <div className="row">
          <div className="col-12">
            <h1>Admin Page</h1>
            <p>You are {isAdmin ? 'Admin' : 'Not Admin'}</p>
          </div>
        </div>
        <div className="row">
          <AdminPageAddNewAlbum refreshAlbumData={refreshAlbumData} />
          <AdminPageSetAlbumCover data={albumData} />
          <AdminPageDeleteAlbum
            data={albumData}
            refreshAlbumData={refreshAlbumData}
          />
          <AdminPageSetSong data={albumData} />
          <AdminPagePutSong data={albumData} />
          <AdminPageDeleteSong data={albumData} />
        </div>
      </div>
      <FooterTemplate />
    </>
  );
}

export default AdminPage;

async function GetAlbumsList() {
  let albumsList = await fetch(
    `${configData.SERVER_URL}/api/Account/GetAlbumsList`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem('Bearer')}`,
      },
    },
  )
    .then((response) => (response.status === 200 ? response.json() : false))
    .then((data) => {
      return data;
    })
    .catch(() => {
      return false;
    });
  return albumsList;
}

async function ConvertAlbumsToList(): Promise<AlbumManagerJsonModel[]> {
  const albumsList = await GetAlbumsList();

  return albumsList.map((album: AlbumManagerJsonModel) => {
    return {
      // Assuming AlbumManagerJsonModel has properties like id, name, etc.
      albumId: album.albumId,
      albumName: album.albumName,
      // Add other properties as needed
    } as AlbumManagerJsonModel;
  });
}

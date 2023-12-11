import { AlbumData } from './ScaffoldData';
import configData from './config.json';

async function GetAlbums() {
  let albumsTestResult = fetch(
    `${configData.SERVER_URL}/api/Music/GrabAlbums`,
    {
      method: 'GET',
    },
  )
    .then((response) => (response.status === 200 ? response.json() : false))
    .then((data) => {
      return data;
    })
    .catch(() => {
      return false;
    });
  return albumsTestResult;
}

export { GetAlbums };

export type RegisterPostBody = {
  email: string;
  password: string;
};

export type LoginForm = {
  email: string;
  password: string;
  consent: boolean;
};

export type PasswordResetWithCode = {
  email: string;
  resetCode: string;
  newPassword: string;
};

export type AlbumManagerJsonModel = {
  albumName: string;
  albumId: string;
};

async function RegisterPost(formData: RegisterPostBody) {
  let body: RegisterPostBody = {
    email: formData.email,
    password: formData.password,
  };
  let jsonBody = JSON.stringify(body);

  let result = fetch(`${configData.SERVER_URL}/register`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json; charset=UTF-8',
      'Accept-Encoding': 'gzip, deflate, br',
    },
    body: jsonBody,
  })
    .then((response) => {
      if (response.status === 200) {
        return true;
      } else {
        return false;
      }
    })
    .then((data) => {
      return data;
    })
    .catch(() => {
      return false;
    });

  return result;
}
export { RegisterPost };

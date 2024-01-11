import configData from './config.json';

async function GetAlbums() {
  let albumsResult = fetch(`${configData.SERVER_URL}/api/Music/GrabAlbums`, {
    method: 'GET',
  })
    .then((response) => (response.status === 200 ? response.json() : false))
    .then((data) => {
      return data;
    })
    .catch(() => {
      return false;
    });
  return albumsResult;
}

export { GetAlbums };

async function GetPurchasedAlbums() {
  const bearerToken = sessionStorage.getItem('Bearer');
  let headers = {};

  if (bearerToken) {
    headers = {
      Authorization: `Bearer ${bearerToken}`,
    };
  }

  let albumsResult = fetch(`${configData.SERVER_URL}/api/Music/GetUserAlbums`, {
    method: 'GET',
    headers: headers,
  })
    .then((response) => {
      if (response.status === 200) {
        return response.json();
      } else if (response.status === 401) {
        return false;
      } else {
        return false;
      }
    })
    .then((data) => {
      return data;
    })
    .catch(() => {
      return [];
    });
  return albumsResult;
}

export { GetPurchasedAlbums };

async function GetPurchasedSongs() {
  const bearerToken = sessionStorage.getItem('Bearer');
  let headers = {};

  if (bearerToken) {
    headers = {
      Authorization: `Bearer ${bearerToken}`,
    };
  }
  let songsResult = fetch(`${configData.SERVER_URL}/api/Music/GetUserSongs`, {
    method: 'GET',
    headers: headers,
  })
    .then((response) => {
      if (response.status === 200) {
        return response.json();
      } else if (response.status === 401) {
        return false;
      } else {
        return false;
      }
    })
    .then((data) => {
      return data;
    })
    .catch(() => {
      return [];
    });
  return songsResult;
}

export { GetPurchasedSongs };

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

async function RegisterPost(formData: RegisterPostBody): Promise<Response> {
  const jsonBody = JSON.stringify(formData);

  try {
    const response = await fetch(`${configData.SERVER_URL}/register`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json; charset=UTF-8',
        'Accept-Encoding': 'gzip, deflate, br',
      },
      body: jsonBody,
    });
    return response;
  } catch (error) {
    throw new Error(String(error));
  }
}
export { RegisterPost };

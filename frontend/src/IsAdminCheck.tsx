import configData from './config.json';

async function CheckIsAdmin() {
  let bearerToken = sessionStorage.getItem('Bearer');
  if (bearerToken === null) {
    return false;
  }
  let response = await fetch(
    `${configData.SERVER_URL}/api/account/isadministrator`,
    {
      method: 'GET',
      headers: {
        Authorization: 'Bearer ' + bearerToken,
      },
    },
  );
  if (response.ok) {
    return true;
  } else {
    return false;
  }
}

export { CheckIsAdmin };

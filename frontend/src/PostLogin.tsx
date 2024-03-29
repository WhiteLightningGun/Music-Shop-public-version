import { LoginForm } from './JsonConverters';

type LoginPostBody = {
  email: string;
  password: string;
  twoFactorCode: string;
  twoFactorRecoveryCode: string;
};

async function PostLogin(formData: LoginForm) {
  const body: LoginPostBody = {
    email: formData.email,
    password: formData.password,
    twoFactorCode: '',
    twoFactorRecoveryCode: '',
  };

  const response = await fetch(
    `${process.env.REACT_APP_SERVER_URL}/api/Account/Login`,
    {
      method: 'POST',
      body: JSON.stringify(body),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    },
  );

  if (response.status === 401) {
    let responseDetail = await response.json();
    return { status: 401, message: responseDetail.detail };
  }

  if (!response.ok) {
    console.log('login failed');
    return { status: response.status, message: 'Login failed' };
  }

  const data = await response.json();
  console.log('post login called');
  sessionStorage.setItem('Bearer', String(data.accessToken));
  localStorage.setItem('refresh', String(data.refreshToken));

  return { status: 200, message: 'Login successful' };
}

export { PostLogin };

async function PostLoginCookie(formData: LoginForm) {
  //fetch('https://localhost:7158/login');

  let body: LoginPostBody = {
    email: formData.email,
    password: formData.password,
    twoFactorCode: '',
    twoFactorRecoveryCode: '',
  };
  let jsonBody = JSON.stringify(body);

  let result = await fetch('https://localhost:7158/login?useCookies=true', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json; charset=UTF-8',
      'Accept-Encoding': 'gzip, deflate, br',
    },
    body: jsonBody,
  })
    .then((response) => {
      console.log(response);
    })
    .then(() => {
      return '123';
    });

  return result;
}

export { PostLoginCookie };

async function GetInfoTest() {
  //console.log(sessionStorage.getItem('Bearer'));
  //console.log(localStorage.getItem('refresh'));

  let infoTestResult = await fetch(
    `${process.env.REACT_APP_SERVER_URL}/manage/info`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem('Bearer')}`,
      },
    },
  )
    .then((response) => (response.status === 200 ? response.json() : false))
    .then((data) => {
      console.log(data);
      return data;
    })
    .catch(() => {
      return false;
    });
  return infoTestResult;
}
export { GetInfoTest };

async function GetInfoEmail() {
  //console.log(sessionStorage.getItem('Bearer'));
  //console.log(localStorage.getItem('refresh'));

  let infoTestResult = await fetch(
    `${process.env.REACT_APP_SERVER_URL}/manage/info`,
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
  return infoTestResult;
}
export { GetInfoEmail };

async function CheckLoggedIn() {
  if (!sessionStorage.getItem('Bearer')) {
    return false;
  }

  let infoTestResult = await fetch(
    `${process.env.REACT_APP_SERVER_URL}/manage/info`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem('Bearer')}`,
      },
    },
  ).then((response) => {
    return response.status === 200;
  });
  return infoTestResult;
}
export { CheckLoggedIn };

async function TryRefresh(refreshTokenArg: string | null) {
  const backendUrl = process.env.REACT_APP_SERVER_URL;
  let body: any = {
    refreshToken: refreshTokenArg,
  };
  let jsonBody = JSON.stringify(body);

  let result = await fetch(`${backendUrl}/refresh`, {
    method: 'POST',
    body: jsonBody,
    headers: {
      'Content-type': 'application/json; charset=UTF-8',
    },
  })
    .then((response) => {
      if (response.status === 200) {
        return response.json();
      } else {
        return false;
      }
    })
    .then((data) => {
      if (data === false) {
        return false;
      }
      sessionStorage.setItem('Bearer', String(data.accessToken));
      localStorage.setItem('refresh', String(data.refreshToken));
      return true;
    })
    .catch(() => {
      console.log('login failed');
      return false;
    });

  return result;
}

export { TryRefresh };

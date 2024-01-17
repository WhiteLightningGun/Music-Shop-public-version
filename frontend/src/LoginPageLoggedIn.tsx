import React from 'react';
import Logout from './Logout';

interface LoginFormProps {
  setLoggedIn: any;
}

const LoginPageLoggedIn: React.FC<LoginFormProps> = ({ setLoggedIn }) => {
  return (
    <form className="text-start">
      <div className="form-group">
        <label className="mb-2">Email address</label>
        <input
          type="email"
          name="email"
          className="form-control"
          defaultValue={''}
          autoComplete="email"
          disabled
        />
      </div>
      <div className="form-group">
        <label className="my-2">Password</label>
        <input
          type="password"
          name="password"
          className="form-control"
          defaultValue={''}
          disabled
        />
      </div>
      <div className="form-group form-check my-2">
        <p className="small text-danger"></p>
      </div>
      <div className="text-start" role="status">
        <Logout setLoggedIn={setLoggedIn} />
      </div>
    </form>
  );
};

export default LoginPageLoggedIn;

import React from 'react';

interface LoginFormProps {
  register: any; // replace with appropriate type
  handleSubmit: any; // replace with appropriate type
  onSubmit: any; // replace with appropriate type
  notification: String;
  spinner: boolean;
}

const LoginPageForm: React.FC<LoginFormProps> = ({
  register,
  handleSubmit,
  onSubmit,
  notification,
  spinner,
}) => {
  return (
    <form className="text-start" onSubmit={handleSubmit(onSubmit)}>
      <div className="form-group">
        <label className="mb-2">Email address</label>
        <input
          {...register('email')}
          type="email"
          name="email"
          className="form-control"
          placeholder="Enter email"
          defaultValue={''}
          autoComplete="email"
        />
      </div>
      <div className="form-group">
        <label className="my-2">Password</label>
        <input
          {...register('password')}
          type="password"
          name="password"
          className="form-control"
          placeholder="Password"
          defaultValue={''}
        />
      </div>
      <div className="form-group form-check my-2">
        <p className="small text-danger">{notification}</p>
      </div>
      {spinner ? (
        <div className="spinner-border text-info" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      ) : (
        <button type="submit" className="btn btn-info btn-login">
          <span className="badge">LOGIN</span>
        </button>
      )}
    </form>
  );
};

export default LoginPageForm;

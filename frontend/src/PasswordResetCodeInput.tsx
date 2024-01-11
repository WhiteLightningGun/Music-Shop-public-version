/** @jsxImportSource @emotion/react */
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { PasswordResetWithCode } from './JsonConverters';
import configData from './config.json';

function PasswordResetCodeInput() {
  const { register, handleSubmit, reset, getValues } =
    useForm<PasswordResetWithCode>();
  const [notification, setNotification] = useState<String>(' ');
  const [isSliderOpen, setIsSliderOpen] = useState(false);
  const toggleSlider = () => setIsSliderOpen(!isSliderOpen);

  const onSubmit = async (formData: any) => {
    if (formData.email === '') {
      setNotification('Please check.');
      return;
    }
    // post to password reset api
    let passwordResetForm = getValues();
    try {
      //set state to spinner here
      setNotification('');

      const response = await postNewPassword(passwordResetForm);
      if (response.status === 200) {
        // Clear the form
        reset();
        // Set a success notification

        setNotification('Password reset successful.');
      } else {
        // Set an error notification
        setNotification('Failed to reset password.');
      }
    } catch (error) {
      // Handle any errors
      setNotification(
        'An error occurred while sending the password reset form.',
      );
    }
  };

  return (
    <>
      <p className="text-dark text-start normal-font-light no-underline py-1">
        I have received my reset code...
      </p>
      <div className="d-flex justify-content-start">
        <button
          type="submit"
          onClick={toggleSlider}
          className="btn btn-info btn-login"
        >
          <span className="badge">ENTER RESET CODE</span>
        </button>
      </div>
      <div className={`slider ${isSliderOpen ? 'open' : ''}`}>
        <div className="text-dark normal-font-light no-underline py-1">
          <h3>Enter your new password</h3>
          <form className="text-start" onSubmit={handleSubmit(onSubmit)}>
            <div className="form-group">
              <label className="mb-2">Email</label>
              <input
                {...register('email')}
                type="email"
                name="email"
                className="form-control"
                placeholder="Enter email"
                defaultValue={''}
              />
              <br />
              <label className="mb-2">Reset Code</label>
              <input
                {...register('resetCode')}
                type="string"
                name="resetCode"
                className="form-control"
                placeholder="Enter reset code"
                defaultValue={''}
              />
              <br />
              <label className="mb-2">New Password</label>
              <input
                {...register('newPassword')}
                type="string"
                name="newPassword"
                className="form-control"
                placeholder="Enter your new password"
                defaultValue={''}
              />
            </div>
            <br />
            <p>{notification}</p>
            <button type="submit" className="btn btn-info btn-login">
              <span className="badge">SUBMIT</span>
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

export default PasswordResetCodeInput;

async function postNewPassword(body: PasswordResetWithCode) {
  console.log(JSON.stringify(body));
  const response = await fetch(`${configData.SERVER_URL}/resetPassword`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json; charset=UTF-8',
      'Accept-Encoding': 'gzip, deflate, br',
    },
    body: JSON.stringify(body),
  });

  return response;
}

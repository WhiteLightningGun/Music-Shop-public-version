const Logout = ({ setLoggedIn }: any) => {
  const clickHandler = () => {
    sessionStorage.setItem('Bearer', '');
    localStorage.setItem('refresh', '');
    setLoggedIn(false);
  };
  return (
    <div>
      <button onClick={clickHandler} className="btn btn-danger btn-login">
        <span className="badge">LOGOUT</span>
      </button>
    </div>
  );
};

export default Logout;

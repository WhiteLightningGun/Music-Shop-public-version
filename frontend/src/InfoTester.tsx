/** @jsxImportSource @emotion/react */
import { GetInfoTest } from './PostLogin';

function InfoTester() {
  const clickHandler = async () => {
    let res = await GetInfoTest();
  };
  return (
    <div>
      <button onClick={clickHandler} className="btn btn-info btn-login">
        <span className="badge">InfoTest</span>
      </button>
    </div>
  );
}

export default InfoTester;

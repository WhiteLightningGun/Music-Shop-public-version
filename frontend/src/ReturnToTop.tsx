import * as Icon from 'react-bootstrap-icons';

function ReturnToTop() {
  const handleClick = () => {
    //return to top
    window.scrollTo(0, 0);
  };
  return (
    <div>
      <div className="my-1">
        <span>
          <Icon.ChevronUp
            className="mb-1 fs-1 return-to-top"
            onClick={handleClick}
          />
        </span>
        <p>
          <span className="return-to-top" onClick={handleClick}>
            Return to top
          </span>
        </p>
      </div>
    </div>
  );
}

export default ReturnToTop;

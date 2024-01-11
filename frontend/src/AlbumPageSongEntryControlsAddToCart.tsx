/** @jsxImportSource @emotion/react */

interface Props {
  onClick: () => void;
}

const AddToCart: React.FC<Props> = ({ onClick }) => {
  return (
    <span
      className="text-white text-glow"
      style={{ cursor: 'pointer' }}
      onClick={onClick}
    >
      Add To Cart &nbsp;
    </span>
  );
};

export default AddToCart;

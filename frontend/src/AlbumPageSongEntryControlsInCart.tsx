/** @jsxImportSource @emotion/react */

interface Props {
  onClick: () => void;
}

function SongInCart({ onClick }: Props) {
  return (
    <span
      className="text-glow text-glow-green"
      style={{ cursor: 'pointer' }}
      onClick={onClick}
    >
      (IN CART) &nbsp;
    </span>
  );
}

export default SongInCart;

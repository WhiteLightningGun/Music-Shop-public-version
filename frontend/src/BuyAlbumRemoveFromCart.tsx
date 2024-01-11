/** @jsxImportSource @emotion/react */

interface Props {
  onClick: () => void;
}

const BuyAlbumRemoveFromCart: React.FC<Props> = ({ onClick }: Props) => {
  return (
    <span onClick={onClick} style={{ cursor: 'pointer' }}>
      <p>- Remove Album From Cart -</p>
    </span>
  );
};

export default BuyAlbumRemoveFromCart;

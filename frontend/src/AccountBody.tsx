/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import react, { useContext } from 'react';
import { useEffect, useState, useRef } from 'react';
import Header from './Header';
import AlbumsPageBody from './AlbumsPageBody';
import FooterTemplate from './FooterTemplate';
import {
  AlbumData,
  PurchasedAlbumData,
  PurchasedSongData,
  SongData,
  getAlbums,
} from './ScaffoldData';
import { GetAlbums } from './JsonConverters';
import Loading from './Loading';
import { useLoginContext } from './LoggedInContext';
import { GetInfoEmail } from './PostLogin';
import { MyPurchasedContext } from './PurchasesContext';
import { MyCartContext } from './CartContext';

interface Props {
  userEmail: string;
  albumData: AlbumData[];
}

function AccountBody({ userEmail, albumData }: Props) {
  //const context = useContext(MyPurchasedContext);
  const context = useContext(MyCartContext);
  const { purchasedAlbumData, purchasedSongData } = context || {};
  const purchasedAlbumDataStrings = useRef<string[]>([]);
  const purchasedSongDataStrings = useRef<string[]>([]);
  const [filteredAlbumData, setFilteredAlbumData] = useState<AlbumData[]>([]);

  useEffect(() => {
    if (purchasedAlbumData) {
      purchasedAlbumDataStrings.current = purchasedAlbumData?.map((album) => {
        return String(album);
      });
    }
    if (purchasedSongData) {
      purchasedSongDataStrings.current = purchasedSongData?.map((album) => {
        return String(album);
      });
    }
    setFilteredAlbumData(
      GetFilteredAlbumData(
        albumData,
        purchasedAlbumDataStrings.current,
        purchasedSongDataStrings.current,
      ),
    );
  }, [albumData, purchasedAlbumData, purchasedSongData]);

  return (
    <>
      <div
        className="container"
        css={css`
          background: #ffffff;
          min-height: 85vh;
        `}
      >
        <br></br>
        <div className="text-dark normal-font-light py-1">
          <h3 className="text-dark normal-font-light no-underline">Account</h3>
        </div>
        <div>
          <h4 className="text-dark normal-font-light no-underline py-1 text-start">
            Account Summary: {userEmail}
          </h4>
        </div>
        <div className="text-dark normal-font-light no-underline py-1 text-start">
          <h4 className="text-dark normal-font-light no-underline py-1 text-start">
            Purchased Music:
          </h4>
          <ul>
            {filteredAlbumData.map((album) => (
              <li>
                {String(album.AlbumName)}
                {album.TrackList.map((song, k) => (
                  <ul key={k}>{String(song.songName)}</ul>
                ))}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}
export default AccountBody;

function GetFilteredAlbumData(
  albumData: AlbumData[],
  purchasedAlbumIDs: String[],
  purchasedSongIDs: String[],
): AlbumData[] {
  return albumData.filter((album) => {
    if (purchasedAlbumIDs.includes(String(album.AlbumID))) {
      return true;
    }

    if (
      album.TrackList.some((song) =>
        purchasedSongIDs.includes(String(song.FilePathName)),
      )
    ) {
      album.TrackList = album.TrackList.filter((song) =>
        purchasedSongIDs.includes(String(song.FilePathName)),
      );
      return true;
    }

    return false;
  });
}

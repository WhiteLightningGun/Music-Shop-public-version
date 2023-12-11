export interface SongData {
  songName: string;
  AlbumName: string;
  Length: string;
  FilePathName: string;
  AlbumPosition: number;
}

export interface AlbumData {
  AlbumName: string;
  ReleaseDate: Date;
  FrontCoverPath: string;
  TrackList: SongData[];
  TrackCount: number;
  kebabCase: string;
}

export interface AlbumDataJson {
  AllAlbums: AlbumData[];
}

const SneedMeSong: SongData = {
  songName: 'Sneed me now!',
  AlbumName: 'Unknown Feels',
  Length: '4:23',
  FilePathName: '/static/audio/Aragainz.mp3',
  AlbumPosition: 1,
};

const HereComesTheSneed: SongData = {
  songName: 'Here comes the sneed (da da da da)',
  AlbumName: 'Unknown Feels',
  Length: '3:53',
  FilePathName: '/static/audio/Aragainz2.mp3',
  AlbumPosition: 2,
};

const PlaceholdAlbums: AlbumData[] = [
  {
    AlbumName: 'Unknown Feels',
    ReleaseDate: new Date('2022-01-16'),
    FrontCoverPath: '/static/images/albumCover1.jpg',
    TrackList: [SneedMeSong, HereComesTheSneed],
    TrackCount: 2,
    kebabCase: 'Unknown-Feels-qxr123',
  },
  {
    AlbumName: 'Black Sabbath',
    ReleaseDate: new Date('1972-04-22'),
    FrontCoverPath: '/static/images/albumCover2.jpg',
    TrackList: [SneedMeSong, HereComesTheSneed],
    TrackCount: 2,
    kebabCase: 'Black-Sabbath-rkd114',
  },
];

export default PlaceholdAlbums;

const wait = async (ms: number): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

export async function getAlbums(): Promise<AlbumData[]> {
  await wait(500);
  return PlaceholdAlbums;
}

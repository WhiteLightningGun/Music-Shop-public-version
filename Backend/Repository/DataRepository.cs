using Backend.Data;
using Microsoft.EntityFrameworkCore;

namespace Backend.Repository
{
    public class DataRepository : IDataRepository
    {
        private DataContext dataContext;

        public DataRepository(DataContext dataContext)
        {
            this.dataContext = dataContext;
        }

        public SongData? GetMusic(string fileGetCode)
        {
            SongData? result = dataContext.songData?.Select(x => x).Where(x => x.FileGetCode == fileGetCode).FirstOrDefault();
            return result;
        }
        public async Task<List<SongData>> GetSongsInAlbum(string albumId)
        {
            return await dataContext.songData!.Select(x => x).Where(x => x.AlbumId == albumId).ToListAsync();
        }

        public async Task DeleteSongEntry(string albumID)
        {
            var song = dataContext.songData!.Select(x => x).Where(x => x.FileGetCode == albumID).FirstOrDefault();
            if (song != null)
            {
                dataContext.songData!.Remove(song);
                await dataContext.SaveChangesAsync();
            }
        }
        public bool AlbumIdExists(string albumId)
        {
            return dataContext.AlbumEntries!.Any(a => a.AlbumId == albumId);
        }

        public async Task<List<AlbumsListEntry>> GetAlbumsList()
        {
            return await dataContext.AlbumEntries!.Select(x => new AlbumsListEntry { AlbumName = x.AlbumName, AlbumId = x.AlbumId }).ToListAsync();
        }

        public async Task<bool> AlterSongEntry(SongPutRequest songPutRequest)
        {
            var song = dataContext.songData!.Select(x => x).Where(x => x.FileGetCode == songPutRequest.SongID).FirstOrDefault();
            if (song == null)
            {
                return false;
            }
            song.songName = songPutRequest.SongName;
            song.Length = songPutRequest.SongLength;
            song.AlbumPosition = songPutRequest.AlbumPosition;
            await dataContext.SaveChangesAsync();
            return true;
        }

        public bool SongIdExists(string songId)
        {
            return dataContext.songData!.Any(s => s.FileGetCode == songId);
        } 

        public string? GetAlbumNameByAlbumID(string albumId)
        {
            return dataContext.AlbumEntries!.Select(x => x).Where(x => x.AlbumId == albumId).FirstOrDefault()!.AlbumName;
        }

        public async Task AddNewSong(SongData songData)
        {
            dataContext.songData!.Add(songData);
            await dataContext.SaveChangesAsync();
        }

        public async Task DeleteSongsInAlbum(string albumId)
        {
            var songsToDelete = dataContext.songData!.Where(s => s.AlbumId == albumId);

            foreach(var song in songsToDelete)
            {
                dataContext.songData!.Remove(song);
            }

            await dataContext.SaveChangesAsync(); 
        }

        public async Task<string> GetAlbumIDFromSong(string songID)
        {
            return (await dataContext.songData!.Select(x => x).Where(x => x.FileGetCode == songID).FirstOrDefaultAsync())!.AlbumId!;
        }

        public List<AlbumJsonModel> GetAlbums(string baseUrl)
        {
            AlbumEntry[] AlbumData = [.. dataContext.AlbumEntries!.Select(x => x)];
            SongData[] allSongs = [.. dataContext.songData!.Select(x => x)];

            List<AlbumJsonModel> albumJsons = [];

            foreach (AlbumEntry thisAlbum in AlbumData)
            {
                var tracksInAlbum = allSongs.Select(x => x).Where(x => x.AlbumId == thisAlbum.AlbumId).ToList();
                List<SongJsonModel> songJsonsForAlbum = [];

                foreach (var track in tracksInAlbum)
                {
                    SongJsonModel songJson = new()
                    {
                        AlbumName = track.AlbumName,
                        AlbumPosition = track.AlbumPosition,
                        songName = track.songName,
                        Length = track.Length,
                        FilePathName = track.FileGetCode,
                    };
                    songJsonsForAlbum.Add(songJson);
                }
                var frontCoverFileName = FindImageInWwwRoot(thisAlbum.AlbumId!);
                frontCoverFileName ??= "default.png";
                albumJsons.Add(
                    new AlbumJsonModel
                    {
                        AlbumName = thisAlbum.AlbumName,
                        ReleaseDate = thisAlbum.ReleaseDate,
                        FrontCoverPath = $"{baseUrl}/images/{frontCoverFileName}",
                        kebabCase = thisAlbum.KebabCaseName,
                        TrackList = songJsonsForAlbum,
                        TrackCount = allSongs.Select(x => x).Where(x => x.AlbumId == thisAlbum.AlbumId).ToList().Count().ToString()
                    });
            }

            return albumJsons;
        }

        private static string FindImageInWwwRoot(string imageName)
        {
            string wwwRootPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "images");
            string[] extensions = new[] { ".png", ".jpg", ".jpeg" };

            foreach (var extension in extensions)
            {
                string fullPath = Path.Combine(wwwRootPath, imageName + extension);
                if (File.Exists(fullPath))
                {
                    return Path.GetFileName(fullPath);
                }
            }

            return null;
        }
    }
}

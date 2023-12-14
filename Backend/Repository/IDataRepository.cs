using Backend.Data;

namespace Backend.Repository
{
    public interface IDataRepository
    {
        public SongData? GetMusic(string fileGetCode);
        public bool AlbumIdExists(string albumId);
        public string? GetAlbumNameByAlbumID(string albumId);
        public Task AddNewSong(SongData songData);
        public Task DeleteSongsInAlbum(string albumId);
        public List<AlbumJsonModel> GetAlbums(string baseUrl);
        public Task<string> GetAlbumIDFromSong(string songID);
        public bool SongIdExists(string songId);
        public Task<bool> AlterSongEntry(SongPutRequest songPutRequest);
        public Task DeleteSongEntry(string albumID);
        public Task<List<SongData>> GetSongsInAlbum(string albumId);
    }

}

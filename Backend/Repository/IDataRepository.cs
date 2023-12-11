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
    }

}

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

        public async Task<string> GetUserEmailFromPaypalOrderID(string orderID)
        {
            var order = await dataContext.PaypalOrders!.Select(x => x).Where(x => x.OrderId == orderID).FirstOrDefaultAsync();
            if (order != null)
            {
                string? userEmail = await dataContext.Users!.Select(x => x).Where(x => x.Id == order.UserId).Select(x => x.Email).FirstOrDefaultAsync();
                return userEmail ?? "";
            }
            else
            {
                return "";
            }
        }

        public async Task<string> GetUserSongsFromPaypalID(string orderID)
        {
            var order = await dataContext.PaypalOrders!.Select(x => x).Where(x => x.OrderId == orderID).FirstOrDefaultAsync();
            if (order is not null)
            {
                var listOfSongIds = order.ProductIds;
            }

            return "thingamajig";
        }

        public async Task<bool> HasUserPurchased(string userId, string songID)
        {
            // get album id associated with songID
            var albumPurchasesCheck = await dataContext.songData!
            .Join(dataContext.UserAlbumPurchases!,
                songData => songData.AlbumId,
                userAlbumPurchases => userAlbumPurchases.AlbumID,
                (songData, userAlbumPurchase) => new { SongData = songData, UserAlbumPurchase = userAlbumPurchase })
            .Where(x => x.SongData.FileGetCode == songID && x.UserAlbumPurchase.UserID == userId)
            .Select(x => x.SongData.AlbumId)
            .FirstOrDefaultAsync();

            var songPurchasesCheck = await dataContext.UserSongPurchases!.Select(x => x).Where(x => x.UserID == userId && x.SongID == songID).FirstOrDefaultAsync();

            if (albumPurchasesCheck != null)
            {
                return true;
            }
            else if (songPurchasesCheck != null)
            {
                return true;
            }
            else
            {
                return false;
            }
        }

        public async Task<List<string>> GetUserAlbums(string userID)
        {
            var userAlbums = await dataContext.UserAlbumPurchases!.Select(x => x).Where(x => x.UserID == userID).ToListAsync();
            List<string> albumIDs = new();
            foreach (var album in userAlbums)
            {
                albumIDs.Add(album.AlbumID!);
            }
            return albumIDs;
        }

        public async Task<List<string>> GetUserSongs(string userID)
        {
            var userSongs = await dataContext.UserSongPurchases!.Select(x => x).Where( x=> x.UserID == userID).ToListAsync();
            List<string> songIDs = new();
            foreach (var song in userSongs)
            {
                songIDs.Add(song.SongID!);
            }
            return songIDs;
        }

        public async Task<string> GetSongOrAlbumNameFromId(string id)
        {
            var songMatch = await dataContext.songData!.Select(x => x).Where(x => x.FileGetCode == id).FirstOrDefaultAsync();
            var albumMatch = await dataContext.AlbumEntries!.Select(x => x).Where(x => x.AlbumId == id).FirstOrDefaultAsync();

            if (songMatch != null)
            {
                return songMatch.songName!;
            }
            else if (albumMatch != null)
            {
                return albumMatch.AlbumName!;
            }
            else
            {
                return "";
            }
        }

        /// <summary>
        /// Checks if the cart items are valid, i.e. the price of the song/album matches the price in the database and ensures the id exists
        /// </summary>
        /// <param name="cartItems"></param>
        /// <returns></returns>
        public async Task<bool> CheckCartIntegrity(CartItem[] cartItems, string userID)
        {
            foreach (var cartItem in cartItems)
            {
                var songMatch = await dataContext.songData!.Select(x => x).Where(x => x.FileGetCode == cartItem.productID).FirstOrDefaultAsync();
                var albumMatch = await dataContext.AlbumEntries!.Select(x => x).Where(x => x.AlbumId == cartItem.productID).FirstOrDefaultAsync();

                if (songMatch != null && cartItem.value != null)
                {
                    if (songMatch.songPrice != decimal.Parse(cartItem.value))
                    {
                        return false;
                    }
                }
                else if (albumMatch != null && cartItem.value != null)
                {
                    //check if album price for this user matches the cartItem value
                    decimal albumPriceForUser = await GetAlbumPriceForUser(userID, cartItem.productID!);
                    if (albumPriceForUser != decimal.Parse(cartItem.value))
                    {
                        return false;
                    }
                }
                else
                {
                    return false;
                }   
            }
            return true;
        }

        private async Task<decimal> GetAlbumPriceForUser(string userID, string albumID)
        {
            // get list of user Songs already purchased and filter them by getting only the songs associated with a given AlbumID
            var userSongsPurchasedFromThisAlbum = await (from a in dataContext.UserSongPurchases
            join b in dataContext.songData! on a.SongID equals b.FileGetCode
            where b.AlbumId == albumID && a.UserID == userID
            select new { a.SongID, a.PricePaid, b.AlbumId }).ToListAsync();
            decimal pricePaidSoFar = 0.00m;

            if (userSongsPurchasedFromThisAlbum is not null)
            {
                pricePaidSoFar = userSongsPurchasedFromThisAlbum.Select(x => x.PricePaid).Sum();
            }

            Console.WriteLine("Price paid so far {0}", pricePaidSoFar);
            var album = await dataContext.AlbumEntries!.Select(x => x).Where(x => x.AlbumId == albumID).FirstOrDefaultAsync();
            return album!.albumPrice - pricePaidSoFar;
        }

        public async Task CompletePaypalOrder(string orderID)
        {
            var order = await dataContext.PaypalOrders!.Select(x => x).Where(x => x.OrderId == orderID).FirstOrDefaultAsync();
            if (order != null)
            {
                var orderProductIds = order.ProductIds;
                order.OrderCompleted = true;
                await dataContext.SaveChangesAsync();
                await UpdateUserPurchases(order.UserId!, orderProductIds!);
            }
        }

        public async Task UpdateUserPurchases(string userID, List<string> productIDs)
        {
            var user = await dataContext.Users!.Select(x => x).Where(x => x.Id == userID).FirstOrDefaultAsync();
            if (user != null)
            {
                foreach (var productID in productIDs)
                {
                    if(AlbumIdExists(productID))
                    {
                        var albumPurchase = new UserAlbumPurchases(userID, productID, 1.00m)
                        {
                            UserID = userID,
                            UserEmail = $"{user!.Email}", // Set the user email property
                            AlbumID = productID,
                            SongName = "N/A", // Set the name property
                            PricePaid = (decimal)1.00,
                            Currency = "GBP", // Set the currency property
                            TimeOfPurchase = DateTime.Now // Set the time of purchase property
                        };

                        dataContext.UserAlbumPurchases!.Add(albumPurchase);
                    }
                    else if (SongIdExists(productID))
                    {
                        var songPurchase = new UserSongPurchases(userID, productID, 1.00m)
                        {
                            UserID = userID,
                            UserEmail = $"{user!.Email}", // Set the user email property
                            SongID = productID,
                            SongName = "N/A", // Set the song name property
                            PricePaid = (decimal)1.00,
                            Currency = "GBP", // Set the currency property
                            TimeOfPurchase = DateTime.Now // Set the time of purchase property
                        };

                        dataContext.UserSongPurchases!.Add(songPurchase);
                    }
                }
            }
            await dataContext.SaveChangesAsync();
        }
    
        public async Task<bool> AddPaypalOrder(string orderID, string userID, List<string> productIDs)
        {
            PaypalOrder paypalOrder = new PaypalOrder
            {
                OrderId = orderID,
                OrderCompleted = false,
                UserId = userID,
                ProductIds = new List<string?>(),
            };

            foreach (var productID in productIDs)
            {
                paypalOrder.ProductIds.Add(productID);
            }

            dataContext.PaypalOrders!.Add(paypalOrder);
            await dataContext.SaveChangesAsync();
            return true;
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
            song.songPrice = songPutRequest.SongPrice;
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
                        SongPrice = track.songPrice,
                        albumID = track.AlbumId
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
                        TrackCount = allSongs.Select(x => x).Where(x => x.AlbumId == thisAlbum.AlbumId).ToList().Count().ToString(),
                        AlbumPrice = thisAlbum.albumPrice,
                        AlbumID = thisAlbum.AlbumId
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

﻿using System.ComponentModel.DataAnnotations;

namespace Backend.Data
{
    public class SongData
    {
        [Required]
        public int id { get; set; } // Internal DB id, required by default, increments automatically

        [Required]
        [StringLength(100)]
        public string? songName { get; set; }

        [Required]
        [StringLength(100)]
        public required string AlbumName { get; set; }

        [Required]
        public required string AlbumId { get; set; } // Unique ID associated with parent album

        [Required]
        public required string Length { get; set; } // Song length

        [Required]
        public required string FileGetCode { get; set; } // Unique ID, used for identifying song on get requests and cross referencing with user account list of purchased songs, will also be used to name song on harddrive

        public int AlbumPosition { get; set; }

        [Required]
        public string? KebabCaseName { get; set; }
        public decimal songPrice { get; set; } // Price of album, in GBP
    }
}


/*

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

*/ 
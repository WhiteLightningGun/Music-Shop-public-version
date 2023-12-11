using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Backend.Migrations
{
    /// <inheritdoc />
    public partial class _2ndMigration : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "AlbumEntries",
                columns: table => new
                {
                    id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    AlbumName = table.Column<string>(type: "TEXT", nullable: false),
                    ReleaseDate = table.Column<DateTime>(type: "TEXT", nullable: false),
                    AlbumId = table.Column<string>(type: "TEXT", nullable: false),
                    KebabCaseName = table.Column<string>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AlbumEntries", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "songData",
                columns: table => new
                {
                    id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    songName = table.Column<string>(type: "TEXT", maxLength: 100, nullable: false),
                    AlbumName = table.Column<string>(type: "TEXT", maxLength: 100, nullable: false),
                    AlbumId = table.Column<string>(type: "TEXT", nullable: false),
                    Length = table.Column<string>(type: "TEXT", nullable: false),
                    FileGetCode = table.Column<string>(type: "TEXT", nullable: false),
                    AlbumPosition = table.Column<int>(type: "INTEGER", nullable: false),
                    KebabCaseName = table.Column<string>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_songData", x => x.id);
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "AlbumEntries");

            migrationBuilder.DropTable(
                name: "songData");
        }
    }
}

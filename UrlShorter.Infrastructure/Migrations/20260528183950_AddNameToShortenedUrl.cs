using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace UrlShorter.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddNameToShortenedUrl : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Name",
                table: "ShortenedUrls",
                type: "character varying(30)",
                maxLength: 30,
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Name",
                table: "ShortenedUrls");
        }
    }
}

using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace UrlShorter.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AlterShortCodeIndexToFiltered : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_ShortenedUrls_ShortCode",
                table: "ShortenedUrls");

            migrationBuilder.CreateIndex(
                name: "IX_ShortenedUrls_ShortCode",
                table: "ShortenedUrls",
                column: "ShortCode",
                unique: true,
                filter: "\"IsActive\" = true");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_ShortenedUrls_ShortCode",
                table: "ShortenedUrls");

            migrationBuilder.CreateIndex(
                name: "IX_ShortenedUrls_ShortCode",
                table: "ShortenedUrls",
                column: "ShortCode",
                unique: true);
        }
    }
}

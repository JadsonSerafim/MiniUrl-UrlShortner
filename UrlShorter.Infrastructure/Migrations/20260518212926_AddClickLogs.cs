using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace UrlShorter.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddClickLogs : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "ClickLogs",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    ShortCode = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false),
                    IpAddress = table.Column<string>(type: "character varying(45)", maxLength: 45, nullable: false),
                    UserAgent = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    IsActive = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ClickLogs", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_ClickLogs_CreatedAt",
                table: "ClickLogs",
                column: "CreatedAt");

            migrationBuilder.CreateIndex(
                name: "IX_ClickLogs_ShortCode",
                table: "ClickLogs",
                column: "ShortCode");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ClickLogs");
        }
    }
}

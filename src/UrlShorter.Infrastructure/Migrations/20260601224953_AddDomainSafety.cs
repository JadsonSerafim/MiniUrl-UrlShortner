using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace UrlShorter.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddDomainSafety : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "DomainSafeties",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    DomainName = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: false),
                    DomainCreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    LastCheckedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    IsActive = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DomainSafeties", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_DomainSafeties_DomainName",
                table: "DomainSafeties",
                column: "DomainName",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "DomainSafeties");
        }
    }
}

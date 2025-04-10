using EmpresaFornecedor.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EmpresaFornecedor.Infrastructure.Context
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions options) : base(options) { }

        public DbSet<Empresa> Empresas { get; set; }
        public DbSet<Fornecedor> Fornecedores { get; set; }
        public DbSet<FornecedorEmpresa> FornecedorEmpresa { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Configuração FornecedorEmpresa (chave composta)
            modelBuilder.Entity<FornecedorEmpresa>()
                .HasKey(fe => new { fe.EmpresaId, fe.FornecedorId });

            modelBuilder.Entity<FornecedorEmpresa>()
                .HasOne(fe => fe.Empresa)
                .WithMany(e => e.Fornecedores)
                .HasForeignKey(fe => fe.EmpresaId);

            modelBuilder.Entity<FornecedorEmpresa>()
                .HasOne(fe => fe.Fornecedor)
                .WithMany(f => f.Empresas)
                .HasForeignKey(fe => fe.FornecedorId);

            // Índices únicos
            modelBuilder.Entity<Empresa>()
                .HasIndex(e => e.Cnpj)
                .IsUnique();

            modelBuilder.Entity<Fornecedor>()
                .HasIndex(f => f.Documento)
                .IsUnique();

            modelBuilder.Entity<Empresa>()
                .Property(e => e.Id)
                .ValueGeneratedOnAdd();

            modelBuilder.Entity<Fornecedor>()
                .Property(f => f.Id)
                .ValueGeneratedOnAdd();
        }
    }
}

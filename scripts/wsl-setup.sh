#!/usr/bin/env bash

# ==============================================================================
# WSL Debian Setup & Prisma Database Migration Script
# ==============================================================================
# Script ini digunakan untuk mengkonfigurasi lingkungan WSL Debian, mengunduh
# dependensi OS (OpenSSL, SQLite3, Node.js), serta menjalankan migrasi database
# Prisma dan seeder otomatis.
# ==============================================================================

set -e

GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}=== [1/5] Memeriksa & Menginstal Dependensi Sistem (WSL Debian) ===${NC}"
if command -v apt-get &> /dev/null; then
    echo -e "${YELLOW}Mengunduh update paket Debian & menginstal openssl, sqlite3, curl, ca-certificates...${NC}"
    sudo apt-get update -qq
    sudo apt-get install -y -qq openssl sqlite3 curl ca-certificates build-essential
else
    echo -e "${YELLOW}Bukan lingkungan apt (Debian). Melewati tahap apt-get.${NC}"
fi

echo -e "\n${BLUE}=== [2/5] Memeriksa Instalasi Node.js & npm ===${NC}"
if ! command -v node &> /dev/null; then
    echo -e "${RED}Node.js belum terinstal di WSL Debian!${NC}"
    echo -e "${YELLOW}Mengunduh Node.js LTS via NodeSource...${NC}"
    curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
    sudo apt-get install -y nodejs
fi

NODE_VER=$(node -v)
NPM_VER=$(npm -v)
echo -e "${GREEN}✓ Node.js versi: ${NODE_VER}${NC}"
echo -e "${GREEN}✓ npm versi: ${NPM_VER}${NC}"

echo -e "\n${BLUE}=== [3/5] Menginstal Dependensi Project & Prisma Engine ===${NC}"
npm install

echo -e "\n${BLUE}=== [4/5] Generasi Prisma Client untuk Linux/Debian ===${NC}"
npx prisma generate --schema=backend/prisma/schema.prisma

echo -e "\n${BLUE}=== [5/5] Migrasi Database & Seeding Data ===${NC}"
npx prisma db push --schema=backend/prisma/schema.prisma
npm run db:seed --workspace=backend

echo -e "\n${GREEN}======================================================================${NC}"
echo -e "${GREEN}🎉 Migrasi Prisma & Konfigurasi WSL Debian Berhasil Diselesaikan!${NC}"
echo -e "${GREEN}======================================================================${NC}"
echo -e "Untuk menjalankan server backend NestJS:"
echo -e "  npm run dev:backend"
echo -e "Untuk membuka Prisma Studio:"
echo -e "  npm run db:studio"
echo -e "======================================================================\n"

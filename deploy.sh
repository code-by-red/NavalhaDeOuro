#!/bin/bash

# Script de deploy para Vercel
echo "Iniciando deploy do NavalhaDeOuro..."

# Inicializa o repositório Git se ainda não existir
if [ ! -d ".git" ]; then
    git init
    echo "Repositório Git inicializado"
fi

# Adiciona todos os arquivos
git add .
echo "Arquivos adicionados ao Git"

# Commit inicial
git commit -m "Deploy: Site NavalhaDeOuro pronto para Vercel"
echo "Commit realizado"

# Adiciona remote origin
git remote add origin https://github.com/code-by-red/NavalhaDeOuro.git
git branch -M main

# Push para o GitHub
git push -u origin main
echo "Deploy concluído! Site pronto para Vercel."

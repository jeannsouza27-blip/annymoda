#!/bin/sh
set -e

echo "Aplicando migrations do Prisma..."
node ./node_modules/prisma/build/index.js migrate deploy

echo "Iniciando servidor..."
exec node server.js

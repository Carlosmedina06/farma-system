#!/bin/bash
# Publica @carlosmedina06/farma-ui con npm (Trusted Publishing por OIDC, sin token)
# si la versión local todavía no está en npm, y crea el tag con changesets.
set -euo pipefail

cd "$(dirname "$0")/../packages/ui"
NAME="$(node -p "require('./package.json').name")"
VERSION="$(node -p "require('./package.json').version")"

if npm view "$NAME@$VERSION" version >/dev/null 2>&1; then
  echo "$NAME@$VERSION ya está publicado"
  exit 0
fi

pnpm --dir ../.. registry:build
npm publish --provenance --access public
cd ../..
# Imprime "New tag: ..." para que changesets/action pushee el tag y cree el release
pnpm changeset tag

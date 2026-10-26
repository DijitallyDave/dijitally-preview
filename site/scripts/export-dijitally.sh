#!/usr/bin/env bash
# Builds this homepage for www.dijitally.com and copies it into a checkout of the
# Dijitally/dijitally-website repo:
#
#   site/scripts/export-dijitally.sh /path/to/dijitally-website
#
# Writes the repo's index.html (the homepage) and replaces its home/ folder, which holds
# everything the page loads (Next.js files, fonts, images). Nothing else in the repo is
# touched. Builds in a temporary copy so a running dev server's .next folder is left alone.
set -euo pipefail

DEST="${1:?usage: export-dijitally.sh /path/to/dijitally-website}"
SITE="$(cd "$(dirname "$0")/.." && pwd)"
[ -f "$DEST/vercel.json" ] || { echo "!! $DEST does not look like the dijitally-website repo"; exit 1; }
export PATH="$HOME/.local/node/bin:$PATH"

TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT
rsync -a --exclude node_modules --exclude .next --exclude out "$SITE/" "$TMP/"
ln -s "$SITE/node_modules" "$TMP/node_modules"
# Route handlers can't be statically exported; the lightbox posts to the site's /api/lead.
rm -rf "$TMP/app/api"
(cd "$TMP" && SITE_TARGET=dijitally npx next build)

OUT="$TMP/out"
rm -rf "$DEST/home"
mkdir -p "$DEST/home"
cp "$OUT/index.html" "$DEST/index.html"
# Favicons are linked from the site root by Next's metadata.
cp "$OUT/icon.svg" "$OUT/apple-icon.png" "$DEST/"
cp -R "$OUT/_next" "$DEST/home/_next"
# Only the public files the page actually loads, so unused originals don't ship.
(cd "$OUT" && find . -type f ! -path './_next/*' ! -name '*.html' ! -name '*.txt' \
    ! -name icon.svg ! -name apple-icon.png ! -name .DS_Store | sed 's|^\./||') |
while read -r f; do
  if grep -rqF "/home/$f" "$OUT/index.html" "$OUT/_next/static"; then
    mkdir -p "$DEST/home/$(dirname "$f")"
    cp "$OUT/$f" "$DEST/home/$f"
  fi
done
echo "Exported to $DEST/index.html and $DEST/home/ ($(du -sh "$DEST/home" | cut -f1))"

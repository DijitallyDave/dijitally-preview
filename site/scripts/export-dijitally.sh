#!/usr/bin/env bash
# Builds this homepage for www.dijitally.com and copies it into a checkout of the
# Dijitally/dijitally-website repo:
#
#   site/scripts/export-dijitally.sh /path/to/dijitally-website
#
# Writes the repo's index.html (the homepage), the case studies this site has (work/<slug>/
# index.html, in place of the ones the repo would build from pages/work-<slug>.md, which are
# set aside as pages/_work-<slug>.md so its build skips them), and replaces its home/ folder,
# which holds everything those pages load (Next.js files, fonts, images). Nothing else in the
# repo is touched. Builds in a temporary copy so a running dev server's .next folder is left alone.
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
# With each page, the data file Next.js fetches to open it without a full reload (the
# homepage's transition into a case study, and back).
cp "$OUT/index.txt" "$DEST/index.txt"
# The case studies, at the repo's own /work/<slug>/index.html. Its build would overwrite them
# from pages/work-<slug>.md, so those are renamed with a leading "_", which it skips (renaming
# them back restores the old pages).
PAGES=("$OUT/index.html")
for f in "$OUT"/work/*.html; do
  slug="$(basename "$f" .html)"
  mkdir -p "$DEST/work/$slug"
  cp "$f" "$DEST/work/$slug/index.html"
  cp "$OUT/work/$slug.txt" "$DEST/work/$slug.txt"
  PAGES+=("$f")
  if [ -f "$DEST/pages/work-$slug.md" ]; then
    git -C "$DEST" mv "pages/work-$slug.md" "pages/_work-$slug.md" 2>/dev/null ||
      mv "$DEST/pages/work-$slug.md" "$DEST/pages/_work-$slug.md"
  fi
done
# Favicons are linked from the site root by Next's metadata.
cp "$OUT/icon.svg" "$OUT/apple-icon.png" "$DEST/"
cp -R "$OUT/_next" "$DEST/home/_next"
# Only the public files the pages actually load, so unused originals don't ship. A name with
# spaces in it is linked URL-encoded.
(cd "$OUT" && find . -type f ! -path './_next/*' ! -name '*.html' ! -name '*.txt' \
    ! -name icon.svg ! -name apple-icon.png ! -name .DS_Store | sed 's|^\./||') |
while read -r f; do
  enc="$(python3 -c 'import sys, urllib.parse; print(urllib.parse.quote(sys.argv[1]))' "$f")"
  if grep -rqF -e "/home/$f" -e "/home/$enc" "${PAGES[@]}" "$OUT/_next/static"; then
    mkdir -p "$DEST/home/$(dirname "$f")"
    cp "$OUT/$f" "$DEST/home/$f"
  fi
done
echo "Exported to $DEST/index.html, $((${#PAGES[@]} - 1)) case studies in $DEST/work/ and $DEST/home/ ($(du -sh "$DEST/home" | cut -f1))"

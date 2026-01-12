#!/usr/bin/env bash

set -euo pipefail

# ==========================
# Configuration
# ==========================

FORMATS=("jpg" "png")
SIZES=(128 240 480 960 1280 1920 3840)
BASE_VIEWBOX_HEIGHT=480
BASE_DENSITY=96

INPUT_DIR="./svg"

# ==========================
# Traitement
# ==========================

for svg in "$INPUT_DIR"/*.svg; do
    # Ignore si aucun fichier svg
    [ -e "$svg" ] || continue

    filename="$(basename "$svg")"
    name="${filename%.svg}"

    # Détermination de la couleur d'arrière-plan
    # - "white" dans le nom → fond noir
    # - "black" dans le nom → fond blanc
    BG_COLOR=""
    if [[ "$filename" == *white* ]]; then
        BG_COLOR="#000000"
    elif [[ "$filename" == *black* ]]; then
        BG_COLOR="#ffffff"
    fi

    for format in "${FORMATS[@]}"; do
        for size in "${SIZES[@]}"; do
            output_dir="./${format}/${size}"
            mkdir -p "$output_dir"

            output_file="${output_dir}/${name}.${format}"

            scale_factor=$(awk "BEGIN { printf \"%.2f\", ${size}/${BASE_VIEWBOX_HEIGHT} }")
            density=$(awk "BEGIN { printf \"%d\", ${BASE_DENSITY}*${scale_factor} }")

            if [[ "$format" == "png" ]]; then
                # PNG → fond transparent
                convert \
                    -density "$density" \
                    -background none \
                    -define svg:height="$size" \
                    "$svg" \
                    "$output_file"
            else
                # JPG → fond selon le nom du fichier
                # Si aucune couleur détectée, blanc par défaut
                convert \
                    -density "$density" \
                    -background "${BG_COLOR:-#ffffff}" \
                    -define svg:height="$size" \
                    -flatten \
                    "$svg" \
                    "$output_file"
            fi

            echo "✔ Généré : $output_file"
        done
    done
done
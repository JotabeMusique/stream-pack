#!/usr/bin/env bash

# Directory where the script is located
BASE_DIR="$(cd "$(dirname "$0")" && pwd)"

# Output file
OUTFILE="$BASE_DIR/playlist.js"

mp3_files=()

# Recursively scan directories without using external tools
scan_dir() {
    local dir="$1"
    local item

    # Enable nullglob so *.mp3 expands to empty if no matches
    shopt -s nullglob

    # Add any .mp3 files in this directory
    for item in "$dir"/*.mp3; do
        # Only add if file exists
        [ -f "$item" ] && mp3_files+=("${item#$BASE_DIR/}")
    done

    # Process subdirectories
    for item in "$dir"/*; do
        if [ -d "$item" ]; then
            scan_dir "$item"
        fi
    done
}

# Start scanning from directories next to script
for d in "$BASE_DIR"/*; do
    [ -d "$d" ] && scan_dir "$d"
done

# Write JSON file
{
    printf "window.PLAYLIST = [\n"
    for ((i=0; i<${#mp3_files[@]}; i++)); do
        file="${mp3_files[$i]}"
        # Escape double quotes in filenames safely
        esc="${file//\"/\\\"}"
        if [ $i -lt $(( ${#mp3_files[@]} - 1 )) ]; then
            printf "  \"%s\",\n" "./$esc"
        else
            printf "  \"%s\"\n" "./$esc"
        fi
    done
    printf "]\n"
} > "$OUTFILE"
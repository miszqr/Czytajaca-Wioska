# Instrukcje dla agentów

## Ocena sceny 3D w przeglądarce Work

Potwierdzone 2026-10-23: dostępna przeglądarka kontrolna zgłasza `WebGL not supported`. Nie można w niej ocenić wyglądu ani wydajności sceny 3D Czytającej Wioski.

Na wyraźną prośbę użytkownika:

- Nie ponawiaj prób podglądu ani oceny sceny 3D w tej przeglądarce. Nie uruchamiaj jej tylko po to, aby ponownie sprawdzić znany brak WebGL; oszczędzaj czas i tokeny.
- Weryfikuj zmiany odpowiednimi testami logiki, UI i Babylon NullEngine, kompilacją oraz testem startu produkcyjnego. Przy publikacji sprawdzaj wdrożenie i pliki przez HTTP.
- Nie przedstawiaj testów NullEngine jako wizualnej weryfikacji renderingu na GPU. Korzystaj z zrzutów i uwag użytkownika przy poprawkach wyglądu.
- Wróć do prób oceny 3D w przeglądarce dopiero na wyraźne polecenie użytkownika lub po niezależnym potwierdzeniu zmiany środowiska na obsługujące WebGL. Sam nowy czat lub kolejna zmiana gry nie uzasadnia ponownej próby.
- Nie powtarzaj diagnozy braku WebGL w każdym podsumowaniu; wspomnij o niej tylko wtedy, gdy jest istotna dla wyniku zadania.

# Agent instructions: binary assets and GitHub

## Avoid filling the AI context with binary data

**Never** print image bytes, Base64 of an image, data URLs, or chunked binary payloads into the model conversation. Do not use `cat`, `base64`, GitHub `create_blob`, or text-only connector calls to shuttle a PNG/JPG file through model arguments. Avoid uploading files in chunks through the chat.

For images created or modified in the repository, use `scripts/publish_binary.py`. It reads files locally and moves bytes directly via Git or HTTPS, returning only the status, SHA-256, file size, and commit SHA.

```bash
# Check transport prerequisites without displaying credentials:
python3 scripts/publish_binary.py --check

# Preferred: authenticated Git remote. Commits only the selected image.
python3 scripts/publish_binary.py docs/references/example.png --method git

# Alternative: GitHub Contents API, if GH_TOKEN/GITHUB_TOKEN or 'gh auth' is available.
python3 scripts/publish_binary.py docs/references/example.png --method api --branch main
```

The repository's default branch is **main**, not `master`. With `--method git`, the current checkout branch is used unless `--branch` is specified. Prefer a working feature branch if the task calls for one. With `--method api`, the default branch is `main` and each upload creates its own remote commit. After API upload, sync the local checkout before further pushes to avoid divergent histories.

**Authentication limitation:** installing the GitHub ChatGPT connector does not automatically provide Git credentials or a GitHub API token to the Work terminal. The script cannot bypass this. If both push credentials and API token are missing, stop and report the missing authentication; do not fall back to Base64 through tool arguments. Never put tokens in repository files, shell commands visible to the user, or logs.

**Note:** Git transport can commit the image locally even when push fails. If this happens, report the local commit SHA and configure credentials before retrying the push. Don't create duplicate commits without inspecting history.

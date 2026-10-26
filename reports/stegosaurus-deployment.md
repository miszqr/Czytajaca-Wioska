# Wdrożenie sekretu stegozaura — 2026-10-24

Po wyraźnej zgodzie użytkownika wysłano źródła i opublikowano nową wersję gry.

- Gra: https://miszqr.github.io/Czytajaca-Wioska/
- Źródła: `feat/stegosaurus-secret`, commit `0b7a622a4d586f4b69e374cb29bf353d6d5b3010`.
- Wydanie: `gh-pages`, commit `bb4327b166449ed86ea18f52694028b06f231c7c`.
- Poprzednie wydanie: `82cb315e914cddd66dafbdf39cf19aea2ab9689d` (zachowane w historii).
- GitHub Pages: https://github.com/miszqr/Czytajaca-Wioska/actions/runs/40136055040 — completed / success.
- Drzewo źródeł: `e10789bfdb4c91c6fcef1b7686587bb8a59019ab`.
- Drzewo wydania: `462c54e0492bb97a8d0b68ec3714c10ff05f296d`.

Zwykły git push nie miał uwierzytelnienia. Wysyłkę wykonano przez połączone konto GitHub; commit źródłowy ma inny identyfikator niż lokalny `fca852c`, lecz identyczne drzewo plików. Oryginał zachowano lokalnie na `local/stegosaurus-before-upload`.

Zweryfikowano zgodność wszystkich 57 plików wydania z lokalnym artefaktem oraz zgodność 56 publicznych plików przez HTTPS (wszystkie poza znacznikiem `.nojekyll`): 56/56 zgodnych sum SHA-256. Publiczny `release.json` wskazuje powyższy commit źródłowy.

93 testy, kompilacja i test startu produkcyjnego przeszły przed publikacją; szczegóły w `reports/stegosaurus-secret.md`. Nie zmieniano main ani formatu zapisu. Odbiór wizualny modelu i animacji na GPU pozostaje według `docs/ACCEPTANCE.md`; nie powtarzano prób w przeglądarce bez WebGL.

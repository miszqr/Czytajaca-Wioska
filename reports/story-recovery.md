# Zapis po przerwanym połączeniu — 2026-10-19

Gałąź GitHub: `feat/new-home-story`. Etapy P0–P2 były gotowe i zapisane lokalnie; nie implementowano ich ponownie. Zapisano również poprzedzający je punkt kontrolny. Dokumentacja, TODO oraz raporty etapów były już w commicie P2.

Terminal nie miał uwierzytelnienia do `git push`. Zapis przez połączone konto GitHub utworzył nowe identyfikatory commitów; zachowano kolejność zmian. Oryginalna historia lokalna pozostaje na `local/story-before-github-recovery`.

| Zakres | Oryginalny lokalny commit | Commit na GitHubie |
| --- | --- | --- |
| Punkt kontrolny konfiguracji | `60a1b545ebda0b58a7e78fd4bfbd51d0c7a5f6b7` | `be844b94cd5ff40c14eed8e71494f602447bd186` |
| P0 | `66368c6ff99cfcfaa73aadc6df2a60ab28a6443a` | `2bfe58204abfa0b654a3020f26cbce9f0c250b6b` |
| P1 | `06101b4455c386fac428fe138a939a2a56064f25` | `f371cd0051aaf172e3abd5494e57267a5fe76102` |
| P2 i dokumentacja | `ab30609ba124a5c71644e1228b2f048868c3771f` | `17f7e490168b9170ec270b7767f71800ce37266a` |

Porównanie lokalnego P2 z pobraną gałęzią GitHub wykazało jedną różnicę: brak `docs/references/fela-concept.png`. Cały kod, treści i dokumentacja P0–P2 są identyczne. Przesyłanie tego pliku PNG jako jednego dużego żądania zostało przerwane, dlatego kolejny commit zawiera cały oryginał w częściach Base64, manifest oraz `scripts/restore-fela-reference.py`. To bezstratny zapis załącznika, a nie zmieniony obraz. Po odtworzeniu SHA-256 wynosi `32d51083e92eff286c1912979ca466ea9ccc64826b65bfd057b91a437914fb19`, a obiekt Git ma SHA `a9df06d02a1c3c91d31f3011d8ca7747c54e90ec`.

Ponowne `npm run check`: **34 testy w 8 plikach, walidacja treści, TypeScript oraz build Vite — OK**. Log: [story-recovery-check.txt](story-recovery-check.txt). Ostrzeżenie npm o zmiennej środowiskowej `http-proxy` nie przerwało sprawdzenia.

Do odbioru pozostają wygląd i wydajność na GPU, dotyk na Pixelu 8 i fizyczny pad 8BitDo. NullEngine i jsdom nie zastępują tych prób. Modele i animacje są proceduralnymi prototypami. Lista odbioru: `docs/ACCEPTANCE.md`.

Nie scalano gałęzi z `main` i nie wdrażano nowej wersji na GitHub Pages.

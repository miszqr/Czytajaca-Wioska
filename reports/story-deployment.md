# Wdrożenie „Nowy dom Kitka” P0–P2

2026-10-19, po wyraźnym poleceniu użytkownika „wdrażaj”.

- Gra: https://miszqr.github.io/Czytajaca-Wioska/
- Źródła: `feat/new-home-story`, commit `332908945abcb7923c67209489652e0f9c356887`.
- Wydanie: `gh-pages`, commit `25bc2796ad0a044bb2aa8db67ffe36ba37e99c60`.
- Poprzednie wydanie, zachowane w historii: `80ba87c5a76d5b18d6d937afe1939523c8f06423`.
- GitHub Pages: https://github.com/miszqr/Czytajaca-Wioska/actions/runs/39317513896 — zakończone powodzeniem.

`npm run check`: 34 testy w 8 plikach, walidacja treści, TypeScript i build Vite zakończone powodzeniem. Log: [story-deployment-check.txt](story-deployment-check.txt).

Konfiguracja Vite dzieli zależności na mniejsze pakiety, aby umożliwić przesłanie wydania przez połączenie GitHub. Największy wynikowy plik JavaScript ma około 203 kB. Wydanie zawiera 51 plików, w tym wszystkie pliki `content/`, `.nojekyll` i `release.json` wskazujący commit źródłowy. Drzewo Git wydania `a4350894a679d8c351799ddd1a840467ae5081a8` jest identyczne z lokalnym artefaktem produkcyjnym.

Nie scalano źródeł do `main`. Nie zmieniano formatu zapisu gry podczas wdrożenia. Referencyjna ilustracja Feli nie jest zależnością działającej gry.

Pozostaje ręczny odbiór obrazu na GPU, wydajności i dotyku na Pixelu 8 oraz fizycznego pada 8BitDo. Testy NullEngine/jsdom i sprawdzenie plików HTTP nie zastępują tego odbioru.

# Poprawka startu produkcyjnego — 2026-10-19

Zgłoszenie: `Cannot read properties of undefined (reading 'NoneLogLevel')` w `runtime-Bk9R_QYH.js:1:16410` po wdrożeniu P0–P2.

## Przyczyna i poprawka

Commit `3329089` wprowadził podział zależności na pliki o docelowym rozmiarze 300 kB. Zmieniło to kolejność wykonania modułów Babylon.js: `Tools` odczytywał `Logger.NoneLogLevel` przed inicjalizacją `Logger`. Błąd odtworzono zarówno w publicznej przeglądarce, jak i przez uruchomienie produkcyjnego entry pointu w jsdom — identyczny plik i pozycja błędu.

Włączono `build.rolldownOptions.output.strictExecutionOrder: true`, zachowując podział plików potrzebny do przesyłania wydania. Opcja zachowuje kolejność inicjalizacji mimo podziału na chunki, zgodnie z [dokumentacją Rolldown](https://rolldown.rs/reference/OutputOptions.codeSplitting).

Dodano `scripts/verify-build.mjs` oraz `npm run test:build` do `npm run check`. Test ładuje rzeczywisty entry point i zależne pliki z `dist/`, bez mockowania silnika. Weryfikuje inicjalizację modułów, pierwszy render React i rozpoczęcie ładowania manifestu. Pobieranie treści jest zatrzymane, więc test nie uruchamia WebGL.

## Weryfikacja

- Stary build: nowy test odtwarza `NoneLogLevel` w `runtime-Bk9R_QYH.js:1:16410`.
- Poprawiony build: test startu przechodzi.
- 34 testy w 8 plikach przechodzą.
- Walidacja treści, TypeScript i build produkcyjny przechodzą.
- Testy jsdom i NullEngine nie potwierdzają wyglądu ani wydajności GPU.

Nie zmieniono fabuły, treści, mechaniki ani formatu zapisu. Poprawka kontynuuje wcześniej zatwierdzone wdrożenie GitHub Pages na gałęzi `gh-pages`.

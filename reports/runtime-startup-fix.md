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

## Wdrożenie i kontrola publicznej wersji — 2026-10-20

- Poprawka źródeł: `858a47c36f1a2dcd71c1e50d6db0b4679e82297b`, gałąź `feat/new-home-story`.
- Wydanie: `702ee4cd8f302646515f7e6ec441f53bb7aef4e5`, gałąź `gh-pages`.
- [GitHub Pages run 39321488138](https://github.com/miszqr/Czytajaca-Wioska/actions/runs/39321488138): `completed / success`.
- Publiczny `release.json` wskazuje poprawkę `858a47c`; wszystkie 51 plików pobranych przez HTTP jest identycznych z przetestowanym buildem (porównanie SHA obiektów Git).
- W publicznej przeglądarce kod przechodzi inicjalizację modułów i renderuje interfejs React; błąd `NoneLogLevel` nie występuje.
- Ta przeglądarka testowa zgłasza `WebGL not supported`, więc nie potwierdzono w niej renderowania świata 3D. To ograniczenie środowiska odbioru, zgodne z wcześniejszą weryfikacją, a nie ponowne wystąpienie błędu inicjalizacji modułów.

Gra pozostaje dostępna pod https://miszqr.github.io/Czytajaca-Wioska/.

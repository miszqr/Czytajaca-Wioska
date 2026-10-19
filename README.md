# Czytająca Wioska — Nowy dom Kitka

Przytulna przygodowa gra 3D po polsku. Kitek poznaje sąsiadów, czyta listy i urządza nowy dom. Krótkie zdania prowadzą do działań w świecie: rozmów, odwiedzin, przenoszenia rzeczy. Nie ma quizów, sylab, punktów za czytanie ani przegrywania.

**Gałąź robocza:** `feat/new-home-story`. Nowa specyfikacja z 2026-10-19 jest w [docs/WORK_BRIEF.md](docs/WORK_BRIEF.md). Wersja fabularna nie została opublikowana; GitHub Pages pozostaje przy poprzednim wydaniu. Kitek, kamera, sterowanie i szczegółowa roślinność są zachowane. Modele i animacje są proceduralnymi prototypami, nie gotowymi assetami z ilustracji.

## Uruchomienie

Node.js 24.15+ w gałęzi 24 LTS; sprawdzono na 24.19. Działa także wspierana wersja 22.22.2+ lub 26+. Wymagana przeglądarka z WebGL.

```sh
git clone https://github.com/miszqr/Czytajaca-Wioska.git
cd Czytajaca-Wioska
git switch feat/new-home-story
npm ci
npm run dev
```

Otwórz `http://localhost:4173`. Nie otwieraj HTML przez `file://`. Na telefonie w tej samej sieci można użyć `http://ADRES-IP-KOMPUTERA:4173`; pad może wymagać localhost lub HTTPS. Głos systemowy jest opcjonalny; mikrofon nie jest potrzebny.

```sh
npm run content:check
npm test
npm run build
npm run check
npm run preview -- --port 4173
```

`build` waliduje treści, sprawdza TypeScript i tworzy `dist/`. `check` dodatkowo uruchamia testy. Katalog `public/content/` trafia do `dist/content/` i musi towarzyszyć buildowi.

## Odbieralne etapy

| Etap | Zakres | Stan |
| --- | --- | --- |
| P0 | Bruno na placu → dom przy stawie → list Feli → dziennik i zapis | Zaimplementowany, 26 testów i build zakończone powodzeniem |
| P1 | Lampa, szafka, skrzynka, klucz, Tola, Miluś i spotkanie | W realizacji |
| P2 | Edytor domu, dekoracje, swobodna zabawa i oprawa | Zaplanowany |

P0: wybierz „Ruszamy”, podejdź do Brunona na placu i naciśnij E. Dom Kitka stoi po prawej stronie wioski, przed stawem; ma niebieską tabliczkę. Podejdź do drzwi od strony ścieżki, wejdź i otwórz kopertę na stole. List pozostanie w dzienniku. Można wyjść na spacer, zamknąć grę i wznowić stan w domu.

## Sterowanie

| Czynność | Klawiatura / mysz | Pad | Dotyk |
| --- | --- | --- | --- |
| Przód, tył i obrót z kamerą za Kitkiem | ↑ ↓ / ← → | — | — |
| Ruch względem kamery | WASD | Lewy drążek | Joystick |
| Kamera | Przeciągnięcie świata | Prawy drążek | Przeciągnięcie świata |
| Bieg | Shift | RT / klik lewego drążka | „Bieg” |
| Rozmowa, drzwi, przedmiot | E / Enter na przycisku | A, fizyczny dolny przycisk | „Działaj” |
| Wybór w dialogu | Tab / strzałki | D-pad / lewy drążek | Dotknięcie |
| Powrót | Esc | B | Przycisk powrotu |
| Menu | M / Esc | Start | Przycisk menu |
| Odsłuch / dziennik | Przyciski na ekranie | X / Y | Przyciski na ekranie |

Dialog zatrzymuje kamerę i ruch. Wypowiedzi przewija się ręcznie; nie ma automatycznego odsłuchu ani presji czasu. Dziennik przypomina cel, bez rysowania dokładnej trasy.

## Treści i stan gry

- `public/content/story.json` — sceny, dialogi, warunki, jednorazowe skutki i listy.
- `public/content/characters.json` — mieszkańcy, modele, pozycje, `idle` i `patrol`.
- `public/content/interactions.json` — drzwi, listy, znaki i inne miejsca działania.
- `public/content/items.json` — opisy i modele przedmiotów.
- [docs/CONTENT.md](docs/CONTENT.md) — zasady edycji i dodawania treści.
- [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) — podział kodu, zapis i przepływ zdarzeń.

SaveState v3 zapisuje lokalizację, pozycję, kamerę, flagi, sceny, listy, ekwipunek i meble. Baza IndexedDB `czytajaca-wioska` pozostaje w wersji 1; zmieniono format danych pod kluczem `p0`. Starszy zapis jest archiwizowany pod `legacy-v1` lub `legacy-v2` przed migracją. Zachowuje pozycję i pamiątki, a nowa historia zaczyna się od przyjazdu. Dawne odpowiedzi nie sterują fabułą. Nieobsługiwany zapis nie jest nadpisywany.

Bez konta, analityki i serwera gry. Przy braku IndexedDB używane jest localStorage. Gdy oba magazyny są zablokowane, UI informuje, że postęp zniknie po zamknięciu. Zapis jest przypisany do przeglądarki i adresu strony. Czyszczenie danych witryny usuwa postęp. Nagłe zamknięcie procesu może utracić ostatni fragment ruchu.

## Weryfikacja i ograniczenia

Raporty są w `reports/`. Testy logiki i UI sprawdzają przebieg fabuły oraz rzeczywiste operacje fake-indexeddb. Scena i sterowanie są sprawdzane przez Babylon NullEngine, bez renderowania na GPU.

Udostępniona wcześniej przeglądarka zgłaszała `WebGL not supported`. Wygląd, shadery, wydajność na Pixelu 8 oraz fizyczny 8BitDo wymagają odbioru na urządzeniu. Lista rzeczy do sprawdzenia: [docs/ACCEPTANCE.md](docs/ACCEPTANCE.md). Docelowe modele i animacje: [docs/ASSETS.md](docs/ASSETS.md).

Nie dodano automatycznego wdrażania z `main`. Publikacja na `gh-pages` wymaga osobnej zgody. Samo zapisanie gałęzi roboczej nie aktualizuje działającej gry.

# Graficzny edytor fabuły — 2026-10-26

Baza: `08faf2b` (najnowsza opublikowana gra); main przed zmianą: `31e806b`.
Gałąź: `feat/visual-story-editor`. Scalenie zachowuje poprzednio opublikowane
zmiany, które pozostawały na kolejnych gałęziach funkcjonalnych.

Walidacja: 18 plików testów, 106 testów OK; `content:check`, TypeScript,
Vite build i test startu produkcyjnego OK. Pełne testy uruchomione z
`NODE_OPTIONS=--max-old-space-size=8192 npm run check`: domyślny limit pamięci
powodował OOM w istniejącym teście `controls.test.ts`.

Nowe testy obejmują serializację grafu, obie gałęzie, porównanie dokładnej
liczby przedmiotów, flagi, błędne JSON/referencje, cykle, nieosiągalne węzły,
konflikty portów, skutki, izolację zapisu gracza, test rozmowy w App,
przywracanie migawki i ukrycie na urządzeniach mobilnych.

Zrzut ekranu nie został wykonany: lokalne środowisko nie zawiera Chromium,
a pobranie przeglądarki testowej zwróciło niepoprawne archiwum. Nie wykonywano
oceny sceny 3D ani wydajności GPU. Testy UI używają jsdom, a testy świata
Babylon NullEngine. Układ React Flow wymaga sprawdzenia w przeglądarce użytkownika.

Kompromis MVP: graf stanowi dokument autora z osobnym eksportem i aktywuje się
po kliknięciu „Testuj graf w grze”. Zwykła gra nadal używa `story.json`.
Szczegóły obsługi, schematu i rozszerzania: `docs/story-editor.md`.

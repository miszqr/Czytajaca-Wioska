# Minimapa wioski

2026-10-23 — gałąź `feat/village-minimap`.

- Stała mapa całej wyspy w prawym dolnym rogu. Pokazuje linię brzegu, ścieżki, plac, pięć domków i staw oraz pomarańczową strzałkę Kitka.
- Współrzędne domów i krzywe ścieżek są współdzielone z geometrią wioski w `village-layout.ts`. Linia brzegu i staw korzystają z modelu terenu. Dodatnie Z wskazuje górę mapy, a znacznik obraca się zgodnie z kierunkiem postaci.
- Aktualizacja pozycji odbywa się około osiem razy na sekundę, razem z istniejącymi informacjami HUD, niezależnie od autozapisu. Wczytanie gry i przejście przez drzwi od razu dostarczają właściwą pozycję.
- Mapa to lekki SVG ze stałym tłem zapamiętanym przez React; nie dodaje kamery, renderowania świata ani map cieni. Nie przechwytuje kliknięć ani gestów.
- Na komputerze przyciski działania i kamery mają miejsce obok mapy. Przy sterowaniu dotykowym mapa znajduje się nad przyciskami działania; ma osobne rozmiary dla krótkich ekranów. W domu, dialogach i edytorze pozostaje ukryta.
- Mapa ma kontrastowy znacznik i opis dostępności; noc zmienia kolory morza i wyspy, zachowując czytelność.

Weryfikacja: 68 testów w 14 plikach przeszło, w tym synchronizacja ruchu przed autozapisem, odczyt pozycji z zapisu, kierunek znacznika, przejścia przez drzwi oraz ukrywanie mapy w dialogach i domu. Walidacja treści, TypeScript, build i test startu produkcyjnego przeszły. Polecenie testowe: `NODE_OPTIONS=--max-old-space-size=4096 npm test -- --maxWorkers=2` (testy scen Babylon przekroczyły domyślny limit 2 GB pamięci procesu).

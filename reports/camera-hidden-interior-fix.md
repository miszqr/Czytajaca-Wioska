# Kamera na placu — 2026-10-20

Ukryte wnętrze domu znajduje się w tych samych współrzędnych sceny co centralny plac. Własny predykat `pickWithRay` sprawdzał tylko `cameraObstacle`. W Babylon.js taki predykat zastępuje domyślne sprawdzenia `isEnabled`, `isVisible` i `isPickable`, więc kamera trafiała także w ściany i meble pod wyłączonym rodzicem `home-interior`.

Poprawka w `src/game/runtime.ts` przywraca te trzy warunki. `isEnabled()` uwzględnia wyłączonego rodzica, dzięki czemu nieaktywna lokalizacja nie blokuje kamery. Kolizje z aktywnymi obiektami pozostają zachowane.

Test regresji w `tests/controls.test.ts` uruchamia rzeczywistą scenę, promienie kolizji i kamerę z NullEngine. Na placu, przy pozycji `(0, -3)`, stary kod ustawia odległość około `0.713` zamiast `3.5`. Test sprawdza normalny dystans w wiosce, skrócenie go przy widocznej ścianie w domu oraz przywrócenie po wyjściu.

Weryfikacja: `npm run check` — testy, kontrola treści, TypeScript, build produkcyjny i test startu gotowego buildu. Log: [camera-hidden-interior-check.txt](camera-hidden-interior-check.txt).

Nie zmieniono ustawionego przez gracza dystansu, sterowania, treści ani formatu zapisu gry. Dostępna przeglądarka testowa nie obsługuje WebGL; pomiary kamery pochodzą z rzeczywistej logiki Babylon uruchomionej bez GPU.

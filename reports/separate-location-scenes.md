# Osobne sceny wioski i domu — 2026-10-20

## Przyczyna i zmiana

Wnętrze było budowane w tej samej scenie Babylon co wioska, wokół początku układu współrzędnych. Ukrywanie jego grupy nie usuwało geometrii ze sceny; wcześniejszy predykat promieni kamery trafiał w te niewidoczne ściany na placu. Poprzednia poprawka odfiltrowała ukryte obiekty. Ta zmiana usuwa wspólną przestrzeń lokalizacji.

`LocationScenes` zarządza osobnymi scenami `village` i `home` na jednym silniku i canvasie. Scena powstaje przy pierwszej wizycie, potem jest używana ponownie. Każda posiada własną kamerę, światła, geometrię i modele postaci. Runtime renderuje, animuje i sprawdza kolizje wyłącznie bieżącej lokalizacji. Dom nie jest tworzony w scenie wioski.

Przejście przez drzwi synchronizuje docelową scenę, czyści sterowanie i podgląd edytora, a następnie odtwarza punkt wejścia i kamerę. Plecak, listy, meble i postęp nadal korzystają ze wspólnego `SaveState v3`. Zamknięcie gry zwalnia wszystkie odwiedzone sceny. Szczegóły: `docs/ARCHITECTURE.md`.

## Weryfikacja

`npm run check` zakończyło się kodem 0:

- 39 testów w 8 plikach, w tym rzeczywiste geometrie Babylon i promienie kamery na `NullEngine`;
- odległość kamery na placu oraz reakcja na ścianę we wnętrzu;
- przejścia przez drzwi według fabuły, pozycje wejścia/wyjścia i zachowanie przeczytanego listu;
- izolacja geometrii, kamer i modeli gości między scenami;
- renderowanie i aktualizacja wyłącznie aktywnej sceny;
- pięć kolejnych powrotów bez przyrostu liczby scen, modeli i materiałów;
- odtworzenie zapisu v3 bezpośrednio w domu, zmiana mebli i czyszczenie edytora;
- zwolnienie obu scen i zatrzymanie pętli;
- walidacja treści, TypeScript i produkcyjny build Vite;
- uruchomienie zbudowanego grafu modułów w jsdom, zamontowanie UI i rozpoczęcie ładowania treści.

Pełny wynik: `reports/separate-location-scenes-check.txt`. Dostępna przeglądarka nie obsługuje WebGL, więc nie przeprowadzono wizualnej kontroli renderowania na GPU.

## Zakres

Po odwiedzeniu obu lokalizacji w pamięci pozostają dwie sceny. Nieaktywna scena nie wykonuje symulacji. Sklep i biblioteka pozostają istniejącymi stanowiskami zewnętrznymi; zmiana nie dodaje im nowych wnętrz. Format zapisu i wcześniejsza poprawka kolejności inicjalizacji modułów pozostają zachowane.

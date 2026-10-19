# Odbiór P0

## Weryfikacja wykonana automatycznie

Pierwotne P0: **10 testów zaliczonych**, 4 pliki testowe; `npm run build` zakończony powodzeniem. Wcześniejsze etapy: P0.1 — 5 testów, P0.2 — 9 testów. W końcowej kontroli wykryto i naprawiono odwrócony kierunek powierzchni ścieżek; test sprawdza, że ich normalne wskazują w górę.

Poprawka sterowania dodaje `tests/controls.test.ts`: rzeczywiste zdarzenia klawiatury, pętla gry z Babylon NullEngine i geometria kamery. Sprawdzane są obrót w miejscu, ruch podczas obrotu, cofanie bez odwracania, najkrótsza droga powrotu kamery, pierwszeństwo rozglądania, brak zapętlenia sterowania WASD, pauza oraz wejście pada i dotyku. Testy nie renderują obrazu na GPU.

Wynik poprawki: **17/17 testów, 5 plików testowych; kompilacja produkcyjna poprawna**. Próba odbioru przez Browser zakończyła się timeoutem połączenia, a podgląd lokalnego serwera przez przeglądarkę zdalną — `ERR_CONNECTION_REFUSED`. Płynność i obraz pozostają do sprawdzenia na urządzeniu.

Raporty `reports/P0-1-*`, `P0-2-*`, `P0-3-*` zawierają wyniki kompilacji i testów. Etap 1 sprawdza fundamenty domenowe i zapis; etap 2 dodaje model świata, ruch i scenę NullEngine; etap 3 kompiluje zintegrowaną grę i sprawdza pełną pętlę UI.

NullEngine oraz jsdom nie są testem obrazu, WebGL na GPU, wydajności ani fizycznego kontrolera. Podgląd przeglądarkowy jest zablokowany błędem infrastruktury opisanym w README.

## Próba na komputerze / telefonie

- [ ] Uruchom lokalnie; świat pojawia się bez błędów i logowania.
- [ ] Kitek ma niebieskie ubranie, plecak i ogon; kamera zaczyna za nim.
- [ ] Strzałkami ←/→ obróć Kitka w miejscu: kamera pozostaje za plecami. Sprawdź też obrót podczas ruchu ↑.
- [ ] ↑ idzie do przodu, ↓ cofa bez odwracania Kitka ani kamery.
- [ ] Obróć kamerę myszą; po użyciu strzałek wraca płynnie za plecy. Ręczne przeciąganie podczas ruchu ma pierwszeństwo.
- [ ] Po obrocie kamery WASD, pad i dotyk nadal poruszają względem niej; dłuższe trzymanie kierunku bocznego nie powoduje krążenia.
- [ ] Obejdź dom, płot, drzewo i staw. Nie można przenikać ani wejść do wody.
- [ ] Przybliż kamerę do ściany i sprawdź płynne skrócenie dystansu.
- [ ] Podejdź do Brunona. Znacznik rozmowy i E/A uruchamiają dialog tylko z bliska.
- [ ] Przewijaj dialog ręcznie; ruch i kamera są wtedy zatrzymane.
- [ ] Wybierz LA, skorzystaj z podpowiedzi i odsłuchu, następnie wskaż MA.
- [ ] Otrzymasz jedno nasionko. Powtórka ćwiczenia nie przyznaje kolejnego.
- [ ] Przerwij zadanie przed odpowiedzią; spacer nadal działa i można wrócić.
- [ ] Odśwież stronę: pozycja, kamera, ukończenie i nagroda wracają.
- [ ] Na telefonie sprawdź jednocześnie joystick i obrót kamery, pion i poziom.
- [ ] Na padzie sprawdź oba drążki, A/B, D-pad, Start, odłączenie i ponowne podłączenie.
- [ ] Wyłącz dostęp do pamięci witryny: pojawia się informacja, a gra nadal działa.

Dalsze zmiany P1/P2 nie są częścią tego odbioru. Gotowy build P0 przekazano na gałęzi `gh-pages`; ustawieniami publikacji zarządza właściciel repozytorium.

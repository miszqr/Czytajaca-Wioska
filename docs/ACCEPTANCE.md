# Odbiór P0

## Weryfikacja wykonana automatycznie

Końcowy wynik: **10 testów zaliczonych**, 4 pliki testowe; `npm run build` zakończony powodzeniem. Wcześniejsze etapy: P0.1 — 5 testów, P0.2 — 9 testów. W końcowej kontroli wykryto i naprawiono odwrócony kierunek powierzchni ścieżek; test sprawdza, że ich normalne wskazują w górę.

Raporty `reports/P0-1-*`, `P0-2-*`, `P0-3-*` zawierają wyniki kompilacji i testów. Etap 1 sprawdza fundamenty domenowe i zapis; etap 2 dodaje model świata, ruch i scenę NullEngine; etap 3 kompiluje zintegrowaną grę i sprawdza pełną pętlę UI.

NullEngine oraz jsdom nie są testem obrazu, WebGL na GPU, wydajności ani fizycznego kontrolera. Podgląd przeglądarkowy jest zablokowany błędem infrastruktury opisanym w README.

## Próba na komputerze / telefonie

- [ ] Uruchom lokalnie; świat pojawia się bez błędów i logowania.
- [ ] Kitek ma niebieskie ubranie, plecak i ogon; kamera zaczyna za nim.
- [ ] Obróć kamerę i sprawdź, że „do przodu” odpowiada jej kierunkowi.
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

Dalsze zmiany P1/P2 i publikacja nie są częścią tego odbioru. Gra nie została wdrożona.

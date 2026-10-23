# Latarnie gazowe i noc

2026-10-23 — gałąź `feat/gas-lanterns-night`.

- Osiem latarni przy wejściu, placu, domach mieszkańców, bibliotece i stawie. Każda ma metalowy słup, mosiężny palnik i zawór oraz osobny płomień i punktowe światło.
- Istniejący przepływ interakcji obsługuje podejście, krótki tekst do samodzielnego przeczytania, zapalenie i anulowanie. Ponowienie zakończonego wyboru nie zmienia stanu gry.
- Przełącznik „Zapada noc” w menu działa myszą, klawiaturą, padem i dotykiem. Zmiana trwa sześć sekund również przy otwartym menu; preferencja ograniczonego ruchu pomija przejście.
- Niebo, mgła, światło otoczenia oraz morze przechodzą w nocną paletę. Gwiazdy są nieruchome, a ścieżki pozostają widoczne. Wyłączenie przełącznika przywraca dzień.
- Noc i każda latarnia używają osobnych flag w zapisie v3. Starsze zapisy zaczynają za dnia. Wejście do domu i powrót zachowują stan; nowa gra go zeruje. Noc nie zapala latarni automatycznie.
- Słupy trafiają do istniejących partii statycznej scenerii; płomienie pozostają dynamiczne i nie rzucają cieni. Nowe światła nie tworzą map cieni, a kierunek i projekcja istniejącego światła słonecznego pozostają stałe. Materiały obsługują wszystkie osiem latarni oraz dwa światła otoczenia.

Weryfikacja: 66 testów przeszło (`npm test -- --maxWorkers=2`), walidacja treści, TypeScript, build i test startu wersji produkcyjnej przeszły. Testy obejmują dostępność wszystkich latarni, przejście dzień/noc, ograniczony ruch, zapis i odczyt, anulowanie, zmianę lokalizacji, pauzę menu, obsługę przełącznika padem oraz geometrię i konfigurację świateł w Babylon NullEngine. Podgląd w przeglądarce nie ma dostępu do lokalnego serwera; testy NullEngine nie oceniają wyglądu ani wydajności na GPU.

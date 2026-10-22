# Jabłka do zbierania

2026-10-22 — gałąź `feat/collectible-apples`.

- Dwie istniejące jabłonie zachowują położenie, skalę, kolizje i koronę.
- Po sześć większych, czerwonych owoców. Każdy owoc, ogonek i liść pozostają osobną grupą poza scalaniem statycznej scenerii.
- Zbieranie używa dotychczasowego przepływu interakcji i krótkiego tekstu do samodzielnego przeczytania. Działa przez E, przycisk A pada oraz dotykowy przycisk działania.
- Istniejący przedmiot `apple` ma teraz ogólną nazwę „Jabłko”. Owoce tworzą jeden stos w plecaku; stare zapisy i wcześniejsze jabłka są zachowane.
- Transakcja fabularna dodaje jedną sztukę i zapisuje flagę owocu. Przy braku miejsca nic nie znika. Ponowienie starego wyboru nie powiela przedmiotu.
- Synchronizacja sceny wioski odtwarza widoczność owoców z zapisu, także po powrocie z domu. Format zapisu v3 pozostaje bez zmian. Jabłka odnawia nowa gra.

Weryfikacja: 62 testy przeszły (`npm test -- --maxWorkers=2`), walidacja treści, TypeScript, build i test startu wersji produkcyjnej przeszły. Testy obejmują oba drzewa, wszystkie 12 owoców, pełny plecak, stos jabłek, anulowanie, ponowne wczytanie, licznik w UI oraz rzeczywistą geometrię Babylon i cienie. Przeglądarka do wizualnego sprawdzenia WebGL była niedostępna w tej sesji.

# Jeziorko dostępne dla Kitka — 2026-10-22

Usunięto kolisty obszar blokujący wejście do stawu oraz wypukłą dekorację brzegu. Wspólna funkcja wysokości terenu tworzy teraz płytką nieckę: płaskie dno w środku, maksymalnie 0,5 jednostki pod wodą, oraz łagodne przejście do istniejącego brzegu. Siatka ziemi i położenie łap korzystają z tej samej wysokości.

Woda jest płaską, półprzezroczystą powierzchnią eliptyczną. Nie blokuje postaci ani kamery i nie rzuca cienia. Pozostaje osobnym obiektem poza scalaniem dekoracji. Lilie leżą na powierzchni wody; drzewa, kwiaty i trawa pozostają poza niecką. Otaczające wyspę morze zachowuje dotychczasową granicę spaceru.

Weryfikacja:

- `npm run check`: 53 testy w 9 plikach, walidacja treści, TypeScript, kompilacja produkcyjna i uruchomienie modułów produkcyjnych zakończone poprawnie.
- Scena Babylon: dojście od punktu startowego do środka jeziorka, przejście przez obie osie stawu i powrót na brzeg, brak drzew w niecce, poprawna orientacja powierzchni wody i role cieni.
- Promienie w rzeczywistą siatkę dna: różnica między widoczną ziemią a wysokością chodzenia mniejsza niż 0,025 jednostki. Łagodne nachylenie, ograniczona głębokość i sucha krawędź sprawdzone wokół całego stawu.
- Rzeczywista pętla sterowania: wejście z suchego brzegu, ustawienie postaci na dnie, wczytanie zapisu w wodzie, wyjście na brzeg; kamera pozostaje nad wodą.

Testy geometrii i sterowania korzystają z Babylon NullEngine. Renderowanie WebGL na telefonie nie zostało w tym środowisku sprawdzone.

# P2 — swobodna zabawa i urządzanie

2026-10-19. Prototyp P2 dodaje edytor domu z podglądem w rzeczywistym pokoju 3D, siatką 0.5 jednostki, obrotem, schowkiem oraz 20 typami przedmiotów (14 dekoracji i 6 przedmiotów użytkowych/pamiątkowych). Można urządzać dom przed zakończeniem opowieści i po niej, przesuwać i chować meble oraz ponownie zapraszać sąsiadów.

`npm run check`: **34 testy / 8 plików — OK**, walidacja JSON — OK, TypeScript — OK, build Vite — OK. Log: `story-P2-check.txt`. Schemat edytora: `docs/story.schema.json`.

## Sprawdzone zachowania

- Przenoszenie dekoracji: schowek → plecak → pokój → schowek zachowuje liczbę sztuk.
- Kolizje uwzględniają obrót, inne meble, ściany, postać i dostęp do drzwi/szafki. Kontrola połączenia wolnych pól chroni możliwość wyjścia.
- Anulowanie podglądu nie zużywa przedmiotu ani nie przesuwa istniejącego mebla. Podgląd nie zostawia dodatkowej geometrii po zamknięciu.
- UI: ustawienie lampy z akcjami D-pada, blokada przy kolizji, obrót i potwierdzenie. Po wczytaniu ustawienie i zakończenie sceny pozostają zachowane.
- Lampa realizuje cel przy faktycznym łóżku; samo ustawienie jej daleko nie kończy sceny. Powtórne przesunięcie nie tworzy drugiej lampy.
- List podąża za stołem. Goście wybierają wolne miejsca; pełny pokój nie uruchamia częściowego spotkania.
- Kamera edytora jest tymczasowa. Powrót przywraca kamerę spaceru, bez zmiany zapisu jej położenia.
- Regresja całych ośmiu scen, migracji zapisu i dotychczasowego sterowania.

## Oprawa i ograniczenia

Fela, Tola i Miluś mają różne proceduralne modele i portrety. Dodano zastępcze gesty rozmowy, podnoszenia i przekazywania, skrzynkę widoczną przy Kitku, stanowisko Feli i skrzynkę pocztową Milusia. Odsłuch pozostaje opcjonalny. Nowy edytor obsługuje przyciski, strzałki, R/E i akcje pada; CSS przełącza panel na dół w wąskim widoku.

Wspólne materiały są ponownie używane, a meble przebudowuje się tylko po zmianie ustawienia. To usprawnienia prototypu, nie potwierdzony pomiar wydajności Androida. Modelom brakuje docelowych rigów i klipów glTF; część ikon przedmiotów pozostaje wspólna. Sklep i biblioteka mają zewnętrzne stanowiska, bez osobnych wnętrz. Goście pojawiają się w domu, bez symulacji podróży przez całą wioskę. NPC nie mają harmonogramu dobowego ani zapisu chwilowego miejsca spaceru.

Odbiór obrazu, płynności, dotyku na Pixelu 8 i fizycznego 8BitDo pozostaje otwarty. Testy NullEngine/jsdom nie potwierdzają GPU. Scenariusz ręczny: `docs/ACCEPTANCE.md`. Nie wykonano publicznego wdrożenia.

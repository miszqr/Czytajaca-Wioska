# Architektura opowieści

Babylon.js + TypeScript + React + Vite. Świat i grafika pozostają niezależne od treści. Historia „Nowy dom Kitka” zastępuje dawną mechanikę ćwiczeń.

| Moduł | Odpowiedzialność |
| --- | --- |
| `content/` | Typy i walidacja JSON; ładowanie całego pakietu przed startem gry |
| `story/engine.ts` | Warunki, wybór dialogu, atomowe skutki, jednorazowe węzły i aktualny cel |
| `game/runtime.ts` | Ruch, kamera, najbliższa interakcja, pauza i synchronizacja świata ze stanem |
| `game/world.ts`, `vegetation.ts` | Wioska i stała geometria, wspólne partie materiałów |
| `game/story-world.ts` | Wnętrze domu, przedmioty i wizualizacja trwałych zmian |
| `game/npc.ts` | Stanie i spacer po punktach; pauza, zatrzymanie przy graczu, kolizje |
| `housing/` | Siatka, obrót, kolizje, drożność przejść, schowek i miejsca dla gości |
| `characters/` | Proceduralne prototypy modeli i animacji |
| `ui/` | Dialogi, listy, dziennik, plecak, menu i dotyk |
| `persistence/` | SaveState v3, migracja, kopia starszego zapisu, kolejka IndexedDB/fallback |
| `audio/` | Odsłuch tekstu na żądanie, bez rozpoznawania mowy |

Nie ma ReadingEngine ani komponentów quizowych. Silnik sprawdza działania w świecie, nigdy wpisaną odpowiedź dziecka.

## Zdarzenie i stan

1. Runtime wskazuje najbliższy dostępny obiekt w aktualnej lokalizacji. Działanie wymaga odległości do 2 jednostek.
2. Silnik dobiera węzeł o najwyższym priorytecie, pasujących warunkach i niewykonanych skutkach jednorazowych.
3. UI pokazuje krótkie wypowiedzi po jednej. Wybór wyraża zamiar, np. otwarcie drzwi lub zabranie listu.
4. Silnik ponownie sprawdza dostępność węzła i atomowo stosuje skutki. Brak miejsca lub przedmiotu nie pozostawia częściowych zmian.
5. React, świat Babylon i kolejka zapisu otrzymują ten sam nowy stan. Ponowne wykonanie starego, jednorazowego węzła jest odrzucane.

Flagę można ustawić, dać lub zabrać przedmiot, zapisać przeczytany list, ukończyć scenę i przejść między wioską a domem. Warunki sprawdzają flagi i zawartość plecaka. Pomyłki dziecka nie odbierają postępu. Dialog może zamiast tego zawierać przypomnienie.

## Świat i kamera

Wioska ma orientacyjnie 100 × 100 jednostek. Wnętrze jest osobną lokalizacją w tej samej scenie: przy wejściu ukrywa się geometrię wioski i włącza pokój. Ruch używa odpowiedniej listy kolizji; wysokość terenu w domu wynosi zero. Położenie oraz lokalizacja zapisują się razem.

Zachowane parametry: chód 2.4, bieg 4.0 jednostki/s, rozpędzenie ok. 0.2 s, obrót względem ruchu do 540°/s, strzałki obracają Kitka z kamerą za plecami. WASD, joystick i pad pozostają zależne od kierunku kamery. Raycasty skracają dystans przed przeszkodami. Dialog i menu pauzują ruch.

Geometrię stałą wioski scalono według materiałów. Wnętrze, zmienne obiekty i meble są oddzielne; meble przebudowuje się tylko po zmianie rozmieszczenia, nie przy okresowym zapisie pozycji. NPC korzystają ze wspólnej geometrii kolizji, bez pełnej nawigacji wokół budynków.

## Zapis i migracja

Format v3: `location`, `player`, `camera`, `flags`, `completed`, `seen`, `read`, `inventory`, `storage`, `furniture`, `welcomed`, `updatedAt`. ID treści są trwałymi kluczami. Zmiana tekstu nie zmienia skutków już wykonanej sceny. Nie usuwa się nieznanych flag i przeczytanych ID tylko dlatego, że plik treści tymczasowo ich nie zawiera.

Formaty v1/v2 są migrowane do nowej historii, z zachowaniem pozycji i pamiątek. Oryginał zostaje zapisany pod osobnym kluczem `legacy-v1`/`legacy-v2`; brak możliwości utworzenia kopii wstrzymuje migrację. Baza i dotychczasowy klucz pozostają te same. Zapis uszkodzony lub przyszłej wersji zatrzymuje start i nie jest zastępowany pustym stanem.

## Dalsze rozszerzanie

Nowe dialogi i sceny powstają w JSON. Nowy rodzaj skutku, zachowania, modelu lub interakcji wymaga rozszerzenia typów, walidatora i odpowiedniego handlera TypeScript. Pliki treści nie wykonują dowolnego JavaScript.

## Dom i swobodna zabawa

Edytor używa tego samego modelu mebla co scena. Podgląd jest osobnym, półprzezroczystym węzłem, usuwanym przy zmianie lub anulowaniu. Kamera edytora pokazuje pokój z góry i ma osobny viewport dla panelu; nie zmienia zapisanej kamery spaceru. Zamknięcie przywraca kamerę zza Kitka.

Siatka ma krok 0.5 jednostki i cztery kąty obrotu. Kontrola obrysu uwzględnia obrót, ściany, inne meble, gracza oraz rezerwę przy drzwiach i szafce. Dodatkowy test połączenia wolnych pól chroni drogę gracza do wyjścia. Dywan może leżeć pod meblem, lecz nie na drugim dywanie.

Dekoracja należy w danej chwili do schowka, plecaka albo pokoju. Przenoszenie istniejącego obiektu zachowuje jego ID i nie zużywa nowej sztuki. Anulowanie podglądu nie zmienia ustawienia. Schowanie przenosi własność do schowka, więc pełny plecak nie odbiera możliwości reorganizacji pokoju. Początkowy zestaw dekoracji jest dodawany raz, pod flagą `decorations-ready`.

List jest zakotwiczony w stole, a miejsce przy łóżku podąża za łóżkiem. `afterPlacement` kończy scenę prezentu po ustawieniu właściwej lampy w odległości do 2.8 jednostki od faktycznego łóżka. Późniejsze przesuwanie lampy nie cofa historii. Goście wybierają wolne punkty w pokoju; rozpoczęcie wizyty sprawdza, czy wszyscy się mieszczą. Wizytę kończy dzwonek lub wyjście z domu.

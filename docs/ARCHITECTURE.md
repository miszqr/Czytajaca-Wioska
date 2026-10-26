# Architektura opowieści

Babylon.js + TypeScript + React + Vite. Świat i grafika pozostają niezależne od treści. Historia „Nowy dom Kitka” zastępuje dawną mechanikę ćwiczeń.

| Moduł | Odpowiedzialność |
| --- | --- |
| `content/` | Typy i walidacja JSON; ładowanie całego pakietu przed startem gry |
| `story/engine.ts` | Warunki, wybór dialogu, atomowe skutki, jednorazowe węzły i aktualny cel |
| `game/runtime.ts` | Ruch, kamera, najbliższa interakcja, pauza i synchronizacja świata ze stanem |
| `game/location-scenes.ts` | Tworzenie i przechowywanie osobnych scen lokalizacji; kamery, aktorzy i zwalnianie zasobów |
| `game/world.ts`, `vegetation.ts` | Wioska i stała geometria, wspólne partie materiałów |
| `game/story-world.ts` | Geometria wnętrza wyłącznie w scenie domu; przedmioty i trwałe zmiany filtrowane według lokalizacji |
| `game/npc.ts` | Stanie i spacer po punktach; pauza, zatrzymanie przy graczu, kolizje |
| `housing/` | Siatka, obrót, kolizje, drożność przejść, schowek i miejsca dla gości |
| `characters/` | Proceduralne prototypy modeli i animacji |
| `ui/` | Dialogi, listy, dziennik, plecak, menu i dotyk |
| `persistence/` | SaveState v3, migracja, kopia starszego zapisu, kolejka IndexedDB/fallback |

Nie ma ReadingEngine ani komponentów quizowych. Silnik sprawdza działania w świecie, nigdy wpisaną odpowiedź dziecka.

## Zdarzenie i stan

1. Runtime wskazuje najbliższy dostępny obiekt w aktualnej lokalizacji. Działanie wymaga odległości do 2 jednostek.
2. Silnik dobiera węzeł o najwyższym priorytecie, pasujących warunkach i niewykonanych skutkach jednorazowych.
3. UI pokazuje krótkie wypowiedzi po jednej. Wybór wyraża zamiar, np. otwarcie drzwi lub zabranie listu.
4. Silnik ponownie sprawdza dostępność węzła i atomowo stosuje skutki. Brak miejsca lub przedmiotu nie pozostawia częściowych zmian.
5. React, świat Babylon i kolejka zapisu otrzymują ten sam nowy stan. Ponowne wykonanie starego, jednorazowego węzła jest odrzucane.

Flagę można ustawić, dać lub zabrać przedmiot, zapisać przeczytany list, ukończyć scenę i przejść między wioską a domem. Warunki sprawdzają flagi i zawartość plecaka. Pomyłki dziecka nie odbierają postępu. Dialog może zamiast tego zawierać przypomnienie.

## Świat i kamera

Wioska ma orientacyjnie 100 × 100 jednostek. Wioska i wnętrze domu są **osobnymi obiektami `Scene` Babylon.js**, obsługiwanymi przez jeden `Engine` i jeden canvas. Ich współrzędne są niezależne: pokój może mieć środek `(0, 0)`, lecz jego ściany i meble nie istnieją w scenie placu.

| Właściciel | Zawartość |
| --- | --- |
| Wspólny runtime | Jedna pętla, sterowanie, aktualny `SaveState`, aktualna pozycja, przejścia i komunikacja z React |
| Scena `village` | Teren, roślinność, budynki zewnętrzne, plenerowe interakcje, kamera, światło, Kitek i mieszkańcy |
| Scena `home` | Pokój, meble, koperta i inne domowe interakcje, kamera, światło, Kitek i modele gości |

`LocationScenes` tworzy scenę dopiero przy pierwszej wizycie. Wczytanie zapisu w domu tworzy wyłącznie dom. Po odwiedzeniu obu lokalizacji w pamięci pozostają dwie sceny, używane ponownie przy kolejnych przejściach. To ogranicza koszt ponownego budowania świata kosztem przechowywania obu odwiedzonych lokalizacji. Nie ma przesuwania wnętrza daleko poza mapę ani nakładania ukrytych grup geometrii.

Runtime renderuje, animuje i odpytuje promieniami wyłącznie aktywną scenę. Nieaktywna nie otrzymuje kroków symulacji. Każda scena ma własne modele postaci i materiały — wizyta Brunona w domu nie przenosi jego modelu z wioski. Pozycje i postęp spaceru mieszkańców wioski pozostają w jej scenie podczas wizyty w domu; nadal nie są osobno utrwalane w zapisie gry.

Sceny nie instalują dodatkowych handlerów sterowania Babylon. Klawiaturę, pad, dotyk i ruch kamery obsługuje jeden runtime. Zamknięcie gry zwalnia obie sceny i silnik, także gdy gracz kończy we wnętrzu.

### Przejście przez drzwi

1. Skutek `travel` w fabule określa lokalizację, punkt wejścia i kierunek. Wspólny stan zawiera dotychczasowy plecak, listy, flagi, schowek i meble.
2. `LocationScenes.prepare()` pobiera lub tworzy docelową scenę i synchronizuje jej obiekty z tym stanem.
3. Runtime usuwa podgląd mebla i siatkę poprzedniego edytora, zeruje prędkość i stare wejście sterowania oraz kończy obrót kamery i wskazanie poprzedniego rozmówcy.
4. Przełącza aktywną scenę, ustawia Kitka w punkcie wejścia, aktualizuje kamerę i usuwa nieaktualną etykietę interakcji.
5. Następna klatka obsługuje wyłącznie nową lokalizację. Powrót używa istniejącej sceny, bez dokładania kolejnych modeli, kamer czy świateł.

Ruch używa kolizji aktywnej lokalizacji; wysokość terenu w domu wynosi zero. Własny predykat promieni kamery nadal sprawdza `isEnabled()`, `isVisible` i `isPickable`, aby pomijać ukryte obiekty wewnątrz tej samej sceny.

Każda scena posiada własny obiekt kamery, ale zapis nadal przechowuje parametry bieżącego widoku: dystans, nachylenie i kierunek. Przejście zachowuje dystans i nachylenie, a kierunek ustawia zgodnie z drzwiami. Nie zmieniono formatu `SaveState v3`; wcześniejsze zapisy w domu i wiosce działają bez nowej migracji.

Zachowane parametry: chód 2.4, bieg 4.0 jednostki/s, rozpędzenie ok. 0.2 s, obrót względem ruchu do 540°/s, strzałki obracają Kitka z kamerą za plecami. WASD, joystick i pad pozostają zależne od kierunku kamery. Raycasty skracają dystans przed przeszkodami. Dialog i menu pauzują ruch.

Geometrię stałą wioski scalono według materiałów. Wnętrze, zmienne obiekty i meble są oddzielne; meble przebudowuje się tylko po zmianie rozmieszczenia, nie przy okresowym zapisie pozycji. NPC korzystają ze wspólnej geometrii kolizji, bez pełnej nawigacji wokół budynków.

## Zapis i migracja

Format v3: `location`, `player`, `camera`, `flags`, `completed`, `seen`, `read`, `inventory`, `storage`, `furniture`, `welcomed`, `updatedAt`. ID treści są trwałymi kluczami. Zmiana tekstu nie zmienia skutków już wykonanej sceny. Nie usuwa się nieznanych flag i przeczytanych ID tylko dlatego, że plik treści tymczasowo ich nie zawiera.

Formaty v1/v2 są migrowane do nowej historii, z zachowaniem pozycji i pamiątek. Oryginał zostaje zapisany pod osobnym kluczem `legacy-v1`/`legacy-v2`; brak możliwości utworzenia kopii wstrzymuje migrację. Baza i dotychczasowy klucz pozostają te same. Zapis uszkodzony lub przyszłej wersji zatrzymuje start i nie jest zastępowany pustym stanem.

## Dalsze rozszerzanie

Nowe dialogi i sceny powstają w JSON. Nowy rodzaj skutku, zachowania, modelu lub interakcji wymaga rozszerzenia typów, walidatora i odpowiedniego handlera TypeScript. Pliki treści nie wykonują dowolnego JavaScript.

Nowe wnętrze wymaga dodania ID do `Location`, obsługi walidacji i zapisu oraz fabryki jego sceny w `LocationScenes`. Obiekty i punkty wejścia muszą należeć do tej lokalizacji. Należy dodać test przejścia, wczytania zapisu, izolacji geometrii i zwalniania zasobów. W obecnym wydaniu osobne sceny mają wioska i dom Kitka; sklep i biblioteka nadal są stanowiskami zewnętrznymi.

## Dom i swobodna zabawa

Edytor używa tego samego modelu mebla co scena. Podgląd jest osobnym, półprzezroczystym węzłem, usuwanym przy zmianie lub anulowaniu. Kamera edytora pokazuje pokój z góry i ma osobny viewport dla panelu; nie zmienia zapisanej kamery spaceru. Zamknięcie przywraca kamerę zza Kitka.

Siatka ma krok 0.5 jednostki i cztery kąty obrotu. Kontrola obrysu uwzględnia obrót, ściany, inne meble, gracza oraz rezerwę przy drzwiach i szafce. Dodatkowy test połączenia wolnych pól chroni drogę gracza do wyjścia. Dywan może leżeć pod meblem, lecz nie na drugim dywanie.

Dekoracja należy w danej chwili do schowka, plecaka albo pokoju. Przenoszenie istniejącego obiektu zachowuje jego ID i nie zużywa nowej sztuki. Anulowanie podglądu nie zmienia ustawienia. Schowanie przenosi własność do schowka, więc pełny plecak nie odbiera możliwości reorganizacji pokoju. Początkowy zestaw dekoracji jest dodawany raz, pod flagą `decorations-ready`.

List jest zakotwiczony w stole, a miejsce przy łóżku podąża za łóżkiem. `afterPlacement` kończy scenę prezentu po ustawieniu właściwej lampy w odległości do 2.8 jednostki od faktycznego łóżka. Późniejsze przesuwanie lampy nie cofa historii. Goście wybierają wolne punkty w pokoju; rozpoczęcie wizyty sprawdza, czy wszyscy się mieszczą. Wizytę kończy dzwonek lub wyjście z domu.

# Czytająca Wioska — Nowy dom Kitka

Przytulna przygodowa gra 3D po polsku. Kitek poznaje sąsiadów, czyta listy i urządza nowy dom. Krótkie zdania prowadzą do działań w świecie: rozmów, odwiedzin, przenoszenia rzeczy. Nie ma quizów, sylab, punktów za czytanie ani przegrywania.

**Gałąź robocza:** `feat/new-home-story`. Nowa specyfikacja z 2026-10-19 jest w [docs/WORK_BRIEF.md](docs/WORK_BRIEF.md). Wersja fabularna P0–P2 została opublikowana 2026-10-19 za zgodą użytkownika: https://miszqr.github.io/Czytajaca-Wioska/. Raport wydania: [reports/story-deployment.md](reports/story-deployment.md). Kitek, kamera, sterowanie i szczegółowa roślinność są zachowane. Modele i animacje są proceduralnymi prototypami, nie gotowymi assetami z ilustracji.

## Uruchomienie

Node.js 24.15+ w gałęzi 24 LTS; sprawdzono na 24.19. Działa także wspierana wersja 22.22.2+ lub 26+. Wymagana przeglądarka z WebGL.

```sh
git clone https://github.com/miszqr/Czytajaca-Wioska.git
cd Czytajaca-Wioska
git switch feat/new-home-story
npm ci
npm run dev
```

Otwórz `http://localhost:4173`. Nie otwieraj HTML przez `file://`. Na telefonie w tej samej sieci można użyć `http://ADRES-IP-KOMPUTERA:4173`; pad może wymagać localhost lub HTTPS. Głos systemowy jest opcjonalny; mikrofon nie jest potrzebny.

```sh
npm run content:check
npm test
npm run build
npm run test:build
npm run check
npm run preview -- --port 4173
```

`build` waliduje treści, sprawdza TypeScript i tworzy `dist/`. `test:build` uruchamia gotowy kod produkcyjny w jsdom: sprawdza inicjalizację modułów, pierwszy render UI i rozpoczęcie ładowania treści, bez WebGL. `check` uruchamia testy, build i ten test startu. Katalog `public/content/` trafia do `dist/content/` i musi towarzyszyć buildowi.

Podział zależności w `vite.config.ts` wymaga `strictExecutionOrder: true`. Babylon.js ma moduły zależne od kolejności inicjalizacji; bez tej opcji build może się udać, ale strona zatrzyma się na błędzie `NoneLogLevel`. Raport poprawki: [reports/runtime-startup-fix.md](reports/runtime-startup-fix.md).

## Odbieralne etapy

| Etap | Zakres | Stan |
| --- | --- | --- |
| P0 | Bruno na placu → dom przy stawie → list Feli → dziennik i zapis | Zaimplementowany, 26 testów i build zakończone powodzeniem |
| P1 | Lampa, szafka, skrzynka, klucz, Tola, Miluś i spotkanie | Zaimplementowany, 28 testów i build zakończone powodzeniem |
| P2 | Edytor domu, dekoracje, swobodna zabawa i oprawa | Zaimplementowany, 34 testy i build zakończone powodzeniem |

P0: wybierz „Ruszamy”, podejdź do Brunona na placu i naciśnij E. Dom Kitka stoi po prawej stronie wioski, przed stawem; ma niebieską tabliczkę. Podejdź do drzwi od strony ścieżki, wejdź i otwórz kopertę na stole. List pozostanie w dzienniku. Można wyjść na spacer, zamknąć grę i wznowić stan w domu.

P1: po liście odwiedź Felę. Przynieś lampę do domu i ustaw przy łóżku w edytorze. Przeczytaj notatkę przy szafce, porozmawiaj z Brunonem i przenieś skrzynkę do ogrodu. Wróć po klucz. Książeczka z szafki prowadzi do Toli, a Tola do Milusia. Roznieś zaproszenia i zadzwoń dzwonkiem w domu.

P2: przycisk „Urządź dom” działa także przed ukończeniem historii. Wybierz mebel ze schowka lub plecaka, przesuń podgląd, obróć i postaw. Meble można przenosić i chować. Gości można pożegnać dzwonkiem i zaprosić ponownie. Nie ma końcowego ekranu blokującego świat.

Na dwóch jabłoniach, przy placu i przy drodze do domu, rośnie po sześć czerwonych jabłek. Podejdź do drzewa, wybierz „Zbierz jabłko”, przeczytaj opis i wybierz „Zrywam jabłko.”. Każdy owoc znika z gałęzi i zwiększa licznik jabłek w jednym miejscu plecaka. Pełny plecak bez stosu jabłek pozostawia owoc na drzewie. Zbiory zapisują się wraz z grą; wejście do domu i odświeżenie strony nie odnawiają owoców. Nowa gra przywraca wszystkie jabłka.

Przy ścieżkach stoi osiem latarni gazowych. Podejdź do wybranej latarni, użyj „Zapal latarnię” (E / A na padzie / przycisk działania), przeczytaj krótki opis i wybierz „Zapalam latarnię.”. Każda zapala się osobno i oświetla otoczenie ciepłym światłem. W menu przełącznik **Zapada noc** płynnie przyciemnia wioskę, niebo i morze; wyłączenie przywraca dzień. Ustawienie oraz zapalone latarnie zapisują się razem z postępem. Nowa gra rozpoczyna się za dnia ze zgaszonymi latarniami.

## Sekret jeziorka

Zbierz **dokładnie 3 jabłka** i z nimi w plecaku obejdź jeziorko **trzy pełne razy przeciwnie do ruchu wskazówek zegara** (patrząc z góry; woda po lewej stronie podczas marszu do przodu). Możesz zacząć w dowolnym miejscu brzegu. Omijaj drzewa i przejdź przez prześwit między płotem przy domu Kitka a jeziorkiem. Cofanie odejmuje postęp; stanie i obracanie się nie liczą się. Przejście przez głębszą wodę, odejście daleko od jeziorka, wejście do domu, zmiana liczby jabłek i ponowne wczytanie gry przerywają rozpoczętą serię. Menu i dialogi tylko ją pauzują. Przy jeziorku pojawia się licznik okrążeń i pasek postępu. Liczy się rzeczywisty suchy brzeg; niewielkie wejście w płyciznę nie zeruje serii.

Po trzecim okrążeniu pojawia się krótka wskazówka „Spójrz na morze za jeziorkiem!”. Od wschodniej strony wyspy z morza wychodzi stegozaur: proceduralny, stylizowany model długości około 9 m, z płytami grzbietowymi i czterema kolcami ogona. Wyjście trwa około 24 sekund; zwierzę zatrzymuje się przed Kitkiem oraz podczas pauzy, po czym pozostaje na plaży. Jabłka nie są zużywane. Odkrycie zapisuje się natychmiast pod flagą `stegosaurus-awakened`; po odświeżeniu stegozaur stoi już na plaży. Nowa gra usuwa odkrycie i pozwala powtórzyć sekret. Edytor fabuły używa własnego zapisu także dla tego zdarzenia.

Skala dorosłego modelu: [Natural History Museum — Stegosaurus (9 m)](https://www.nhm.ac.uk/discover/dino-directory/Stegosaurus.html). Model jest własną geometrią proceduralną, bez pobieranych tekstur i zewnętrznych modeli.

## Sterowanie

W prawym dolnym rogu jest minimapa wyspy: pokazuje ścieżki, domki i staw. Pomarańczowa strzałka wskazuje bieżącą pozycję i kierunek Kitka. Na telefonie mapa jest domyślnie zwinięta do ikonki nad przyciskami działania. Dotknięcie ikonki rozwija mapę; ponowne dotknięcie lub dotknięcie poza mapą ją chowa. Na komputerze mapa jest stale widoczna. We wnętrzu domu i podczas dialogów jest ukryta.

| Czynność | Klawiatura / mysz | Pad | Dotyk |
| --- | --- | --- | --- |
| Przód, tył i obrót z kamerą za Kitkiem | ↑ ↓ / ← → | — | — |
| Ruch względem kamery | WASD | Lewy drążek | Joystick |
| Kamera | Przeciągnięcie świata | Prawy drążek | Przeciągnięcie świata |
| Bieg | Shift | RT / klik lewego drążka | „Bieg” |
| Rozmowa, drzwi, przedmiot | E / Enter na przycisku | A, fizyczny dolny przycisk | „Działaj” |
| Wybór w dialogu | Tab / strzałki | D-pad / lewy drążek | Dotknięcie |
| Powrót | Esc | B | Przycisk powrotu |
| Menu | M / Esc | Start | Przycisk menu |
| Edytor: miejsce / obrót / postaw | Strzałki / R / E | D-pad / X / A | Przyciski edytora |
| Dziennik | Przycisk na ekranie | Y | Przycisk na ekranie |

Dialog zatrzymuje kamerę i ruch. Dziecko samodzielnie czyta tekst i ręcznie przewija wypowiedzi, bez presji czasu. Gra nie odczytuje tekstu na głos. Dziennik przypomina cel, bez rysowania dokładnej trasy.

## Treści i stan gry

- `public/content/story.json` — sceny, dialogi, warunki, jednorazowe skutki i listy.
- `public/content/characters.json` — mieszkańcy, modele, pozycje, `idle` i `patrol`.
- `public/content/interactions.json` — drzwi, listy, znaki i inne miejsca działania.
- `public/content/items.json` — opisy i modele przedmiotów.
- [docs/CONTENT.md](docs/CONTENT.md) — zasady edycji i dodawania treści.
- [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) — podział kodu, zapis i przepływ zdarzeń.

SaveState v3 zapisuje lokalizację, pozycję, kamerę, flagi, sceny, listy, ekwipunek, schowek i meble. Baza IndexedDB `czytajaca-wioska` pozostaje w wersji 1; zmieniono format danych pod kluczem `p0`. Starszy zapis jest archiwizowany pod `legacy-v1` lub `legacy-v2` przed migracją. Zachowuje pozycję i pamiątki, a nowa historia zaczyna się od przyjazdu. Dawne odpowiedzi nie sterują fabułą. Nieobsługiwany zapis nie jest nadpisywany.

W menu jest **Zacznij nową grę**. Dopiero wybór **Tak, zacznij od nowa** zastępuje bieżący postęp świeżym zapisem i odtwarza świat od początku, wraz z pozycją, kamerą i początkowym wyposażeniem. Potwierdzenie domyślnie wskazuje anulowanie; Esc i przycisk powrotu na padzie wracają do menu. Nowy zapis powstaje już przed ekranem „Ruszamy”, więc odświeżenie strony nie przywraca poprzedniej rozgrywki. Historyczne kopie migracyjne pozostają nietknięte.

Wioska i dom Kitka działają w osobnych scenach Babylon.js. Drzwi przełączają aktywną scenę i ustawiają postać przy wejściu. Scena powstaje przy pierwszej wizycie; później jest ponownie używana, a poza nią nie działa renderowanie ani ruch mieszkańców. Plecak, fabuła i umeblowanie pozostają wspólne. Istniejące zapisy v3 działają bez zmiany formatu. Opis podziału i przejść: [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md).

Bez konta, analityki i serwera gry. Przy braku IndexedDB używane jest localStorage. Gdy oba magazyny są zablokowane, UI informuje, że postęp zniknie po zamknięciu. Zapis jest przypisany do przeglądarki i adresu strony. Czyszczenie danych witryny usuwa postęp. Nagłe zamknięcie procesu może utracić ostatni fragment ruchu.

## Weryfikacja i ograniczenia

Raporty są w `reports/`. Testy logiki i UI sprawdzają przebieg fabuły oraz rzeczywiste operacje fake-indexeddb. Scena i sterowanie są sprawdzane przez Babylon NullEngine, bez renderowania na GPU.

Udostępniona wcześniej przeglądarka zgłaszała `WebGL not supported`. Wygląd, shadery, wydajność na Pixelu 8 oraz fizyczny 8BitDo wymagają odbioru na urządzeniu. Lista rzeczy do sprawdzenia: [docs/ACCEPTANCE.md](docs/ACCEPTANCE.md). Sklep i biblioteka mają stanowiska mieszkańców przy budynkach, bez osobnych wnętrz. Goście pojawiają się w domu po zaproszeniu; nie przechodzą jeszcze całej trasy przez wioskę. Edytor ma kamerę z góry; po jego zamknięciu wraca kamera zza pleców.

Docelowe modele i animacje: [docs/ASSETS.md](docs/ASSETS.md).

Nie dodano automatycznego wdrażania z `main`. Publikacja na `gh-pages` wymaga osobnej zgody. Samo zapisanie gałęzi roboczej nie aktualizuje działającej gry.

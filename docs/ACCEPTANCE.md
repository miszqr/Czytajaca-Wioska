# Odbiór „Nowego domu Kitka”

## Wyniki automatyczne

| Etap | Wynik | Raport |
| --- | --- | --- |
| P0 | 26 testów i build — OK | `reports/story-P0.md` |
| P1 | 28 testów i build — OK | `reports/story-P1.md` |
| P2 | 34 testy i build — OK | `reports/story-P2.md` |

Test pełnej historii przechodzi wszystkie osiem scen i odtwarza zapis po każdym działaniu. Testy UI sprawdzają ręczne dialogi, listy, dziennik, podgląd mebla, blokowanie kolizji i ustawienie lampy z akcjami pada. Testy geometrii sprawdzają dostępność interakcji, a test sterowania odtworzenie kamery po edytorze. Logi historyczne `P0-1/2/3` dotyczą poprzedniej koncepcji; nie stanowią kryteriów obecnej fabuły.

NullEngine i jsdom nie potwierdzają obrazu na GPU ani działania fizycznego urządzenia. Udostępniona wcześniej przeglądarka zgłaszała `WebGL not supported`. Poniższy odbiór ręczny pozostaje do wykonania na komputerze i telefonie z działającym WebGL.

## Sekret stegozaura

- [ ] Zbierz 3 jabłka i obejdź jeziorko trzy razy z wodą po lewej. Przy płocie koło domu Kitka przejdź przez nowy prześwit. Idź również tuż przy widocznej wodzie: okrążenia mają zaliczać się bez zerowania na suchym brzegu. Licznik i pasek postępu mają być niewidoczne. Dinozaur nie powinien pojawić się przed końcem trzeciego okrążenia.
- [ ] Sprawdź wyjście z morza po wschodniej stronie jeziorka: stegozaur stopniowo wynurza się i dochodzi do plaży, bez nagłego przeskoku i przenikania drzew.
- [ ] Podejdź do zwierzęcia. Nie można wejść w jego tułów; jeśli Kitek stanie na drodze, stegozaur czeka, aż odejdzie.
- [ ] Przy 2 lub 4 jabłkach oraz okrążeniach zgodnych z ruchem wskazówek zegara sekret się nie uruchamia.
- [ ] Otwórz menu w trakcie wynurzania: animacja czeka. Po odświeżeniu strony odkryty stegozaur stoi na plaży, a wszystkie 3 jabłka pozostają w plecaku.
- [ ] „Zacznij nową grę” usuwa zwierzę i pozwala odkryć sekret ponownie.

## P0 — dom i list

- [ ] Uruchom `npm run dev` i otwórz `http://localhost:4173`.
- [ ] Kitek ma futro `#C98755`, niebieskie ubranie, brązowy plecak i ogon. Kamera zaczyna za nim.
- [ ] Strzałki pozwalają iść, cofać i obracać się; ręczna kamera ma pierwszeństwo. WASD/pad/joystick pozostają zależne od kamery.
- [ ] Nie można wejść do wody, przeniknąć przez dom lub utknąć przy płocie.
- [ ] Porozmawiaj z Brunonem na placu. Wypowiedzi zmieniają się dopiero po „Dalej”.
- [ ] Znajdź dom przy stawie z niebieską tabliczką, wejdź, otwórz list na stole.
- [ ] Przeczytaj list ponownie z dziennika, wyjdź na spacer, wróć i odśwież stronę.
- [ ] Po wznowieniu pozycja i lokalizacja są właściwe, a list nadal jest w dzienniku.

## P1 — historia

- [ ] Po liście Fela daje jedną lampę. Kolejna rozmowa nie daje drugiej.
- [ ] W domu użyj miejsca przy łóżku lub „Urządź dom” → Plecak. Ustaw lampę przy łóżku.
- [ ] Odczytaj notatkę na szafce i zapytaj Brunona o klucz.
- [ ] Podnieś skrzynkę przy placu; widać ją przy Kitku. Postaw ją obok grządek.
- [ ] Wróć do Brunona po klucz. Otwórz szafkę w domu, zajrzyj do książeczki.
- [ ] Porozmawiaj z Tolą przy bibliotece i Milusiem przy jego domu.
- [ ] Przekaż po jednym zaproszeniu Brunonowi, Feli i Toli.
- [ ] W domu zadzwoń dzwonkiem: czterej sąsiedzi pojawiają się w wolnych miejscach.
- [ ] Porozmawiaj z gośćmi, przeczytaj nowy wpis w dzienniku, pożegnaj ich dzwonkiem.
- [ ] Można ponownie zaprosić sąsiadów, wyjść z domu i swobodnie spacerować.
- [ ] Przerwij historię w kilku miejscach i odśwież stronę. Żaden klucz, prezent ani zaproszenie nie znika ani się nie powiela.

## P2 — dom i urządzenia

- [ ] Ze schowka wybierz krzesło. Podgląd w pokoju zgadza się z ustawionym meblem.
- [ ] Obróć prostokątny mebel: zmienia się obrys; kolizja i ściany blokują niedozwolone ustawienie.
- [ ] Przesuń mebel, anuluj, schowaj i ustaw ponownie. Własność przedmiotu zostaje zachowana.
- [ ] Nie da się zablokować wyjścia, szafki ani zamknąć Kitka za meblami.
- [ ] Po edycji kamera wraca zza pleców; po przeładowaniu meble stoją tak samo.
- [ ] Dziecko czyta samodzielnie; dialogi, listy i dziennik nie mają przycisków ani skrótów do odsłuchu.
- [ ] Na Pixelu 8 sprawdź pion/poziom, czytelność, dotyk, jednoczesny ruch i kamerę.
- [ ] Na 8BitDo sprawdź A/B/X/Y, oba drążki, D-pad, Start, odłączenie i powrót pada.
- [ ] W edytorze D-pad przesuwa, X obraca, A ustawia, B anuluje podgląd.
- [ ] Sprawdź płynność przez kilka minut przy drzewach, w domu i podczas spotkania.

Nie publikować przed osobną zgodą użytkownika. Modele i animacje pozostają proceduralnymi prototypami.

# Ukryty edytor fabuły

Uruchom komputerową wersję gry z `?editor=story` na końcu adresu, np.
`http://localhost:4173/?editor=story`. Edytor jest również częścią buildu Vite,
więc ten sam parametr działa na GitHub Pages po wdrożeniu nowej wersji.
Nie ma wejścia w menu dziecka. Parametr ukrywa funkcję, nie jest hasłem.

## Typowa praca

1. Wybierz dialog, etap, list lub interakcję. Szukaj po ID albo tekście.
2. Edytuj tekst, odpowiedzi, warunki i skutki w formularzu. Wszystkie warunki
   łączą się przez AND. Większy priorytet dialogu wygrywa. Kolejność etapów
   oraz wariantów celu ma znaczenie: pierwszy pasujący wpis wygrywa.
3. Panel po prawej pokazuje tekst, aktualny cel i diagnozę wariantów. Możesz
   testować odpowiedzi bez chodzenia po świecie; skutki wykonuje prawdziwy
   silnik `choose`, a dziennik pokazuje zmiany stanu.
4. Ustaw lokalizację, flagi, plecak i ukończone etapy. Możesz odblokować
   jednorazowe rozmowy. Zaawansowany stan JSON pozwala zmienić również
   pozycję Kitka, meble, schowek i przeczytane listy.
5. „Zastosuj i testuj” przebudowuje świat z roboczą fabułą i stanem symulatora.
   „Testuj od początku” robi to samo z nowym stanem. Panel ukrywa się,
   a przycisk „Edytor fabuły / Tryb testowy” pozwala wrócić.
6. „Eksportuj zmiany” wskazuje zmienione pliki w `public/content`, pokazuje
   różnice i pozwala skopiować pełną zawartość albo pobrać plik. Podmień go
   pod wskazaną ścieżką w repozytorium, uruchom `npm run check` i zrób commit.
   Eksport nie zawiera postępu testowego.

Zakładka JSON obsługuje wszystkie cztery pliki: story, interactions,
characters i items. Formularze obsługują wszystkie istniejące warunki
oraz skutki. Kotwice interakcji i definicje mieszkańców/przedmiotów edytuje
się przez JSON. Nowe typy mechanik wymagają zmian TypeScript; np. zdarzenie
`place` jest obecnie wywoływane przez mechanikę lampy przy łóżku.

## Szkic i bezpieczne testy

- Szkic zapisuje się lokalnie po zmianach. Można pobrać kopię szkicu i ją
  zaimportować; można także importować cały poprawny ContentPack.
- Cofnij/Ponów zachowuje do 30 ostatnich operacji. Przywrócenie oryginału
  i usunięcie wpisu wymagają potwierdzenia w panelu.
- Walidacja używa `validatePack`, identycznego jak przy wczytywaniu gry.
  Niepoprawny JSON, brakujące referencje, nieznane pola i duplikaty blokują
  zastosowanie oraz eksport plików. Szkic błędnego JSON pozostaje lokalny.
- Po odświeżeniu szkic wraca do panelu, ale trzeba jawnie nacisnąć „Zastosuj
  i testuj”, aby uruchomić go w świecie. Do tego czasu działa opublikowana
  fabuła. Jeżeli bazowe pliki gry zmieniły się, panel wyświetli ostrzeżenie;
  nie wykonuje automatycznego scalania starego szkicu.
- Cała sesja z `?editor=story`, również po ukryciu panelu, korzysta z osobnej
  bazy IndexedDB `czytajaca-wioska-story-editor`, osobnego klucza zapisu
  i osobnego fallbacku localStorage. Nie wczytuje ani nie nadpisuje zapisu
  dziecka. Wyjście do zwykłej gry: usuń parametr i przeładuj stronę.
- Aktualizacja fabuły najpierw zamyka stary świat (zapisując jego pozycję),
  następnie zapisuje nowy stan testowy i tworzy nowy świat. Stary callback
  `dispose` nie może nadpisać pozycji nowego testu.
- Edytor jest ładowany jako oddzielny moduł tylko przy specjalnym parametrze.
  Podczas edycji świat jest wstrzymany, a jego UI ma `inert`. Klawiatura
  edytora nie steruje postacią ani dialogami gry.

## Weryfikacja

Testy modelu obejmują eksport, walidację, szkice, diagnozę reguł i izolację
obu sposobów zapisu. Testy UI sprawdzają zmianę tekstu, blokowanie błędnego
JSON, cofnięcie, eksport, odtworzenie świata, wznowienie szkicu i ochronę
zapisu dziecka. Istniejące testy gry obejmują logikę, UI oraz Babylon NullEngine.

## Graficzny edytor (wersja 1)

Na komputerze otwórz `?editor=story`. Nowa domyślna zakładka „Graf bloczków”
korzysta z React Flow. Stare narzędzia są pod przyciskiem „Formularze”.
Na ekranach poniżej 900 px lub bez precyzyjnego wskaźnika parametr nie otwiera edytora.

- Przeciągnij bloczek z palety albo kliknij jego nazwę. Przeciągaj bloczki,
  łącz kropki wyjść z wejściami. Warunki mają osobne wyjścia TAK/NIE.
- Kliknij bloczek, aby zmienić właściwości. Delete/Backspace usuwa zaznaczony
  bloczek; kliknięty przewód usuwa przycisk „Usuń zaznaczone połączenie”.
- Przesuwaj tło, używaj kółka myszy, kontrolek powiększenia i minimapy.
- „Przykład: jabłka Bruna” przywraca demonstracyjny graf. W jego akcji końcowej
  wybierz etap, który rozmowa ma zakończyć (domyślnie pierwszy etap fabuły).
- Podgląd rozmowy używa kopii bieżącego stanu. Można też wczytać kopię zapisu
  gracza i ustawić testową liczbę jabłek. Po gałęzi NIE rozpocznij rozmowę
  ponownie po zdobyciu jabłek. Nie jest do tego potrzebny cykl w grafie.
- „Testuj graf w grze” zastępuje rozmowę wskazanego celu w odizolowanej sesji.
  Podejdź do Bruna i rozmawiaj jak zwykle. „Przywróć stan sprzed testu” odtwarza
  stan i fabułę sprzed pierwszego testu grafu w tej sesji. Po przeładowaniu
  strony nadal zachowany jest osobny zapis dziecka, ale pamięciowa migawka testu znika.
- Szkic zapisuje się pod kluczem `czytajaca-wioska-graph-v1`. Pobierz JSON jako
  kopię, także przy nieukończonym grafie. Import wymaga kompletnego, poprawnego
  grafu i nie zmienia bieżącego szkicu w razie błędu.

Eksport grafu jest osobnym dokumentem autora; można go przechowywać w repozytorium
(np. `docs/story-graphs/`) i importować do testów. Nie zastępuje `story.json`
i nie aktywuje się automatycznie w zwykłej grze. MVP nie konwertuje dowolnej
istniejącej fabuły do grafu i nie publikuje szkiców z poziomu przeglądarki.

### Format i rozszerzanie

Dokument: `{version:1,id,nodes,edges}`. Węzeł: `{id,type,position:{x,y},data}`.
Połączenie: `{id,source,target,sourceHandle}`. Porty: `next` albo `yes`/`no`.
ID są stabilne podczas edycji, zapisu i importu. Import odrzuca obce pola,
nieznane typy, błędne referencje, duplikaty, cykle, nieosiągalne węzły i brakujące
wyjścia. Limit: 1 MB, 200 węzłów, 400 połączeń. Każdy port ma najwyżej jeden
cel; wiele gałęzi może prowadzić do wspólnego węzła końcowego.

`src/editor/graph.ts` zawiera schemat, walidację i adapter przepływu.
`advanceGraph` zatrzymuje się na dialogu, zwracając zwykły `StoryNode` dla
istniejącego UI. Nie implementuje ponownie skutków gry: korzysta z `matches`
i `applyEffects` z `src/story/engine.ts`. Błędy skutków nie zatwierdzają części
zmian bieżącego kroku. Akcje świata korzystają z istniejącego typu `Effect`
i walidatora `validatePack`; nie wykonują kodu użytkownika.

Aby dodać bloczek, rozszerz `Kind`/`labels`, dozwolone pola w walidatorze,
`createNode`, formularz właściwości i adapter przepływu oraz jego testy.
Aby dodać nową akcję świata, najpierw rozszerz wspólny `Effect`, walidator
zawartości i `applyEffects`, potem formularz. Nowy wyzwalacz (np. licznik
okrążeń jeziorka) powinien dostarczać zdarzenie z istniejącej mechaniki do
adaptera. MVP uruchamia graf przez rozmowę; nie ingeruje w sekret stegozaura.

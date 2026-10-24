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

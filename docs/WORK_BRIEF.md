# Czytająca Wioska — brief implementacyjny dla ChatGPT Work

**Status:** aktualizacja koncepcji fabularnej 2026-10-19; stan implementacji należy sprawdzić w repozytorium, nie zakładać że prace nie ruszyły.  
**Cel:** samodzielna przeglądarkowa gra przygodowo-edukacyjna 3D po polsku dla dzieci ok. 5–8 lat. Inspiracja swobodą eksploracji i przytulnością gier typu Animal Crossing; bez kopiowania chronionych zasobów, postaci czy interfejsu.

## 1. Polecenie dla agenta Work

Przejmij projekt **Czytająca Wioska**. Najpierw przejrzyj istniejące pliki/repozytorium, jeśli zostaną udostępnione, i nie nadpisuj cudzej pracy. Jeżeli repozytorium nie istnieje, załóż nowy projekt. Zaimplementuj pierwszy uruchamialny pionowy wycinek gry, a następnie rozszerzaj go etapami zgodnie z poniższą specyfikacją. Po każdym etapie uruchom build, podstawowe testy i przedstaw stan, ograniczenia oraz sposób uruchomienia. Nie publikuj gry ani nie wdrażaj jej publicznie bez wyraźnej zgody użytkownika. Nie deklaruj gotowych modeli 3D lub animacji, jeżeli są jedynie placeholderami.

## 2. Założenia gry

**NADRZĘDNA ZMIANA WYMAGAŃ:** Nie implementować tradycyjnych ćwiczeń edukacyjnych, quizów, sylab, układania słów, ekranów poprawnych odpowiedzi, punktów za czytanie ani poziomów szkolnych. Dziecko czyta proste zdania, by rozumieć dialogi, listy, wskazówki i zadania w naturalnej fabule. Odbiorca: dziecko czytające już proste teksty. Historia i eksploracja są produktem; czytanie jest narzędziem działania. Ta decyzja ma pierwszeństwo przed starszymi TODO i opisami.

- Kamera zza pleców bohatera (third person), obracana myszą, prawym drążkiem lub gestem.
- Swobodne odkrywanie wioski bez walki, przegrywania, presji czasu i kar za błędy.
- Czytanie służy do realizowania naturalnych celów w świecie: rozmowy, zakupy, listy, pomaganie mieszkańcom.
- Czytanie nie blokuje każdej aktywności: dziecko może spacerować, dekorować dom i odkrywać świat bez zadań.
- Dialogi z dużym tekstem, ręcznym przewijaniem i opcją odsłuchania.
- Sterowanie: WASD + mysz + E (interakcja), gamepad (w tym 8BitDo przez Gamepad API), ekran dotykowy (joystick + kamera + przycisk interakcji).
- Docelowo działanie na desktopie i Androidzie (m.in. Pixel 8); responsywne UI.
- Gra po polsku, zapisywana lokalnie, bez wymogu konta.

## 3. Bohater gracza — zatwierdzony

- **Imię:** Kitek.
- **Gatunek:** lisek, antropomorficzny, porusza się na dwóch łapkach.
- **Główny kolor futra:** `#C98755`.
- **Kolor ubrania:** `#77A8D7` (niebieska tunika/koszulka).
- **Dodatek:** plecak (`backpack`), brązowy, stylizowany, widoczny zza pleców.
- Styl: przyjazny stylizowany 3D, duża głowa, krótkie łapki, duże oczy, wyrazisty puszysty ogon, bez fotorealizmu.
- **Referencja wizualna:** obraz koncepcyjny wygenerowany w rozmowie; jeśli dostępny w środowisku Work, użyj go jako referencji, nie jako gotowego modelu 3D. Plik rozmowy: `a_detailed_character_design_turnaround_and_gamepla.png`.
- Docelowo kreator pozwoli wybrać także królika, misia i kota, kolory i dodatki; jednak pierwszy grywalny prototyp ma skupiać się na Kitku.

### Animacje

MVP: idle, walk, run, turn, talk, pick-up, give, celebrate. Później: sit, sleep, wave. Możliwe proste wtórne animacje uszu i ogona. W prototypie dopuszczalne animacje zastępcze, ale należy je jasno oznaczyć.

## 4. Mapa i świat

Mała wioska o orientacyjnym rozmiarze 100 × 100 jednostek, z drogami, drzewami, płotami, kwiatami, łagodnym terenem i kolizjami. Orientacyjne miejsca:

1. Plac wioski — start i spotkania.
2. Dom Kitka — wnętrze i urządzanie.
3. Sklep Feli — zakupy i czytanie list.
4. Biblioteka Toli — krótkie opowieści, listy, wiadomości i sekrety mieszkańców.
5. Ogród i dom Brunona — rośliny, nasiona.
6. Dom Milusia — listy i przesyłki.
7. Staw — swobodna eksploracja.

Początkowa mapa jest schematyczna, nie należy traktować dokładnego układu z wcześniejszej wizualizacji jako obowiązującego. Przejście przez wioskę powinno trwać ok. minuty spokojnego spaceru. Unikać miejsc, gdzie postać może utknąć lub wpaść do wody.

## 5. Mieszkańcy

- **Bruno**, niedźwiedź-ogrodnik: rośliny, nazwy, nasiona.
- **Fela**, lisica-sklepikarka: towary, listy zakupów.
- **Tola**, sowa-bibliotekarka: krótkie historie, wskazówki i książki związane z fabułą.
- **Miluś**, królik-listonosz: listy, adresaci, paczki.

NPC mają proste stany: idle, spacer, dostępność do rozmowy; nie muszą od razu mieć złożonego harmonogramu dobowego. Interakcja z bliska, ikona nad postacią, automatyczne ustawienie bohatera naprzeciw NPC, stabilna kamera podczas dialogu.

## 6. Czytanie wbudowane w fabułę — zamiast ćwiczeń

**Profil odbiorcy:** dziecko czytające proste zdania, np. „Bruno zgubił klucz. Poszukaj go przy stawie.” Bez testów, ocen, punktów, dopasowywania sylab, uzupełniania słów ani szkolnych ekranów. Nie nazywać zadań „ćwiczeniami”.

**Kanały tekstu:**
- Rozmowy z NPC (1–3 krótkie zdania na ekran; jedna informacja lub prośba naraz).
- Listy i notatki, które niosą informacje potrzebne do dalszych działań.
- Znaki drogowe, etykiety i opisy przedmiotów.
- Dziennik Kitka z krótkim przypomnieniem aktualnego celu, bez automatycznego wskazywania dokładnej trasy.
- Wybory dialogowe służące wyrażaniu intencji, nie testowaniu wiedzy.

**Zasady pisania:** krótkie, naturalne zdania; proste, powtarzające się słownictwo; duży czytelny font, wysoki kontrast, brak presji czasu; ręczne przejście do następnej kwestii. Odsłuch na żądanie, nie automatycznie. Nie blokować gry bez dźwięku/mikrofonu. Postać odpowiada na zachowanie dziecka naturalnym dialogiem: błędny przedmiot skutkuje wskazówką, a nie komunikatem „Źle”. Nie wymagać czytania do swobodnej eksploracji.

**Mechanika historii:** zadania oparte na warunkach świata (odkrycie listu, rozmowa, podniesienie przedmiotu, dostarczenie go, ustawienie mebla, odwiedzenie miejsca). Tekst przekazuje wskazówkę; sukces weryfikuje wykonane działanie, nie odpowiedź w quizie.

## 7. Pierwsza opowieść — „Nowy dom Kitka”

Jedna spójna, łagodna historia zamiast 12 niezależnych zadań edukacyjnych. Podział na 8 odbieralnych scen:

1. **Przyjazd:** Kitek spotyka Brunona na placu. Bruno mówi: „Witaj, Kitku! Twój dom stoi przy stawie. Chodź, pokażę ci drogę.” Cel: dotrzeć do domu. Bruno może wskazać kierunek, lecz nie prowadzi postaci automatycznie.
2. **Nowy dom:** gracz otwiera drzwi, ogląda pusty pokój i znajduje kopertę na stole. Cel: wejść do domu i przeczytać list.
3. **List Feli:** „Cześć, Kitku! Mam coś dla ciebie. Przyjdź do sklepu. Fela.” Cel: znaleźć sklep, porozmawiać z Felą.
4. **Prezent:** Fela mówi: „To lampa do twojego pokoju. Postaw ją przy łóżku.” Gracz odbiera lampę, wraca i ustawia ją w domu. Zmiana wystroju jest nagrodą.
5. **Zamknięta szafka:** gracz znajduje notatkę: „Klucz ma Bruno. Zapytaj go o szafkę.” Cel: znaleźć Brunona, zapytać o klucz.
6. **Pomoc Brunonowi:** Bruno mówi: „Mam klucz. Najpierw pomóż mi przenieść skrzynkę do ogrodu.” Gracz przenosi skrzynkę, dostaje klucz. Nie jest to test czytania, tylko czynność w świecie.
7. **Tajemnica szafki:** gracz wraca, otwiera szafkę; znajduje książeczkę lub zaproszenie prowadzące do Toli i Milusia. Tola wyjaśnia krótką historię przedmiotu, Miluś pomaga dostarczyć zaproszenia.
8. **Pierwsze spotkanie:** gracz zaprasza mieszkańców do domu. Postacie odwiedzają Kitka, a w dzienniku pojawia się krótki wpis. Historia kończy się, lecz swobodna zabawa trwa.

Każda scena: trigger, warunki wejścia, krótki tekst, akcja gracza, warunek zakończenia, trwałe skutki w świecie, fallback/podpowiedź. Można robić przerwy i kontynuować po ponownym uruchomieniu. Zdarzenia idempotentne: ponowna rozmowa nie powiela lampy, klucza ani nagród.

**Warianty dialogowe:** przed wykonaniem zadania — prośba/wskazówka; podczas — przypomnienie; po wykonaniu — naturalna reakcja i możliwość zwykłej rozmowy. NPC nie powtarza w nieskończoność sceny powitalnej. Dialogi prowadzone przez jawne identyfikatory i warunki stanu.

## 8. Przedmioty, plecak, dom

- Plecak: 12 slotów, automatyczne rozmieszczenie.
- Przedmioty użytkowe (np. sok, ser, nasiona, list, paczka, książka) oraz dekoracyjne (np. krzesło, stół, lampa, dywan, łóżko, doniczka).
- Przedmioty użytkowe mogą zostać zużyte przy oddaniu; dekoracyjne pozostają dostępne do ustawiania.
- Docelowo ok. 20 przedmiotów.
- Edytor domu: wybór mebla, podgląd, obrót, ustawienie na siatce, blokowanie nakładania się obiektów.

## 9. Proponowany stos technologiczny

- TypeScript, Vite.
- Babylon.js: świat, kamera, postacie, kolizje, animacje.
- React + HTML/CSS: dialogi, listy, dziennik, menu, ekwipunek.
- JSON / typowane definicje: mieszkańcy, dialogi, przedmioty, sceny fabularne, warunki i skutki.
- IndexedDB: stan świata, ekwipunek, wygląd Kitka, flagi fabularne, przeczytane listy, ustawienie mebli.
- Web Speech API: opcjonalny odsłuch tekstu na żądanie, z fallbackiem; rozpoznawanie mowy nie jest wymaganiem MVP.
- Gamepad API i obsługa dotyku.

Proponowane moduły: `game`, `characters`, `story`, `dialogue`, `quests`, `interactions`, `journal`, `reading-assist`, `inventory`, `housing`, `ui`, `audio`, `persistence`, `data`. Bez `ReadingEngine` i komponentów quizowych.

## 10. Parametry ruchu do pierwszych testów

- Chodzenie: 2.4 jednostki/s.
- Bieg: 4.0 jednostki/s.
- Rozpędzanie: ok. 0.2 s.
- Maks. obrót: 540°/s.
- Odległość kamery: ok. 3.5 jednostki.
- Wysokość celu kamery: ok. 1.0 jednostki.
- Interakcja: promień ok. 2.0 jednostki.

Wszystkie parametry konfigurowalne; kalibracja po testach z dzieckiem. Kamera automatycznie podąża, przy przeszkodach skraca dystans, podczas czytania nie rusza się samoczynnie.

## 11. Etapy i priorytety — odbieralne i grywalne

**P0 — vertical slice:** Kitek, scena wioski, kamera zza pleców, ruch, kolizje, Bruno, dialog, dom i list Feli. Odbiór: od startu można samodzielnie dotrzeć do domu, otworzyć list, dowiedzieć się o sklepie; zapisać i wznowić stan. Kompilacja i test po etapie.

**P1 — pełna pierwsza opowieść:** Fela i sklep, lampa, ustawienie jej w domu, notatka o kluczu, Bruno i skrzynka, szafka, Tola, Miluś, zaproszenia, spotkanie. Odbiór: wszystkie 8 scen możliwe do przejścia bez quizów; dialogi reagują na stan; zadania nie duplikują nagród.

**P2 — swobodna zabawa i oprawa:** dopracowanie NPC, przedmiotów, domu, dodatkowe dekoracje, animacje, opcjonalny odsłuch, gamepad i mobilne sterowanie, optymalizacja. Odbiór: dziecko może bawić się poza główną historią; po ukończeniu opowieści świat nadal działa.

Po każdym etapie: `npm run build`, dostępne testy automatyczne i ręczny scenariusz przejścia; uaktualnić README i TODO; zgłosić ograniczenia. Nie publikować bez zgody.

## 12. Kryteria akceptacji

- Kitek jest liskiem z futrem `#C98755`, ubraniem `#77A8D7` i plecakiem; kamera zza pleców, poprawny ruch i kolizje.
- Tekst w grze jest po polsku, zrozumiały dla dziecka czytającego proste zdania, bez presji czasu i bez automatycznego przewijania.
- Brak minigier sylabowych, quizów, testów, punktów za czytanie, komunikatów o błędnych odpowiedziach i ekranów szkolnych.
- Wskazówki z listów i rozmów prowadzą do działań w świecie 3D; system weryfikuje czynności, nie odpowiedzi tekstowe.
- List od Feli faktycznie prowadzi do sklepu; lampa trafia do plecaka i może stanąć przy łóżku; notatka prowadzi do Brunona i klucza.
- W każdej chwili można przerwać główną historię i swobodnie eksplorować wioskę.
- Dialogi zależą od etapu historii, a ukończone zadania nie uruchamiają się ponownie ani nie duplikują przedmiotów.
- Zapis/odczyt IndexedDB przywraca stan scen, pozycję, ekwipunek, listy i meble.
- Opcjonalny odsłuch tekstu działa, jeśli jest dostępny; brak głosu lub mikrofonu nie blokuje gry.
- Podstawowe sterowanie gamepadem i dotykiem, czytelny interfejs na telefonie.
- Brak publicznego deployu bez zgody.

## 13. Oczekiwane rezultaty pracy agenta

1. Repozytorium z kodem źródłowym i plikami assetów lub jednoznacznie wskazany katalog projektu.
2. README z wymaganiami, komendami instalacji, uruchomienia i budowania.
3. Dokument architektury i schemat danych zadania.
4. TODO podzielone na P0/P1/P2 z informacją o wykonaniu.
5. Działający prototyp do testów; raport build/test i lista znanych ograniczeń.
6. Osobna lista assetów docelowych do przygotowania, z rozróżnieniem placeholderów od gotowych modeli.

**Zasada operacyjna:** nie zakładaj, że poprzedni projekt „Leśny Labirynt” jest częścią tego repozytorium. Czytająca Wioska jest nową, niezależną grą.

## 14. Przykładowy kontrakt danych fabuły (orientacyjny)

```json
{
  "id": "letter_from_fela",
  "prerequisites": ["entered_home"],
  "trigger": {"type": "interact", "target": "letter_on_table"},
  "text": "Cześć, Kitku! Mam coś dla ciebie. Przyjdź do sklepu. Fela.",
  "effects": [{"type": "setFlag", "key": "read_fela_letter", "value": true}],
  "nextObjective": "Porozmawiaj z Felą w sklepie."
}
```

Definicje i silnik mają obsługiwać warunki, jednorazowe skutki, warianty dialogów, trwałość stanu oraz migrację wersji zapisu. Cel w dzienniku ma przypominać prośbę, a nie zastępować samodzielne zrozumienie listu.

## 15. Polecenie aktualizacyjne dla Work

Zaktualizuj istniejący projekt Czytająca Wioska zgodnie z tym dokumentem. Zachowaj zatwierdzony silnik Babylon.js, TypeScript, React, Vite, postać Kitka i kamerę zza pleców. Usuń z planu i implementacji tradycyjne ćwiczenia czytania, a w ich miejsce zaprojektuj i zaimplementuj fabularną opowieść „Nowy dom Kitka”. Zacznij od grywalnego P0, następnie rozwijaj P1 i P2, testując po każdym etapie. Najpierw sprawdź bieżący stan repozytorium; nie nadpisuj istniejącej pracy. Nie publikuj gry bez wyraźnej zgody.

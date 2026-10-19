# Czytająca Wioska — brief implementacyjny dla ChatGPT Work

**Status:** projekt zatwierdzony koncepcyjnie, implementacja jeszcze nierozpoczęta.  
**Cel:** samodzielna przeglądarkowa gra przygodowo-edukacyjna 3D po polsku dla dzieci ok. 5–8 lat. Inspiracja swobodą eksploracji i przytulnością gier typu Animal Crossing; bez kopiowania chronionych zasobów, postaci czy interfejsu.

## 1. Polecenie dla agenta Work

Przejmij projekt **Czytająca Wioska**. Najpierw przejrzyj istniejące pliki/repozytorium, jeśli zostaną udostępnione, i nie nadpisuj cudzej pracy. Jeżeli repozytorium nie istnieje, załóż nowy projekt. Zaimplementuj pierwszy uruchamialny pionowy wycinek gry, a następnie rozszerzaj go etapami zgodnie z poniższą specyfikacją. Po każdym etapie uruchom build, podstawowe testy i przedstaw stan, ograniczenia oraz sposób uruchomienia. Nie publikuj gry ani nie wdrażaj jej publicznie bez wyraźnej zgody użytkownika. Nie deklaruj gotowych modeli 3D lub animacji, jeżeli są jedynie placeholderami.

## 2. Założenia gry

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
4. Biblioteka Toli — sylaby, słowa, historie.
5. Ogród i dom Brunona — rośliny, nasiona.
6. Dom Milusia — listy i przesyłki.
7. Staw — swobodna eksploracja.

Początkowa mapa jest schematyczna, nie należy traktować dokładnego układu z wcześniejszej wizualizacji jako obowiązującego. Przejście przez wioskę powinno trwać ok. minuty spokojnego spaceru. Unikać miejsc, gdzie postać może utknąć lub wpaść do wody.

## 5. Mieszkańcy

- **Bruno**, niedźwiedź-ogrodnik: rośliny, nazwy, nasiona.
- **Fela**, lisica-sklepikarka: towary, listy zakupów.
- **Tola**, sowa-bibliotekarka: sylaby i krótkie historie.
- **Miluś**, królik-listonosz: listy, adresaci, paczki.

NPC mają proste stany: idle, spacer, dostępność do rozmowy; nie muszą od razu mieć złożonego harmonogramu dobowego. Interakcja z bliska, ikona nad postacią, automatyczne ustawienie bohatera naprzeciw NPC, stabilna kamera podczas dialogu.

## 6. System nauki czytania

Oddzielny moduł, niezależny od renderera i silnika zadań. Trzy typy ćwiczeń:

1. **Sylaby** — rozpoznawanie np. `MA` wśród `LA`, `MA`, `TO`.
2. **Wyrazy** — składanie np. `LA` + `TO` → `LATO`.
3. **Rozumienie zdań** — np. „Daj Feli sok.”, wybór właściwego przedmiotu.

Ważne: kontrolowane słownictwo dostosowane do nauki czytania po polsku; początkowy poziom wybierany przez rodzica, podpowiedzi i powtórki, bez ocen dla dziecka. Synteza mowy jako wsparcie, opcjonalne rozpoznawanie mowy później. Brak mikrofonu lub błędy rozpoznawania nie blokują rozgrywki. Zapisuj próby, podpowiedzi i postęp lokalnie.

## 7. Lista 12 zadań MVP

1. Bruno — znajdź `MA` (sylaby).
2. Bruno — ułóż `LATO` (łączenie sylab).
3. Bruno — przynieś mak (czytanie słowa).
4. Fela — znajdź sok (rozumienie słowa).
5. Fela — kup ser i sok (lista).
6. Fela — ułóż nazwę towaru (sylaby).
7. Tola — znajdź pary sylab.
8. Tola — uzupełnij słowo.
9. Tola — przeczytaj krótką historię.
10. Miluś — odczytaj adresata listu.
11. Miluś — dostarcz paczkę.
12. Miluś — przeczytaj zaproszenie.

Zadania są dostępne w większości swobodnie; krótki samouczek jako wyjątek. Definiuj zadania w JSON lub TS data, nie w kodzie UI.

## 8. Przedmioty, plecak, dom

- Plecak: 12 slotów, automatyczne rozmieszczenie.
- Przedmioty użytkowe (np. sok, ser, nasiona, list, paczka, książka) oraz dekoracyjne (np. krzesło, stół, lampa, dywan, łóżko, doniczka).
- Przedmioty użytkowe mogą zostać zużyte przy oddaniu; dekoracyjne pozostają dostępne do ustawiania.
- Docelowo ok. 20 przedmiotów.
- Edytor domu: wybór mebla, podgląd, obrót, ustawienie na siatce, blokowanie nakładania się obiektów.

## 9. Proponowany stos technologiczny

- TypeScript, Vite.
- Babylon.js: świat, kamera, postacie, kolizje, animacje.
- React + HTML/CSS: dialogi, menu, ekwipunek, ćwiczenia.
- JSON / typowane definicje: mieszkańcy, dialogi, przedmioty, zadania, ćwiczenia.
- IndexedDB: stan świata, ekwipunek, wygląd Kitka, postęp nauki, ustawienie mebli.
- Web Speech API: opcjonalna synteza/rozpoznawanie, z fallbackiem i kontrolą wsparcia przeglądarki.
- Gamepad API i obsługa dotyku.

Proponowane moduły: `game`, `characters`, `quests`, `reading`, `inventory`, `housing`, `ui`, `audio`, `persistence`, `data`.

## 10. Parametry ruchu do pierwszych testów

- Chodzenie: 2.4 jednostki/s.
- Bieg: 4.0 jednostki/s.
- Rozpędzanie: ok. 0.2 s.
- Maks. obrót: 540°/s.
- Odległość kamery: ok. 3.5 jednostki.
- Wysokość celu kamery: ok. 1.0 jednostki.
- Interakcja: promień ok. 2.0 jednostki.

Wszystkie parametry konfigurowalne; kalibracja po testach z dzieckiem. Kamera automatycznie podąża, przy przeszkodach skraca dystans, podczas czytania nie rusza się samoczynnie.

## 11. Etapy i priorytety

**P0 — vertical slice (najpierw):** projekt Vite + Babylon + React; mała scena wioski, Kitek (może początkowo placeholder o prawidłowej sylwetce i kolorach), third-person camera, WASD, obrót kamery, gamepad, kolizje, 1 NPC (Bruno), 1 dialog, 1 ćwiczenie `MA`, zakończenie zadania, lokalny zapis. Działający build i instrukcja uruchomienia.

**P1 — fundament rozgrywki:** pozostałe NPC, wszystkie typy ćwiczeń, silnik zadań, 12 zadań, przedmioty i plecak, menu, mobilne sterowanie.

**P2 — dom i oprawa:** wnętrze domu, meble, edytor, poprawione modele i animacje, dźwięki, optymalizacja Android, testy regresji.

Nie blokować gry z powodu braku finalnych assetów. Stosować oryginalne, legalne placeholdery i odnotować ich wymianę w TODO.

## 12. Kryteria akceptacji

- Gra uruchamia się lokalnie w przeglądarce bez logowania.
- Kitek chodzi i obraca się poprawnie względem kamery; kolizje działają.
- Interakcja z NPC pokazuje czytelny dialog; dziecko samodzielnie przewija tekst.
- Ćwiczenia mają jasną informację zwrotną, możliwość powtórki i podpowiedzi.
- Stan zadania i postać są odtwarzane po przeładowaniu strony.
- Gra działa bez mikrofonu.
- UI jest używalne na telefonie; podstawowe sterowanie gamepadem działa.
- Docelowo wszystkie 12 zadań i edytor domu są grywalne.
- Żadna publikacja/deploy bez osobnej zgody.

## 13. Oczekiwane rezultaty pracy agenta

1. Repozytorium z kodem źródłowym i plikami assetów lub jednoznacznie wskazany katalog projektu.
2. README z wymaganiami, komendami instalacji, uruchomienia i budowania.
3. Dokument architektury i schemat danych zadania.
4. TODO podzielone na P0/P1/P2 z informacją o wykonaniu.
5. Działający prototyp do testów; raport build/test i lista znanych ograniczeń.
6. Osobna lista assetów docelowych do przygotowania, z rozróżnieniem placeholderów od gotowych modeli.

**Zasada operacyjna:** nie zakładaj, że poprzedni projekt „Leśny Labirynt” jest częścią tego repozytorium. Czytająca Wioska jest nową, niezależną grą.

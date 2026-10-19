# Czytająca Wioska — P0

Niezależna gra przygodowo-edukacyjna po polsku dla dzieci 5–8 lat. Kitek spaceruje po wiosce, poznaje niedźwiedzia Brunona i pomaga mu znaleźć sylabę **MA**. Bez walki, limitu czasu, ocen i kar za błędy.

**Status:** P0 zaimplementowane, do odbioru na urządzeniu. Źródła znajdują się na gałęzi `main`, a gotowy build do GitHub Pages na `gh-pages`. Włączenie hostingu pozostaje po stronie właściciela repozytorium. Proceduralne modele i animacje są prototypami, nie finalnymi assetami z ilustracji koncepcyjnej.

## Uruchomienie

Wymagane Node.js **24.15+ w gałęzi 24 LTS** (sprawdzono na 24.19; obsługiwane także 22.22.2+ w gałęzi 22 lub 26+), npm i przeglądarka z WebGL. Sklonuj repozytorium:

```sh
git clone https://github.com/miszqr/Czytajaca-Wioska.git
cd Czytajaca-Wioska
```

Następnie (lub po rozpakowaniu archiwum w katalogu projektu):

```sh
npm ci
npm run dev
```

Otwórz `http://localhost:4173`. Nie otwieraj pliku HTML przez `file://`; moduły gry wymagają serwera HTTP.

Pierwszy spacer: wybierz „Ruszamy”, podejdź do Brunona w ogrodzie (po lewej, za placem), naciśnij **E**, przeczytaj dialog i wybierz „Pomogę!”. Wskaż **MA**, odbierz nasionko i wróć do eksploracji. Zadanie można przerwać i do niego wrócić. Po ukończeniu Bruno proponuje ćwiczenie ponownie, bez powielania nagrody.

### Telefon w tej samej sieci Wi-Fi

`npm run dev` udostępnia lokalny serwer również w sieci LAN. Otwórz na telefonie `http://ADRES-IP-KOMPUTERA:4173`. To lokalny test, nie wdrożenie. System może poprosić o zgodę zapory na sieć lokalną. Gamepad API może wymagać bezpiecznego kontekstu HTTPS lub localhost; dotyk i klawiatura nie wymagają mikrofonu. Nie dodano tunelu ani zewnętrznego hostingu.

### Gotowy build

Archiwum P0 zawiera wynik kompilacji `dist/`. W repozytorium wynik kompilacji jest na osobnej gałęzi `gh-pages`; lokalnie wygenerujesz go przez `npm run build`. Można sprawdzić go po instalacji zależności:

```sh
npm run preview -- --port 4173
```

Alternatywnie, jeżeli jest dostępny Python:

```sh
python3 -m http.server 4173 --directory dist
```

W obu przypadkach otwórz `http://localhost:4173`.

### GitHub Pages

Gotowy build jest na gałęzi `gh-pages`, w jej katalogu głównym. Aby samodzielnie uruchomić stronę:

1. Otwórz [Settings → Pages](https://github.com/miszqr/Czytajaca-Wioska/settings/pages).
2. W **Build and deployment → Source** wybierz **Deploy from a branch**.
3. Wybierz gałąź **gh-pages** i folder **/ (root)**, a następnie **Save**.
4. Po zakończeniu wdrożenia otwórz `https://miszqr.github.io/Czytajaca-Wioska/`.

Gałąź `main` zawiera TypeScript i nie jest gotowym buildem strony. Build używa względnych ścieżek (`base: './'`), więc działa pod adresem repozytorium. Plik `.nojekyll` wyłącza przetwarzanie przez Jekyll.

Nie dodano automatycznego wdrażania z `main`. Zmiany kodu wymagają ponownej kompilacji i aktualizacji zawartości `gh-pages`. Po włączeniu Pages każda aktualizacja tej gałęzi będzie publikowana przez GitHub.

## Sterowanie

| Czynność | Klawiatura / mysz | Pad w standardowym mapowaniu | Dotyk |
| --- | --- | --- | --- |
| Przód / tył względem Kitka | ↑ / ↓ | — | — |
| Obrót Kitka z kamerą za plecami | ← / → | — | — |
| Ruch względem kamery | WASD | Lewy drążek | Joystick po lewej |
| Kamera | Przeciągnięcie na świecie | Prawy drążek | Przeciągnięcie na świecie |
| Bieg | Shift | RT / klik lewego drążka | Przełącznik „Bieg” |
| Rozmowa / wybór | E / Enter na przycisku | A, fizyczny dolny przycisk | „Rozmowa” / dotknięcie |
| Wybór w dialogu | Tab / strzałki | D-pad / lewy drążek | Dotknięcie |
| Powrót | Esc | B | Przycisk powrotu |
| Menu | M / Esc | Start | Przycisk menu |
| Odsłuch / podpowiedź | Przyciski na ekranie | X / Y | Przyciski na ekranie |
| Zoom | Kółko myszy | — | — |

Strzałki pozwalają grać bez ręcznego obracania kamery: lewo/prawo obracają Kitka w miejscu lub podczas chodzenia, a góra/dół prowadzą go do przodu/do tyłu bez odwracania przy cofaniu. Kamera obraca się razem z nim. Po ręcznym rozglądaniu wraca płynnie za plecy przy następnym użyciu strzałek. Przeciąganie myszą lub gestem oraz prawy drążek mają pierwszeństwo przed automatycznym podążaniem. WASD, lewy drążek i joystick pozostają zależne od kierunku kamery. Podczas rozmowy kamera i ruch są zatrzymane.

Dla 8BitDo użyj trybu udostępniającego standardowe mapowanie Gamepad API, np. XInput na Windows. Wciśnij przycisk po podłączeniu pada, aby przeglądarka go udostępniła. Oznaczenia liter na urządzeniach w trybie Nintendo mogą różnić się od numerów standardowego mapowania. Fizyczny pad nie był testowany w tym środowisku.

## Zaimplementowane P0

- Vite + TypeScript + React + Babylon.js, nowy projekt i lokalne repozytorium Git.
- Wioska 100 × 100 jednostek: plac, pięć domów z zewnątrz, ogród, staw, ścieżki, drzewa, kwiaty, płoty i łagodne wzniesienia.
- Kitek: futro `#C98755`, tunika `#77A8D7`, brązowy plecak, duże uszy i ogon. Prototypowe animacje bezczynności, chodu, biegu i radości.
- Kamera zza pleców z obrotem, zoomem i skracaniem dystansu przed przeszkodami.
- Strzałki względem postaci z kamerą za plecami; WASD/pad/dotyk względem kamery. Rozpędzanie, ograniczenie obrotu, kolizje i bezpieczne brzegi stawu.
- Bruno, wskaźnik rozmowy z bliska, ustawienie postaci naprzeciw niego i zatrzymanie kamery podczas czytania.
- Ręcznie przewijany dialog i ćwiczenie „MA” z podpowiedzią, spokojną informacją zwrotną i opcjonalnym odsłuchem.
- Jednorazowa nagroda, powtórka ćwiczenia i swobodne spacerowanie po zadaniu.
- Lokalny zapis pozycji, kamery, powitania, statusu zadania, prób, podpowiedzi i nagrody.
- Podstawowy pad i dotyk już w P0; ich pełna kalibracja na urządzeniach pozostaje do odbioru.

## Zapis i prywatność

IndexedDB, baza `czytajaca-wioska`, wersja 1. Brak konta, serwera gry, analityki i dostępu do mikrofonu. Zapis następuje co około 2 sekundy podczas spaceru oraz po działaniach w zadaniu i ukryciu strony. Przeglądarka nie gwarantuje dokończenia zapisu przy nagłym zamknięciu procesu; może zniknąć ostatni fragment ruchu.

Gdy IndexedDB jest niedostępne, gra próbuje localStorage. Jeśli oba mechanizmy są zablokowane, pokazuje informację o braku trwałego zapisu i pozwala grać. Zapis jest przypisany do przeglądarki i adresu strony; inny port/adres oznacza osobny zapis. Czyszczenie danych witryny usuwa postęp.

Odsłuch używa głosu systemowego `pl-PL`, jeśli jest dostępny. Jakość i dostępność polskiego głosu zależą od urządzenia; przy braku API przycisk odsłuchu jest nieaktywny. Całe zadanie działa bez mowy.

## Budowanie i testy

```sh
npm test
npm run build
npm run check
```

Raporty kolejnych etapów znajdują się w `reports/`. Testy domeny obejmują próby, nagrodę i rzeczywiste operacje IndexedDB (fake-indexeddb). Testy geometrii używają natywnego Babylon `NullEngine`; nie renderują obrazu na GPU. Test interfejsu uruchamia React w jsdom z zastąpionym rendererem i przechodzi całą pętlę zadania wraz z ponownym otwarciem gry.

**Ograniczenie weryfikacji:** podgląd aplikacji uruchamia się, ale udostępniona przeglądarka zgłasza `WebGL not supported`. Wygląd, kompilacja shaderów na GPU, płynność na Pixelu 8 oraz fizyczny gamepad wymagają testu na urządzeniu. Przejście testów Node nie potwierdza tych aspektów.

## Pliki projektu

- `src/game/` — świat, wejście, ruch, kamera i integracja Babylon.js.
- `src/characters/` — oryginalne modele proceduralne i animacje prototypowe.
- `src/reading/` — ćwiczenia niezależne od renderera.
- `src/quests/`, `src/data/` — stan zadania i typowane definicje treści.
- `src/persistence/` — wersjonowany zapis i walidacja.
- `src/ui/`, `src/audio/` — interfejs React, dotyk i opcjonalny odsłuch.
- `docs/ARCHITECTURE.md`, `docs/quest.schema.json` — architektura i kontrakt zadania.
- `TODO.md`, `docs/ASSETS.md`, `docs/ACCEPTANCE.md` — następne etapy, assety i odbiór.
- `docs/WORK_BRIEF.md`, `docs/references/kitek-concept.png` — specyfikacja i dostarczona referencja.

Archiwum przekazania zawiera też `repository.bundle` z historią lokalnego Git. Aby uzyskać pełne repozytorium z commitami:

```sh
git clone repository.bundle czytajaca-wioska-repo
cd czytajaca-wioska-repo
npm ci
npm run dev
```

Repozytorium: [miszqr/Czytajaca-Wioska](https://github.com/miszqr/Czytajaca-Wioska). Kod i build są przygotowane do GitHub Pages; włączenie hostingu wykonuje właściciel repozytorium zgodnie z instrukcją powyżej.

## Dopracowanie roślinności — do odbioru

Dodano dęby, jabłonie, brzozy i sosny z gałęziami, korzeniami i nieregularnymi koronami, a także krzewy, kępki trawy i płatki kwiatów. [Zobacz porównanie geometrii modeli](docs/previews/vegetation.webp). Obraz powstał przez programowy render modeli z kodu, w osobnym oświetleniu porównawczym; nie jest zrzutem gry.

Zmiana jest przygotowana na osobnej gałęzi `feat/vegetation-detail`. GitHub Pages pozostaje przy opublikowanej poprawce kamery, do czasu zatwierdzenia nowej grafiki. Szczegóły i ograniczenia: [raport weryfikacji](reports/vegetation-detail.md).

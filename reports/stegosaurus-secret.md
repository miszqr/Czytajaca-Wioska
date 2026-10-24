# Sekret stegozaura — 2026-10-24

Baza: `48c5c14` (poprawka drzwi, zawierająca edytor fabuły). Gałąź: `feat/stegosaurus-secret`.

## Zachowanie

- Trzy pełne okrążenia jeziorka przeciwnie do ruchu wskazówek zegara, z dokładnie trzema jabłkami przez całą serię, odkrywają sekret. Inne przedmioty mogą pozostać w plecaku. Schowek się nie liczy; jabłka nie są zużywane.
- Licznik sumuje rzeczywisty kąt przemieszczania wokół elipsy jeziorka. Cofanie odejmuje kąt; obracanie w miejscu i oscylowanie nie nabijają postępu. Odejście, przejście przez wodę, teleport, wejście do domu lub zmiana liczby jabłek resetują serię. Pauza zachowuje postęp, zamknięcie gry go zeruje.
- Końcówka płotu przy domu Kitka została skrócona o 2 m, żeby zostawić prześwit przy suchym brzegu. Test szuka przechodniej trasy między rzeczywistymi kolizjami i wykonuje trzy pełne obiegi.
- Stegozaur powstaje dopiero po odkryciu. Proceduralny model ma około 9 m długości i 4 m wysokości, 17 naprzemiennych płyt, cztery kolce ogona i cztery animowane nogi. Rigid części są łączone według materiału i przegubu; cały model ma mniej niż 30 siatek.
- Wyjście z morza po wschodniej stronie jeziorka trwa 24 sekundy aktywnej gry. Zwierzę podąża za spadkiem plaży, zatrzymuje się przed Kitkiem i pozostaje na brzegu. Kolizje i przeszkody kamery obejmują odkryte zwierzę. Menu i nieaktywna scena wstrzymują animację. Ograniczenie ruchu wyłącza kołysanie i ruch nóg.
- Flaga `stegosaurus-awakened` zapisuje się natychmiast razem z bieżącą pozycją. Wznowienie ustawia stegozaura na plaży; nowa gra usuwa odkrycie. Format zapisu v3 i izolacja zapisów edytora pozostają zachowane.

## Weryfikacja

- 93 testy w 16 plikach — OK, w tym 14 nowych przypadków dotyczących sekretu, modelu, trasy i zapisu z UI.
- `NODE_OPTIONS=--max-old-space-size=6144 npm test -- --run tests/controls.test.ts` — 20/20.
- `NODE_OPTIONS=--max-old-space-size=6144 npm test -- --exclude tests/controls.test.ts --maxWorkers=2` — 73/73.
- `npm run build` — walidacja treści, TypeScript i Vite OK.
- `npm run test:build` — start rzeczywistych modułów produkcyjnych i montowanie UI OK.
- `git diff --check` — OK.

Domyślne uruchomienie wszystkich testów wyczerpało 2 GB sterty Node w istniejącym pliku `controls.test.ts`; kompletny zestaw zweryfikowano powyższymi poleceniami ze zwiększonym limitem. Nie zmieniano produkcyjnej konfiguracji ani zależności.

Weryfikacja geometrii i sceny wykorzystuje Babylon NullEngine, bez oceny renderingu GPU. Odbiór wizualny modelu i chodu pozostaje do wykonania na urządzeniu użytkownika według `docs/ACCEPTANCE.md`. Zgodnie z `AGENTS.md` nie ponawiano prób w przeglądarce bez WebGL. Build jest przygotowany; nie publikowano nowej wersji na `gh-pages`.

Skala: https://www.nhm.ac.uk/discover/dino-directory/Stegosaurus.html (długość 9 m); https://www.amnh.org/exhibitions/dinosaurs-ancient-fossils/display-or-defense/colorful-display (wysokość 4 m). Geometria i animacja są własnym stylizowanym modelem, nie rekonstrukcją paleontologiczną.

# Drewniane domki mieszkańców — 2026-10-21

Domy Kitka, Brunona i Milusia korzystają z nowego modelu proceduralnego
`src/game/storybook-cottage.ts`, zgodnego ze stylem sklepu Feli: bale z widocznymi
końcami i słojami, kamienne podmurówki, wygięte okapy, osobne gonty, zaokrąglone
drzwi, okiennice, okrągłe okna poddasza, latarnie i skrzynki z kwiatami.

- Kitek: ciepły dach, niebieskie drzwi i okiennice, niebieska tabliczka nad wejściem.
- Bruno: zielone akcenty, rozległe płaty mchu, zwisający mech przy okapie,
  doniczki z ziołami oraz pnącze na kratce.
- Miluś: szarobrązowy dach, mniejsze płaty mchu, ceglaste drzwi i znak koperty.

Mech jest geometrią dopasowaną do profilu dachu. Kolory są zapisane w wierzchołkach;
modele korzystają ze wspólnego białego materiału i dotychczasowego łączenia siatek.
Położenia, obrysy kolizji i punkty interakcji fabularnych zachowano. Płaskie stopnie
tylko odbierają cienie, zgodnie z wcześniejszą poprawką artefaktów na chodnikach.

## Weryfikacja

`npm run check`: 46 testów w 8 plikach, walidacja treści, TypeScript,
build produkcyjny i test uruchomienia zakończone powodzeniem.
Nowe testy sprawdzają trzy modele, skończone współrzędne i normalne, budżety
geometrii, ściany/połacie osłaniające kamerę, dotychczasowe kolizje, wejście Kitka
i miejsce Milusia. Istniejące testy obejmują sterowanie, zapis i osiągalność zadań.

Rendery CPU rzeczywistej geometrii sprawdzono z przodu i z tyłu.
Nie są to zrzuty WebGL ani pomiar płynności na telefonie.

| Model | Trójkąty |
| --- | ---: |
| Kitek | 13 044 |
| Bruno | 14 168 |
| Miluś | 13 176 |

Cała scenografia: 403 160 trójkątów (poprzednio 370 536, wzrost o 8,8%).
Liczba scalonych siatek scenografii: 36 (poprzednio 54).
Są to pomiary geometrii, a nie gwarancja określonego FPS.

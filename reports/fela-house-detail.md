# Drewniana chatka Feli — 2026-10-20

Baza porównania: `e1c551c6b961a3e5aa587e58d3472464a55be7cc`.

## Model

Zastąpiono wyłącznie budynek `Sklep Feli` w `(10, 9)`. Nowy model jest inspirowany drewnianą chatką z ilustracji użytkownika: poziome bale i przekroje ze słojami, stromy dach z załamanym profilem okapów i 192 oddzielnymi gontami, osłony krawędzi dachu, okrągłe okno strychowe, zielone okiennice, kwietniki, zaokrąglone drzwi, zawiasy, klamka, geometryczny szyld FELA, latarenka, ganek ze schodkami i jasny murowany komin. Detale wykonano z geometrii, bez użycia ilustracji jako tekstury.

Model tworzy `src/game/fela-house.ts`. Geometria jest statyczna, scalana przy tworzeniu wioski. Kolor wierzchołków pozwala współdzielić istniejący biały materiał otoczenia. Drobne kwiaty korzystają z dwudziestościanów zamiast gęstych sfer. Brak nowych tekstur, bibliotek, animacji, cieni i dodatkowych świateł.

## Pomiar struktury sceny

| Metryka | Przed | Po |
| --- | ---: | ---: |
| Trójkąty domu | 2 584 | 17 860 |
| Trójkąty scalonego otoczenia wioski | 315 408 | 330 684 |
| Partie geometrii otoczenia | 57 | 55 |
| Wierzchołki całej sceny wioski | 526 429 | 557 642 |
| Drzewa | 81 | 81 |

Otoczenie ma o 4,84% więcej trójkątów. Liczba partii spadła, ponieważ usunięto dwa materiały starego domu, a nowy korzysta z istniejących partii. To pomiar geometrii w Babylon NullEngine, nie pomiar czasu klatki ani FPS na urządzeniu.

## Weryfikacja

`npm run check` zakończyło się kodem 0: **42 testy w 8 plikach**, walidacja treści, TypeScript, build Vite i produkcyjny test startu grafu modułów. Wynik: `reports/fela-house-check.txt`.

Test domu sprawdza budżet poniżej 20 tys. trójkątów, współdzielenie materiału, kompletne i skończone atrybuty wierzchołków, promienie trafiające w ścianę oraz dach, kolizje budynku i ganku, a także wolną trasę spaceru Feli. Test świata potwierdza dostępność wszystkich interakcji i poprawne scalanie geometrii. Istniejące testy sterowania i fabuły przeszły bez zmian.

Obejrzano programowy render dokładnej geometrii budynku od frontu i od tyłu. Obraz `docs/previews/fela-house.webp` jest porównaniem modeli z kodu, nie zrzutem gry. Oświetlenie i miękki cień pod modelem służą tylko prezentacji. Renderowania WebGL oraz płynności na telefonie nie zweryfikowano w tym środowisku.

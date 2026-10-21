# Wioska na wyspie — 2026-10-21

Wioskę otacza morze. Nieregularna linia brzegowa, piaszczysta plaża i łagodne
obniżenie terenu zastępują kwadratową granicę świata. Środek wyspy zachowuje
dotychczasową wysokość: domy, staw, ogród i obiekty fabuły pozostały na miejscu.

## Teren i poruszanie

- `island-terrain.ts` definiuje wspólny obrys wyspy, poziom morza i wysokość
  używaną przez siatkę terenu, postacie, kamerę oraz dekoracje.
- Zbocze zaczyna się 35,5 jednostki od środka. Poziom morza to −1,5.
  Przejście jest gładkie, bez stopni i klifów. Test próbkowanego nachylenia
  obejmuje cały brzeg i wymaga spadku poniżej 0,42 (około 23 stopni).
- Kitek i mieszkańcy zatrzymują się na piasku przed wodą. Ścieżki kończą się
  na plaży. Cztery dojścia są osiągalne od miejsca startu.
- Drzewa zachowują wcześniejsze położenia wewnątrz wyspy; egzemplarze na plaży
  i poza nową linią brzegową pominięto. Wnętrze domu nadal ma osobną scenę.
- Format zapisu pozostaje zgodny. Istniejąca kontrola bezpiecznego startu
  przenosi postać na punkt startowy, jeśli stary zapis umieszcza ją teraz w morzu.

## Morze i wydajność

Morze to jedna nieprzezroczysta siatka z dwoma trójkątami i proceduralnym
shaderem: turkusowe płycizny, delikatne fale, pasma piany i odblask słońca.
Nie używa tekstur ani dodatkowych renderów odbicia. Uwzględnia kolor mgły
z istniejącego oświetlenia i preferencję ograniczenia animacji.
Pozostaje poza scalaniem scenografii, kolizjami kamery i mapą cieni.
Siatka terenu ma 140 × 140 pól, żeby płynnie odwzorować łagodne zejścia.

## Weryfikacja

`npm run check`: 49 testów w 9 plikach, walidacja treści, TypeScript,
build produkcyjny i test uruchomienia zakończone powodzeniem.
Sprawdzono obwód wyspy, długie ruchy w kierunku morza, wysokości i normalne
rzeczywistej siatki, zgodność zbocza z chodzeniem oraz dojścia do zadań i plaż.

Podgląd CPU służy do oceny geometrii wyspy. Nie odtwarza animowanego shadera
morza ani pełnego oświetlenia WebGL. Płynność na telefonie nie była mierzona.

# Edycja opowieści i zachowań

Treści są w `public/content/`. Gra pobiera cały pakiet JSON przy uruchomieniu i waliduje go przed rozpoczęciem zapisu. Poprawki tekstów nie wymagają zmian w React ani rekompilacji JS, lecz do wersji publicznej muszą zostać wdrożone. Sam commit na `main` nie publikuje gry.

| Plik | Zawartość |
| --- | --- |
| `manifest.json` | Ścieżki do czterech plików pakietu |
| `story.json` | Sceny, cele dziennika, listy i warianty dialogów |
| `characters.json` | Mieszkańcy, modele, pozycje i zachowania |
| `interactions.json` | Drzwi, koperty, drogowskazy, obiekty i warunki widoczności |
| `items.json` | Przedmioty, opisy, wygląd i wymiary |

## Dialog i skutki

Każdy `node` ma trwałe `id`, cel `target`, zdarzenie (`interact` lub `place`), priorytet, warunki `when`, wypowiedzi `lines` i wybory `choices`. Wyższy priorytet wygrywa. `once: true` wyłącza węzeł po wybraniu akcji. Zwykły dialog z niższym priorytetem działa jako przypomnienie lub codzienna rozmowa.

Przykład działania przy kopercie:

```json
{
  "id": "read-fela-letter",
  "target": "fela-letter",
  "event": "interact",
  "priority": 10,
  "once": true,
  "when": [],
  "speaker": "List od Feli",
  "lines": ["Cześć, Kitku! Mam coś dla ciebie.", "Przyjdź do sklepu. Fela."],
  "choices": [{
    "id": "keep",
    "label": "Zachowam ten list.",
    "effects": [
      {"type": "flag", "key": "read-fela-letter", "value": true},
      {"type": "read", "documentId": "fela-letter"},
      {"type": "complete", "sceneId": "home"}
    ]
  }]
}
```

To fragment tablicy `story.nodes`, nie cały plik. Dodatkowo zdefiniuj dokument w `story.documents` oraz obiekt `fela-letter` w `interactions.json`. Wypowiedź to 1–3 krótkie zdania, maksymalnie 400 znaków. Napisy wyborów wyrażają zamiary; nie wprowadzamy poprawnych/błędnych odpowiedzi.

Warunek flagi: `{"type":"flag","key":"read-fela-letter","value":true}`. Warunek posiadania: `{"type":"item","itemId":"lamp","quantity":1}`. Lista warunków działa jak AND. Dla alternatywnych warunków przygotuj osobne węzły. Flagi wymagają źródła w skutkach, aby literówka nie tworzyła niemożliwego zadania.

Dostępne skutki: `flag`, `giveItem`, `takeItem`, `read`, `complete`, `travel`, `placeFurniture`. Efekty stosuje silnik atomowo. `read` przechowuje ID listu w dzienniku; `complete` trwały wpis sceny. Nie dodawaj tego samego prezentu do zwykłej powtarzanej rozmowy — przekazanie prezentu powinno mieć własne ID i `once: true`.

## Trwałe ID

Tekst, tytuł, cel i podpowiedź można poprawiać bez zmiany ID. Zmienianie ID wykonanego węzła tworzy nową akcję i może ponownie udostępnić prezent. Nowe ID stosuj tylko dla faktycznie nowej sceny. Nie zmieniaj ID przedmiotu tylko po to, aby zmienić jego nazwę.

Zapis nie wyciąga skutków ponownie z tekstu ani z aktualnych definicji. Już wykonane działania pozostają wykonane, także po poprawce dialogu. Usunięte chwilowo flagi i wpisy nie są automatycznie czyszczone z zapisu.

## Mieszkańcy

`idle` oznacza stanie. `patrol` definiuje spacer po punktach:

```json
{
  "type": "patrol",
  "speed": 0.6,
  "pauseSeconds": 2,
  "waypoints": [{"x": 8, "z": 4.8}, {"x": 11.5, "z": 4.8}]
}
```

Prędkość jest w jednostkach/s, a `position.heading` w radianach. Postać zatrzymuje się w pobliżu Kitka i podczas dialogu. Trasa uwzględnia kolizje; po utknięciu próbuje kolejnego punktu. To nie jest pełny system wyznaczania drogi. Wybieraj punkty na otwartym terenie. Po odświeżeniu NPC wraca do pozycji początkowej.

Nowe zachowanie, np. praca w ogrodzie, wymaga handlera w `src/game/npc.ts`, typu i walidacji w `src/content/`. JSON zawiera parametry i wybór zachowania, a nie wykonywalny skrypt. Tak samo nowy model wymaga kodu modelu lub przyszłego adaptera glTF.

## Kontrola zmiany

```sh
npm run content:check
npm run check
npm run dev
```

Walidator odrzuca nieznane pola, brakujące ID, nieistniejące cele i dokumenty, niepoprawne wartości oraz powtarzające się priorytety dla tego samego celu. Pozycje trzeba dodatkowo sprawdzić w świecie; sama składnia JSON nie gwarantuje dostępności drogi.

Testuj zmianę z nowym zapisem oraz wznowieniem przed i po zmienionej scenie. Format zapisu jest wersjonowany oddzielnie od danych fabuły. Stary zapis przed migracją ma zachowaną kopię.

## Cele pośrednie i dokumentacja formatu

Scena może mieć `updates`: listę alternatywnych celów dziennika z warunkami. Wygrywa pierwszy pasujący wpis. Przykład: po odłożeniu skrzynki cel zmienia się z prośby o przeniesienie na „Wrócę do Brunona po klucz”. Służy to przypomnieniu, nie wyznaczaniu trasy.

Schemat dla edytora to `docs/story.schema.json`, wskazany przez `$schema` w `story.json`. Referencja służy lokalnej edycji; przeglądarka gry nie pobiera schematu. Silnik nadal wykonuje własną walidację referencji między plikami.

`anchor` w interakcji może wskazywać mebel, np. `{"itemId":"table","x":0,"z":0}`. Pozycja podąża wtedy za przesuwanym i obracanym meblem. Gdy mebel trafi do schowka, jego interakcja znika; przeczytane listy pozostają dostępne w dzienniku.

## Dekoracje

Przedmiot z `kind: "decoration"` ma `model`, kolor `#RRGGBB`, `width` i `depth`. Wymiary określają obrys używany przy ustawianiu. Dostępne modele: łóżko (`bed`), stół (`table`), lampa (`lamp`), krzesło (`chair`), dywan (`rug`), roślina (`plant`), półka (`shelf`). Warianty kolorów i wielkości można dodać w JSON. Nowy typ geometrii wymaga handlera w `game/story-world.ts` oraz rozszerzenia typu i walidatora.

Startowy zestaw w schowku jest tworzony raz: zawiera dekoracje poza łóżkiem, stołem i fabularną lampą. Dodanie nowej dekoracji do katalogu nie rozdaje jej automatycznie w starszym zapisie, który odebrał już zestaw. Dla istniejących graczy dodaj jednorazowe przekazanie przez dialog albo świadomą migrację. Nie kasuj flagi zestawu w celu poprawienia tekstu.

W tej historii `lamp`, `bed`, `table` oraz `bedside` mają znaczenie dla związku mebli z fabułą. Zachowaj ich ID. Przy tworzeniu całkiem nowej historii należy również uogólnić lub zmienić handler sprawdzający lampę przy łóżku w `story/engine.ts` i skrót do edytora w `ui/App.tsx`. Sam tekst nie zmienia reguły odległości.

Plecak mieści 12 typów przedmiotów, po kilka sztuk tego samego typu. Schowek pozwala odłożyć dekorację bez jej usuwania. Przedmioty fabularne nie są wyrzucane przez edytor. W P2 jest 20 typów przedmiotów: 14 dekoracyjnych i 6 użytkowych/pamiątkowych.

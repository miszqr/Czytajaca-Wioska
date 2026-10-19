# Jak zmieniać zadania, teksty i zachowania postaci

Treści gry są w **`public/content/`**. Gra pobiera JSON przy uruchomieniu, a wspólny walidator sprawdza dane w przeglądarce i przed budowaniem. Nie trzeba zmieniać komponentów React, aby poprawić dialog, odpowiedzi lub nagrodę.

| Co zmieniasz | Plik |
| --- | --- |
| Lista wczytywanych zadań | `public/content/manifest.json` |
| Dialog Brunona, wybór MA, podpowiedź, nagroda | `public/content/quests/bruno-ma.json` |
| Dialog Feli, składanie MASŁO, podpowiedź, nagroda | `public/content/quests/fela-maslo.json` |
| Imiona, role, modele, pozycje i trasy NPC | `public/content/characters.json` |
| Nazwy i ikony przedmiotów | `public/content/items.json` |
| Dostępne typy danych | `src/content/types.ts` |
| Nowe reguły zachowania postaci | `src/game/npc.ts` |
| Nowe mechaniki zadań i nagród | `src/reading/model.ts`, `src/quests/engine.ts` |

JSON nie obsługuje komentarzy ani przecinka po ostatnim elemencie. Pliki zapisuj jako UTF-8. Zmiana tekstu staje się widoczna po odświeżeniu gry, nie w środku trwającej rozmowy.

## Szybka poprawka tekstu

Otwórz `public/content/quests/fela-maslo.json` i zmień np. `dialogue.intro`, `exercise.prompt`, `exercise.hint` lub `feedback.retry`. Każdy wpis tablicy dialogu to jedna wypowiedź przewijana przyciskiem „Dalej”.

- `intro` — pierwsza rozmowa o tym zadaniu.
- `active` — powrót do poznanego, niedokończonego zadania, także po przerwaniu rozmowy.
- `completed` — rozmowa po zdobyciu nagrody, z propozycją powtórki.
- `acceptLabel`, `replayLabel` — napisy przycisków przyjęcia zadania i powtórki.
- `feedback.retry`, `success`, `practice` — odpowiedź na błąd, pierwsze ukończenie i udaną powtórkę.

Napisy technicznego interfejsu, np. „Plecak” i „Cofnij sylabę”, pozostają w komponentach UI. Ten etap oddziela treści zadań i mieszkańców, nie wprowadza jeszcze pełnego systemu tłumaczeń.

## Dodaj zadanie przez skopiowanie pliku

1. Skopiuj jedno z istniejących zadań do `public/content/quests/`, np. `fela-mama.json`.
2. Zmień `id` na `fela-mama` i `exercise.id` na `build-mama`; ustaw `revision: 1`. ID używają małych liter bez polskich znaków, cyfr i myślników. Teksty wyświetlane mogą zawierać polskie znaki.
3. Ustaw `npcId` na istniejącą postać, np. `fela`. Zmień tytuł, opis, wszystkie dialogi, ćwiczenie i nagrodę.
4. Dopisz `"quests/fela-mama.json"` do listy `quests` w `manifest.json`.
5. Uruchom `npm run content:check`, następnie `npm run check` i przejdź zadanie w grze.

Kilka zadań tej samej postaci pojawi się na liście wyboru po rozpoczęciu rozmowy. Kolejność wynika z manifestu. Domyślnie `requires: []` pozwala podejść do dowolnego mieszkańca. Aby udostępnić nowe zadanie dopiero po Brunonie, użyj:

```json
"requires": ["bruno-ma"]
```

Wymagane zadania muszą być ukończone. Walidator odrzuca brakujące ID oraz cykle, np. A wymaga B, a B wymaga A.

Nie kopiuj samych dialogów bez zmiany ID: postęp i jednorazowa nagroda należą do **ID zadania**, nie jego nazwy ani nazwy pliku.

## Dwa gotowe rodzaje ćwiczeń

Wybór jednej sylaby:

```json
{
  "id": "find-ma",
  "type": "syllable-choice",
  "prompt": "Znajdź sylabę MA.",
  "target": "MA",
  "choices": ["LA", "MA", "TO"],
  "hint": "Poszukaj liter M i A obok siebie."
}
```

Składanie słowa z oddzielnych kafelków:

```json
{
  "id": "build-mama",
  "type": "syllable-build",
  "prompt": "Ułóż słowo MAMA.",
  "target": "MAMA",
  "targetParts": ["MA", "MA"],
  "choices": ["MA", "LA", "MA"],
  "hint": "Wybierz dwa kafelki MA."
}
```

To fragment pola `exercise`, nie całe zadanie. `targetParts` określa kolejność i liczbę miejsc. Każdą sylabę trzeba umieścić w `choices` odpowiednią liczbę razy; dwóch miejsc nie można wypełnić tym samym kafelkiem. Dziecko może cofnąć sylabę, zacząć układanie od nowa i ponawiać próby bez limitu czasu. Kafelki nie są losowane w tym etapie.

Obsługiwane limity: 2–8 kafelków, do 12 znaków na kafelek, 2–6 części składanego słowa. Wielkość liter i polskie znaki w odpowiedziach muszą być zgodne. Czytelność i poprawność językową treści ocenia autor — walidacja sprawdza ich strukturę, nie dydaktykę.

## Przedmioty i nagrody

Przedmiot w `items.json`:

```json
{"id": "apple", "name": "Jabłko od Feli", "icon": "apple"}
```

Odwołanie do niego w zadaniu:

```json
"reward": {"itemId": "apple", "quantity": 1}
```

Dostępne ikony: `seed`, `apple`. Inne wymagają dodania ikony i rozszerzenia typu oraz walidacji. Nagrodę przyznaje silnik tylko raz na ID zadania. Powtórka, poprawka tekstu, zwiększenie rewizji ani zmiana samej definicji nagrody nie przyznają jej drugi raz.

Plecak ma 12 miejsc na **różne typy przedmiotów**; sztuki tego samego typu są sumowane. Na razie są dwa typy: nasionko maku i jabłko. Oglądanie plecaka działa; przekazywanie, zużywanie, usuwanie przedmiotów i dekorowanie domu są kolejnymi etapami. Przy pełnym plecaku silnik zachowuje nieodebraną nagrodę — po zwolnieniu miejsca poprawne powtórzenie zadania może ją przyznać. Obecna zawartość nie zapełnia plecaka.

## Zachowanie mieszkańców

Postacie korzystają z gotowych zachowań opisanych danymi. Przykład Feli:

```json
{
  "id": "fela",
  "name": "Fela",
  "role": "Sklepikarka",
  "model": "fela",
  "position": {"x": 9, "z": 4.8, "heading": 3.14159},
  "behavior": {
    "type": "patrol",
    "speed": 0.6,
    "pauseSeconds": 2,
    "waypoints": [{"x": 8, "z": 4.8}, {"x": 11.5, "z": 4.8}]
  }
}
```

- `idle` — postać stoi: `"behavior": {"type": "idle"}`.
- `patrol` — postać odwiedza kolejne punkty i wraca do pierwszego. `speed` jest w jednostkach świata na sekundę; `heading` w radianach. Wysokość Y wynika z terenu.
- Spacer zatrzymuje się, gdy gracz jest bliżej niż 3 jednostki, a także przy otwartym dialogu lub menu. Rozmowa obraca mieszkańca w stronę Kitka.
- Ruch korzysta z kolizji świata. Po ponad 3 sekundach utknięcia postać czeka i próbuje następnego punktu. To prosta trasa, bez wyznaczania drogi wokół budynków: dobieraj punkty na otwartym terenie.
- Po ponownym uruchomieniu NPC wraca do `position`; jego chwilowa pozycja na trasie nie jest zapisywana. Pozycja Kitka jest zapisywana.

Dostępne modele to `bruno` i `fela`. Można przypisać im inne ID, imiona i dialogi, ale nowy wygląd wymaga modelu w kodzie lub przyszłego importu glTF. Zmiana JSON nie stworzy nowego modelu zwierzęcia.

**Nowe zachowanie**, np. praca w ogródku, powitanie gestem czy chodzenie za graczem, dopisujemy jako handler TypeScript, a jego parametry udostępniamy w JSON. Miejsca zmiany: `content/types.ts`, `content/validate.ts`, `game/npc.ts` oraz ewentualnie animacje w `characters/models.ts`. Nie ma wykonywania skryptów JS wpisanych do plików treści. Pozwala to zachować kontrolę nad zapisem, kolizjami i pauzą.

## Wersje treści i stary zapis

`version: 1` oznacza format pliku zadania. `revision` oznacza rewizję konkretnego ćwiczenia.

| Zmiana | Co zrobić | Skutek dla zapisu |
| --- | --- | --- |
| Literówka, dialog, tytuł, podpowiedź | Zachowaj ID i rewizję | Dotychczasowe próby i nagroda zostają |
| Inna odpowiedź, sylaby lub typ ćwiczenia | Zachowaj ID, zwiększ rewizję | Niedokończone próby i licznik podpowiedzi są czyszczone; zadanie pozostaje aktywne |
| Zmiana ukończonego zadania | Zachowaj ID, zwiększ rewizję | Ukończenie i nagroda zostają; nową treść można powtórzyć |
| Faktycznie nowe zadanie z osobną nagrodą | Nowe ID i rewizja 1 | Osobny postęp i jednorazowa nagroda |
| Tymczasowe wycofanie zadania | Usuń ścieżkę z manifestu | Dawny postęp pozostaje w zapisie, nie jest kasowany |

Nie zmieniaj ID przedmiotów, aby zmienić ich wyświetlaną nazwę. Usunięcie definicji przedmiotu nie kasuje już zdobytych sztuk; w plecaku pojawi się wtedy jego ID jako nazwa zastępcza.

Zapis P0 (`version: 1`, pojedyncze `quest`) jest automatycznie migrowany do zapisu v2 (`quests` i `inventory`). Ukończenie Brunona odtwarza jedno nasionko maku. Nazwa bazy IndexedDB, wersja bazy i klucz pozostają te same; zmienia się format danych wewnątrz. Pozycja, kamera i ostatnie 200 prób pozostają zachowane. Błędny lub przyszły format zapisu zatrzymuje start zamiast zastąpić postęp nową grą.

## Sprawdzanie i publikacja

```sh
npm run content:check
npm run check
npm run dev
```

`content:check` sprawdza JSON, typy, nieznane pola, sylaby, powtórzone ID, odwołania i wymagania. Pełny `check` dodaje testy logiki, zapisu, interfejsu i sceny oraz build. Schemat `docs/quest.schema.json` pomaga edytorom obsługującym JSON Schema; walidator w `src/content/validate.ts` jest źródłem kontroli zależności między plikami.

Pozycje NPC i punkty spaceru są dodatkowo sprawdzane przy budowie świata pod kątem przeszkód. Jeśli zmieniasz trasę lub modele, sprawdź je w grze — sama walidacja JSON nie analizuje całej drogi między punktami.

W produkcji pliki znajdują się pod `content/`, obok buildu. Poprawki wyłącznie w tych plikach nie wymagają rekompilacji JavaScript, ale **muszą zostać wdrożone razem z kompletnym, zgodnym pakietem treści**. W bieżącym procesie najwygodniej ponownie zbudować i opublikować całe `dist/`. Sam commit na `main` nie zmienia GitHub Pages. Nie dodano automatycznego wdrażania; publikacja nadal wymaga zgody użytkownika.

Wdrożenie P1 musi zawierać jednocześnie nowy silnik i katalog `content/`; stary build P0 nie czyta JSON. W trakcie ładowania nowy silnik waliduje cały pakiet przed startem gry i przed zapisaniem postępu. Błąd wskazuje plik/pole w „Szczegółach dla rodzica”.

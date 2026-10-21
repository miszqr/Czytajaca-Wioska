# Biblioteka Toli w drzewie — 2026-10-20

Baza: `0c6b6c749ced8273c353a40f22bd6a96721e4ccf`, gałąź `feat/new-home-story`.

## Model i zakres

Zastąpiono model biblioteki w `(0, 23)` szczegółowym domem w pniu drzewa. Model znajduje się w `src/game/tola-library.ts`, a `createVillage` dołącza go do istniejących partii otoczenia. Zachowano miejsce Toli, inne budynki, sterowanie, dialogi i format zapisu.

Z ilustracji użytkownika przeniesiono: ciepłą korę i drewno, korzenie podporowe, okrągłe okna z półkami i książkami, kwietniki, łukowe drzwi z okuciami i kołatką, ganek ze schodkami i balustradami, zielononiebieski gont, wygięty balkon, latarenki, bluszcz, drobne kwiaty, rzeźbione liście i szyld „BIBLIOTEKA TOLI” z otwartą książką. Pełna bryła obejmuje również konary i nieregularną koronę liści. Referencję zachowano jako `docs/references/tola-library-exterior.png`; nie jest teksturą ani zależnością uruchomieniową.

Drzwi i balkon są dekoracją zewnętrzną. Nie dodano nowej przestrzeni wnętrza ani mechaniki wchodzenia po schodach. Tola nadal czeka przed budynkiem.

## Geometria i koszt

| Metryka | Przed | Po |
| --- | ---: | ---: |
| Trójkąty biblioteki | 2 584 | 42 436 |
| Trójkąty scalonego otoczenia | 330 684 | 370 536 |
| Partie geometrii otoczenia | 55 | 53 |
| Wierzchołki całej sceny | 557 642 | 627 496 |
| Drzewa w otoczeniu | 81 | 81 |

Otoczenie ma o 12,05% więcej trójkątów. Model korzysta z istniejącego białego materiału i kolorów wierzchołków, dlatego nie tworzy nowych partii materiałów. Nie dodano tekstur, bibliotek, świateł punktowych, animacji ani kosztu aktualizacji modelu w każdej klatce. Jest to pomiar struktury sceny w NullEngine, nie FPS.

## Weryfikacja

- `npm test -- --reporter=dot`: **43 testy w 8 plikach**, wszystkie przeszły.
- `npm run build`: walidacja treści, TypeScript i produkcyjny build zakończone powodzeniem.
- `npm run test:build`: produkcyjny graf modułów został uruchomiony, UI zamontowane, rozpoczęto wczytywanie treści.
- Test biblioteki sprawdza budżet 45 tys. trójkątów, jeden materiał, skończone atrybuty wierzchołków, trafienia promieni w pień i daszek, normalną skierowaną na zewnątrz, kolizję pnia i ganku oraz całą wolną linię dojścia przed Tolą.
- Istniejący test świata potwierdza dostępność mieszkańców i obiektów fabularnych po scaleniu geometrii.
- Obejrzano render rzeczywistych siatek od przodu i od tyłu: `docs/previews/tola-library.webp`. Renderer używa oświetlenia porównawczego i cienia kontaktowego, które nie oznaczają zmiany oświetlenia gry.

Logi: `reports/tola-library-check.txt`. Przeglądarka testowa wyświetlała `WebGL not supported`. Z tego powodu nie potwierdzono obrazu WebGL ani płynności na telefonie; podgląd jest renderem CPU geometrii z kodu, nie zrzutem gry.

Zapis na gałęzi źródłowej nie wdraża gry na GitHub Pages. Publikacja jest osobnym krokiem zgodnie z zasadą w README.

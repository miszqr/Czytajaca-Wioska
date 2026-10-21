# Assety — status

## Obecne

| Element | Status | Źródło |
| --- | --- | --- |
| Kitek 3D | Prototyp proceduralny; właściwe kolory, uszy, oczy, ogon, tunika i plecak | Oryginalny kod `characters/models.ts` |
| Fela 3D | Lisica w zielonym ubraniu; prototyp inspirowany dostarczoną ilustracją | Oryginalny kod; `references/fela-concept.png` jest referencją, nie modelem |
| Tola i Miluś 3D | Sowa z okularami i królik z torbą; prototypy | Oryginalny kod `characters/models.ts` |
| Wnętrze i meble | Pokój, szafka, łóżko, stół oraz warianty lamp, krzeseł, dywanów i roślin | Oryginalne bryły w `game/story-world.ts`; 20 typów przedmiotów w danych |
| Bruno 3D | Prototyp proceduralny: miś, fartuch i kapelusz | Oryginalny kod `characters/models.ts` |
| Animacje | Zastępcze proceduralne: idle, walk, run, obrót, talk, pick-up, give, celebrate | Kod, bez rigu i klipów glTF |
| Domy, ogród i staw | Stylizowana geometria prototypowa | Oryginalny kod `game/world.ts` |
| Dom / sklep Feli | Dopracowana drewniana chatka: bale ze słojami, gontowy dach z wygiętymi okapami, komin, ganek, okiennice, kwietniki i szyld | Proceduralny model `game/fela-house.ts`, inspirowany ilustracją dostarczoną przez użytkownika |
| Biblioteka Toli | Dom w drzewie: pień z korą i korzeniami, okrągłe okna z książkami, ganek, balkon, gont, latarnie, bluszcz i szyld | Proceduralny model `game/tola-library.ts`; referencja użytkownika `references/tola-library-exterior.png` |
| Drzewa i roślinność | Dąb, jabłoń, brzoza, sosna; rozgałęzione pnie, korzenie, nieregularne korony, krzewy, trawa i kwiaty z płatkami | Oryginalny kod `game/vegetation.ts` i `game/world.ts` |
| Portrety i ikony | Proste wektory interfejsu; nie finalne portrety 3D | Oryginalny SVG w `ui/Icons.tsx` |
| `references/kitek-concept.png` | Dostarczona referencja wizualna, nie model ani spritesheet | Załącznik użytkownika |
| Głos | Opcjonalny głos systemowy, brak plików audio | Web Speech API |

Model Kitka nie odtwarza szczegółowego futra i jakości renderingu z referencji. Ilustracji nie użyto jako tekstury udającej model 3D. Gra nie pobiera modeli ani tekstur z serwisów zewnętrznych.

## Docelowo do przygotowania

1. Kitek glTF/GLB: rig dwunożny, oczy, uszy, ogon, plecak jako osobny element; budżet pod telefony.
2. Klipy idle, walk, run, turn, talk, pick-up, give, celebrate; później sit, sleep, wave.
3. Bruno, Fela, Tola, Miluś z rigami i prostymi animacjami rozmowy.
4. Modułowe domy z wnętrzami, biblioteka, sklep i meble.
5. Roślinność z kilkoma wariantami i LOD; materiały wspólne/atlasy.
6. Docelowe modele i osobne ikony obecnych 20 typów przedmiotów; dziś część wariantów współdzieli bryły i ogólną ikonę.
7. Dźwięki kroków, interakcji, otoczenia i spokojna muzyka, z udokumentowaną licencją.

Dostarczona grafika nie została przekształcona w finalny asset. Wszystkie proceduralne modele pozostają oznaczone jako prototypy.

Oryginał referencji Feli jest też zachowany w [archiwum części](references/fela-original/README.md). Na gałęzi odzyskanej przez połączenie GitHub PNG odtwarza polecenie `python3 scripts/restore-fela-reference.py`; suma kontrolna potwierdza identyczność z załącznikiem. Ten krok nie jest potrzebny do uruchomienia gry.

## Pierwsze dopracowanie roślinności

Kolor liści jest zapisany we wierzchołkach, a małe elementy są łączone w istniejące partie geometrii. Dekoracje mają własne ziarna losowania: nie zmieniają rozmieszczenia drzew, przeszkód ani pozycji zapisu. Pnie i główne korony zachowują obsługę kolizji kamery. Trawa i drobne gałązki nie blokują ruchu.

[Porównanie modeli](previews/vegetation.webp) przedstawia geometrię wyeksportowaną z kodu i wyrenderowaną programowo w oświetleniu porównawczym. Nie jest zrzutem gry ani potwierdzeniem działania WebGL. Widoczne cienie kontaktowe na planszy porównawczej należą wyłącznie do tego renderu.

Modele są nadal proceduralne i stylizowane. Nie dodano jeszcze wiatru, tekstur liści, LOD ani nowego systemu cieni.

## Drewniany dom Feli

[Porównanie domu](previews/fela-house.webp) przedstawia rzeczywiste siatki przed i po zmianie, wyrenderowane programowo. Podgląd używa osobnego oświetlenia i miękkiego cienia pod modelem; nie jest zrzutem WebGL ani obietnicą dodania cieni do gry.

Dom ma 17 860 trójkątów. Kolory drewna, gontów i detali są zapisane we wierzchołkach, dzięki czemu budynek używa jednego istniejącego materiału. Wszystkie elementy są scalane z otoczeniem przy tworzeniu wioski. Komin, ściany i dach mają uproszczone bryły do promieni kamery; kwiaty, litery i drobne zdobienia nie blokują kamery. Nie dodano tekstur, zależności, świateł punktowych ani pracy w pętli animacji.

Sklep pozostaje w dotychczasowym miejscu. Ganek ma osobny obrys kolizji, zachowujący wolną trasę Feli i dostęp do rozmowy. Wnętrze sklepu nie jest częścią tej zmiany. Domy Kitka, Brunona i Milusia korzystają z dotychczasowego modelu.

Eksport do kontroli geometrii: `node scripts/export-fela-house.mjs /tmp/fela-house.json`. Render porównawczy: `python scripts/render-house-preview.py before.json after.json preview.webp` (Python, NumPy i Pillow; wyłącznie narzędzie dokumentacyjne). Pomiary i walidacja: [raport](../reports/fela-house-detail.md).

## Biblioteka Toli w drzewie

[Porównanie biblioteki](previews/tola-library.webp) przedstawia dokładną geometrię modeli, wyrenderowaną programowo, od przodu i od tyłu. Inspiracją jest [załączony projekt detali zewnętrznych](references/tola-library-exterior.png). Kolory kory, miodowego drewna, zielononiebieskich gontów, liści i kwiatów zapisano we wierzchołkach. Okrągłe okna zawierają małe półki i grzbiety książek; szyld „BIBLIOTEKA TOLI” i znak otwartej książki też są geometrią.

Model ma 42 436 trójkątów i współdzieli jeden materiał z otoczeniem. Pień, grube konary, korzenie, daszek i podest balkonu osłaniają kamerę; małe zdobienia pozostają dekoracją. Biblioteka nadal stoi w `(0, 23)`, a Tola w `(0, 18.2)`. Jej dialogi i postęp historii pozostają bez zmian. Drzwi, schodki i balkon należą do modelu zewnętrznego; ta zmiana nie dodaje wnętrza biblioteki ani wspinania.

Eksport: `node scripts/export-fela-house.mjs /tmp/tola-library.json 'Biblioteka Toli'`. Render: `python scripts/render-house-preview.py before.json after.json preview.webp 'Biblioteka Toli — dom w drzewie'`. Eksporter przyjmuje opcjonalną nazwę domu, a renderer automatycznie dopasowuje wysokość kadru. Pomiary, testy i ograniczenie kontroli WebGL opisuje [raport](../reports/tola-library-detail.md).

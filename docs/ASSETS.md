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

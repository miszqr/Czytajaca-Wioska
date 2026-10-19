# Assety — status

## Obecne

| Element | Status | Źródło |
| --- | --- | --- |
| Kitek 3D | Prototyp proceduralny; właściwe kolory, uszy, oczy, ogon, tunika i plecak | Oryginalny kod `characters/models.ts` |
| Bruno 3D | Prototyp proceduralny: miś, fartuch i kapelusz | Oryginalny kod `characters/models.ts` |
| Animacje | Zastępcze proceduralne: idle, walk, run, obrót, celebrate | Kod, bez rigu i klipów glTF |
| Domy, drzewa, ogród, staw i kwiaty | Stylizowana geometria prototypowa | Oryginalny kod `game/world.ts` |
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
6. Około 20 przedmiotów z czytelnymi ikonami.
7. Dźwięki kroków, interakcji, otoczenia i spokojna muzyka, z udokumentowaną licencją.

Dostarczona grafika nie została przekształcona w finalny asset. Wszystkie proceduralne modele pozostają oznaczone jako prototypy.

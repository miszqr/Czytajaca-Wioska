# Dopracowanie roślinności — 2026-10-19

- Baza: `f9dc91291e49f4eae477d54a10b8c006f5021696` (kamera ze strzałkami).
- `npm run check`: 17/17 istniejących testów przeszło; TypeScript i build Vite zakończone poprawnie.
- 82 drzewa, cztery odmiany; układ i kolizje ruchu zachowane.
- Po scaleniu: 50 partii geometrii otoczenia, 316 648 trójkątów otoczenia, 516 963 wierzchołki całej sceny. To pomiar struktury sceny, nie pomiar FPS.
- Kolory liści i trawy we wierzchołkach, wspólny materiał; drobne rośliny nie uczestniczą w kolizjach kamery.
- Podgląd aplikacji uruchomiony przez Sites preview; dodano tylko konkretny host deweloperski `terminal.local` do Vite.
- Przeglądarka podglądu zgłosiła `WebGL not supported`; wygląd shaderów, kamera przy nowych koronach i wydajność na urządzeniu pozostają niezweryfikowane.
- `docs/previews/vegetation.webp`: programowy render rzeczywistych siatek modeli w osobnym oświetleniu porównawczym, nie screenshot WebGL. Cienie na tej planszy nie oznaczają dodania cieni do gry.
- Brak nowych zależności i zasobów zewnętrznych.
- Nie aktualizowano gałęzi `gh-pages` ani działającej gry.

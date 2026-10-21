# Odległość kamery w menu — 2026-10-21

Menu wioski zawiera sekcję „Kamera” z suwakiem „Odległość od Kitka”,
przyciskami −/+ i przywracaniem domyślnej wartości. Zakres to 2,3–9,
krok 0,1. Nowe gry zaczynają z odległością 5 (wcześniej 3,5).
Starsze zapisy zachowują wybraną odległość.

Zmiana działa od razu podczas pauzy i zapisuje się w istniejącym polu
`camera.distance`, bez zmiany formatu zapisu. Menu odczytuje aktualną wartość
z silnika, także po użyciu kółka myszy. Samo otwarcie menu nie wymusza zapisu.
Centrowanie kamery zachowuje wybraną odległość. Kolizje mogą chwilowo
przybliżyć kamerę, ale nie zmieniają zapamiętanej wartości.

Suwak obsługuje dotyk i klawiaturę, a lewo/prawo na padzie zmienia wartość,
gdy suwak ma fokus. Nawigacja menu i pułapka klawisza Tab obejmują suwak.

`npm run check`: 51 testów w 9 plikach, walidacja treści, TypeScript,
build produkcyjny i test startu zakończone powodzeniem. Testy obejmują
regulację w pauzie, kolizje, centrowanie, granice zakresu, zapis i ponowne
otwarcie gry oraz sterowanie suwakiem i padem. Grafika WebGL na telefonie
nie była w tej zmianie sprawdzana ręcznie.

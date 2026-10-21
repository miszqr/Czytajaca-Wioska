# Złota godzina — 2026-10-21

Niebo i oświetlenie wioski: błękitny zenit, brzoskwiniowy horyzont,
delikatne chmury, widoczna tarcza słońca i ciepła mgiełka w oddali.
Kierunek tarczy odpowiada kierunkowi światła (około 18° nad horyzontem).
Niebo podąża za kamerą bez paralaksy, nie bierze udziału w kolizjach
ani wyborze obiektów. Osobna scena wnętrza zachowuje swoje oświetlenie.

Jedna proceduralna sfera, bez tekstur i postprocessingu. Mapa cieni 1024²
z filtrowaniem PCF o niskim koszcie obejmuje budynki, roślinność i postacie.
Cienie aktualizują się dla ruchomych mieszkańców; zastane cienie kontaktowe
nie są źródłami kolejnych cieni. Światło nieba rozjaśnia zacienione powierzchnie.
Całość konfiguruje `src/game/golden-hour.ts`.

`npm run check`: 43 testy w 8 plikach, walidacja treści, TypeScript,
build produkcyjny i test uruchomienia modułów zakończone powodzeniem.
Test sceny obejmuje kompilację materiałów i render w NullEngine.
Nie potwierdzono obrazu WebGL ani FPS na telefonie: środowisko nie ma
zainstalowanej przeglądarki do lokalnego odbioru GPU.

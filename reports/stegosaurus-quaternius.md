# Stegozaur Quaterniusa i ukryty licznik — 2026-10-25

Zgłoszenie użytkownika: sekret już działa; ukryć licznik i zastąpić bryłowy model lepszym, najlepiej gotowym z internetu.

## Zmiana

- Usunięto licznik, pasek postępu i wskazówkę przy brzegu z interfejsu. Mechanizm trzech okrążeń z dokładnie trzema jabłkami pozostał ten sam.
- Dodano gotowego Stegosaurusa Quaterniusa (CC0 1.0) z Animated Dinosaur Pack. Źródło i pochodzenie konwersji GLB są zapisane w `public/models/stegosaurus.LICENSE.txt`.
- Nowy model ma 2290 trójkątów, 3 siatki, szkielet i oryginalne klipy Idle / Walk. Poprzedni model miał 10508 trójkątów i 26 siatek. Zachowano długość 9 m; kolorystyka w grze to matowa ochra i jasny brzuch.
- GLB zajmuje 315600 bajtów. Skrypt przygotowania usuwa niewykorzystywane animacje i pakuje potrzebne dane, bez zmiany siatki czy klatek pozostałych animacji. Dodano przypięty loader Babylon 9.31.0; importowany jest tylko loader glTF 2.0, bez glTF 1.0 i pakietu rozszerzeń.
- Model i loader są ładowane dopiero po odkryciu lub podczas odtwarzania odkrytego sekretu z zapisu. Wczytywanie nie przesuwa wyjścia z morza; kolizje i cienie powstają po załadowaniu modelu. Awaria pobrania uruchamia lokalny model proceduralny.
- Animacje korzystają z zegara gry, z uwzględnieniem pauzy, zatrzymania przed Kitkiem i ograniczenia ruchu. Najniższa stopa jest korygowana do lokalnej płaszczyzny gruntu, żeby wbudowana animacja nie zagłębiała nóg w plaży.
- Istniejący zapis odkrycia automatycznie korzysta z nowego modelu. Nie trzeba ponownie wykonywać sekretu.

## Weryfikacja

97 testów w 17 plikach — OK (77 bez controls, następnie 20 controls, limit sterty Node 6144 MB). Po zawężeniu importu loadera ponownie przeszło 17 testów modelu i integracji. Walidacja treści, TypeScript, build Vite i start produkcyjnych modułów — OK.

Testy używają prawdziwego pliku GLB i loadera, także w integracji ze sterowaniem i synchronizacją świata. Sprawdzono rozmiary, szkielet, rzeczywiste deformacje siatki w 60 próbkach animacji, brak rozciągania nóg i ogona, ograniczenie ruchu, start pod wodą, dojście do plaży, stary zapis, awarię pliku, anulowanie ładowania oraz zwalnianie szkieletu i animacji.

Wygląd oceniono na zrzucie użytkownika, podglądzie autora i pomocniczym renderze CPU rzeczywistej geometrii. Nie uruchamiano podglądu WebGL, zgodnie z AGENTS.md. Render CPU nie jest zrzutem gry ani pomiarem wydajności na GPU.

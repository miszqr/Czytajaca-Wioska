# Instrukcje dla agentów

## Ocena sceny 3D w przeglądarce Work

Potwierdzone 2026-10-23: dostępna przeglądarka kontrolna zgłasza `WebGL not supported`. Nie można w niej ocenić wyglądu ani wydajności sceny 3D Czytającej Wioski.

Na wyraźną prośbę użytkownika:

- Nie ponawiaj prób podglądu ani oceny sceny 3D w tej przeglądarce. Nie uruchamiaj jej tylko po to, aby ponownie sprawdzić znany brak WebGL; oszczędzaj czas i tokeny.
- Weryfikuj zmiany odpowiednimi testami logiki, UI i Babylon NullEngine, kompilacją oraz testem startu produkcyjnego. Przy publikacji sprawdzaj wdrożenie i pliki przez HTTP.
- Nie przedstawiaj testów NullEngine jako wizualnej weryfikacji renderingu na GPU. Korzystaj z zrzutów i uwag użytkownika przy poprawkach wyglądu.
- Wróć do prób oceny 3D w przeglądarce dopiero na wyraźne polecenie użytkownika lub po niezależnym potwierdzeniu zmiany środowiska na obsługujące WebGL. Sam nowy czat lub kolejna zmiana gry nie uzasadnia ponownej próby.
- Nie powtarzaj diagnozy braku WebGL w każdym podsumowaniu; wspomnij o niej tylko wtedy, gdy jest istotna dla wyniku zadania.

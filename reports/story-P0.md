# P0 — „Nowy dom Kitka”

2026-10-19. Pierwszy grywalny etap nowej specyfikacji. Zachowano wioskę, roślinność, Kitka i sterowanie; dom przeniesiono przy staw. Usunięto zadania sylabowe i mechanikę odpowiedzi. Dodano jawne ID dialogów, warunki, skutki, wnętrze, list, dziennik oraz migrację v1/v2 → v3 z kopią oryginału.

`npm run check`: **26 testów / 7 plików — OK**, walidacja treści — OK, TypeScript — OK, build Vite — OK. Pełny log: `story-P0-check.txt`.

Scenariusz UI w jsdom: powitanie → rozmowa z Brunonem → ręczne „Dalej” → drzwi → list Feli → dziennik → ponowne otwarcie listu → przeładowanie aplikacji z zachowanym stanem. Testy domeny obejmują jednorazowe powitanie, przejścia lokalizacji, archiwizację starego zapisu i odrzucenie przyszłego formatu. NullEngine sprawdza scenę i istniejące sterowanie, bez GPU.

Odbiór ręczny w prawdziwym świecie 3D pozostaje do wykonania na przeglądarce z WebGL. Udostępniona wcześniej przeglądarka zgłaszała brak WebGL; nie deklarujemy wizualnego testu ani wydajności na telefonie. P1 rozwija dalszą treść zaproszenia Feli. Brak publikacji.

# Sekret jeziorka — naprawa liczenia brzegu, 2026-10-25

Zgłoszenie: gra działa, lecz po trzech okrążeniach z trzema jabłkami stegozaur się nie pojawia.

## Przyczyna i poprawka

Poprzedni licznik odrzucał każdy punkt o `pondRadius < 1`. Ta elipsa oznacza koniec modelowanej niecki, a nie widoczny brzeg wody. Test spaceru po elipsie o promieniu 0,9 potwierdził, że wszystkie punkty leżą ponad powierzchnią wody, a mimo to poprzedni licznik zerował postęp i nigdy nie wyzwalał sekretu.

Liczenie uwzględnia teraz wysokość rzeczywistego terenu wewnątrz niecki. Suchy brzeg i płycizna do 12 cm liczą się; przejście przez głębszą wodę nadal zeruje serię. Na zewnątrz niecki nie porównujemy terenu z poziomem jeziora, ponieważ sucha plaża morska leży niżej. Pozostają ograniczenia odległości, teleportów, kierunku oraz dokładnie trzech jabłek przez całą serię.

Przy jeziorku, z trzema jabłkami przed odkryciem sekretu, widoczne są licznik pełnych okrążeń, płynny pasek postępu i wskazówka o wodzie po lewej stronie. Licznik znika po odkryciu, zmianie warunków lub zresetowaniu serii. Dane postępu pochodzą z tego samego licznika, który wyzwala zdarzenie.

## Weryfikacja

- Test regresji najpierw odtworzył błąd na poprzednim kodzie, następnie przeszedł po poprawce.
- Nowy test integracyjny steruje Kitkiem po rzeczywistym brzegu przez publiczne sterowanie dotykowe, pętlę runtime, przyspieszanie, kolizje, autozapis i synchronizację świata. Potwierdza wyzwolenie po trzech okrążeniach oraz dojście stegozaura do plaży.
- Test nierównego brzegu obejmuje płyciznę, odrzucenie skrótu przez środek i suchą plażę poniżej poziomu jeziora.
- Test UI sprawdza licznik i pasek, znikanie po resetowaniu oraz odkryciu; istniejący zapis i nowa gra nadal działają.
- Pełny zestaw: 96 testów w 17 plikach — OK (76 bez controls, następnie 20 controls; Node z limitem sterty 6144 MB). Po doprecyzowaniu warunku plaży ponownie przeszło 16 powiązanych testów.
- Walidacja treści, TypeScript, build Vite, start produkcyjnych modułów i `git diff --check` — OK.
- Testy sceny wykorzystują NullEngine; nie wykonano oceny wizualnej GPU, zgodnie z AGENTS.md.

Format zapisu i zapisane postępy pozostają zgodne. Po aktualizacji wystarczy odświeżyć grę; nie trzeba zaczynać nowej gry. Niedokończone okrążenia, jak wcześniej, są postępem sesji i trzeba je wykonać ponownie.

## Wdrożenie — 2026-10-25

- Źródła: `feat/stegosaurus-secret`, commit `75d6b3fca410d8ea7721796fde899cc4747871b5`; drzewo `40e91b5d88c1e36e1a6c7133d748f13a28371bf1`, identyczne z przetestowanym lokalnym `c6da7e6`.
- Wydanie: `gh-pages`, commit `3642efd0aa812367ebc467e4f04b59ec54638363`; drzewo `e400ac2b06255e6767b5a382373e63696db784f8`, identyczne z przygotowanym wydaniem.
- GitHub Pages: https://github.com/miszqr/Czytajaca-Wioska/actions/runs/40168406217 — completed / success.
- Gra: https://miszqr.github.io/Czytajaca-Wioska/ — publiczny `release.json` wskazuje `stegosaurus-bank-fix` i powyższy commit źródłowy.
- Weryfikacja HTTP: 56/56 publicznych plików ma sumy SHA-256 zgodne z lokalnym wydaniem; pominięto znacznik `.nojekyll`.

Publikację wznowiono po ponownej wyraźnej zgodzie użytkownika oraz ustąpieniu limitu systemu zatwierdzania. Źródła i gotowe wydanie zachowano w lokalnych commitach na czas przerwy. Poprzednie wydanie pozostaje w historii gałęzi `gh-pages`; nie zmieniano `main`.

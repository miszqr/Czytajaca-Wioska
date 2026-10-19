# P1 — pełna pierwsza opowieść

2026-10-19. Wszystkie osiem scen „Nowego domu Kitka” jest połączonych w jedną historię. Fela przekazuje lampę, Bruno prosi o przeniesienie skrzynki i daje klucz. Szafka prowadzi do Toli, Milusia i zaproszeń. Po zadzwonieniu dzwonkiem mieszkańcy pojawiają się w domu; gracz może rozmawiać, zakończyć wizytę, zaprosić ich ponownie lub wrócić do spaceru.

`npm run check`: **28 testów / 7 plików — OK**, walidacja JSON, TypeScript i build Vite — OK. Log: `story-P1-check.txt`.

Test domeny przechodzi 24 działania całej historii, serializując i odtwarzając zapis po każdym z nich. Sprawdza komplet ośmiu scen, zużycie klucza i zaproszeń, brak duplikacji lampy i książki, ponowne spotkanie oraz wizyty poza kolejnością. Osobno sprawdzono pełny plecak i atomowość przekazania prezentu.

Scena Babylon NullEngine zawiera Kitka oraz czterech mieszkańców. Test połączeń na siatce kolizji potwierdza dojście w zasięg wszystkich miejsc interakcji w wiosce i początkowym wnętrzu. Modele sowy, królika i Feli są proceduralnymi prototypami. Fela korzysta z kolorystyki dostarczonej ilustracji; ilustracja nie jest modelem 3D.

Scenariusz odbioru: list → Fela → lampa przy łóżku → notatka → Bruno → skrzynka → ogród → Bruno i klucz → szafka → Tola → Miluś → trzy zaproszenia → dzwonek w domu. W P1 lampa ma przygotowane miejsce; P2 rozszerza to o swobodne urządzanie. Sklep jest reprezentowany przez budynek i Felę przed wejściem, bez osobnego wnętrza sklepu. Goście pojawiają się w domu po zaproszeniu; nie ma jeszcze przechodzenia NPC przez całą mapę.

Testy nie potwierdzają obrazu na GPU ani wydajności na urządzeniu. Ręczny odbiór z WebGL, telefonem i fizycznym padem pozostaje otwarty. Brak publikacji.

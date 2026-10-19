# Czytająca Wioska — plan

## P0 — grywalny wycinek

- [x] Niezależny projekt Vite, TypeScript, React i Babylon.js.
- [x] Lokalne repozytorium Git, README i dokumentacja architektury.
- [x] Wioska, drogi, krajobraz, staw i kolizje.
- [x] Oryginalny prototyp Kitka z zatwierdzonymi kolorami i plecakiem.
- [x] Kamera zza pleców, podążanie i ograniczanie przesłaniania.
- [x] WASD / strzałki, mysz, standardowy Gamepad API i podstawowy dotyk.
- [x] Strzałki: obrót i przód/tył względem Kitka, kamera automatycznie za plecami; ręczne rozglądanie ma pierwszeństwo.
- [x] Bruno, interakcja z bliska i ręcznie przewijany dialog.
- [x] Zadanie MA: ponowienie, podpowiedź, odsłuch, nagroda i powtórki.
- [x] Niezależne moduły czytania i zadań, treść w danych.
- [x] IndexedDB: pozycja, kamera, zadanie, próby i podpowiedzi.
- [x] Kompilacja i testy po etapach; paczka do lokalnego uruchomienia.
- [ ] Odbiór obrazu i shaderów w działającej przeglądarce — podgląd działa, ale jego przeglądarka zgłasza `WebGL not supported`.
- [ ] Test na Pixelu 8: dotyk, obrót ekranu, limity pamięci i płynność.
- [ ] Test fizycznego 8BitDo, w tym ponowne połączenie i układ przycisków.
- [ ] Kalibracja czytelności, prędkości i kamery po teście z dzieckiem.

## P1 — fundament rozgrywki

- [ ] Fela, Tola i Miluś z dialogami i dostępnością zadań.
- [ ] Definicje wszystkich 12 zadań ze specyfikacji.
- [ ] Składanie słów z sylab i rozumienie krótkich zdań.
- [ ] Wybór poziomu przez rodzica, kontrolowane słownictwo i powtórki.
- [ ] Plecak 12 slotów i około 20 typów przedmiotów.
- [ ] Przekazywanie/zużywanie przedmiotów użytkowych; dekoracje osobno.
- [ ] Menu postępu, import/eksport i migracje zapisu.
- [ ] Rozszerzone stany NPC: spokojny spacer i dostępność rozmowy.
- [ ] Dopracowanie sterowania mobilnego i mapowania padów.
- [ ] Dźwięki interakcji z ustawieniami głośności.

## Pierwsze dopracowanie grafiki

- [x] Cztery odmiany drzew, gałęzie, korzenie, nieregularne korony i detale kory.
- [x] Krzewy, kępki trawy i kwiaty z płatkami.
- [x] Wspólne materiały, łączenie geometrii i zachowanie rozmieszczenia przeszkód.
- [x] Porównanie geometrii modeli i sprawdzenie kompilacji oraz istniejących testów.
- [ ] Odbiór grafiki na urządzeniu i pomiar płynności na Pixelu.
- [x] Publikacja poprawionej roślinności po zgodzie użytkownika; build `80ba87c`, wdrożenie zakończone sukcesem.

## P2 — dom i oprawa

- [ ] Wnętrze domu Kitka i wejście/wyjście.
- [ ] Edytor domu: podgląd, obrót, siatka, kolizje mebli.
- [ ] Finalne modele i rig zgodnie z `docs/ASSETS.md`.
- [ ] Pełen zestaw animacji: idle, walk, run, turn, talk, pick-up, give, celebrate.
- [ ] Później sit, sleep i wave, wtórne ruchy uszu i ogona.
- [ ] Lokalne efekty dźwiękowe i muzyka z odpowiednimi prawami.
- [ ] Profilowanie Androida, poziomy jakości i końcowe testy regresji.

## Publikacja

- [x] Publikacja poprawki kamery ze strzałkami po zgodzie użytkownika; wdrożenie `9f63d3e` zakończone sukcesem.
- [x] Przygotowanie źródeł na `main` i gotowego buildu na `gh-pages` w `miszqr/Czytajaca-Wioska` na prośbę użytkownika.
- [x] GitHub Pages działa z `gh-pages` → `/ (root)`.
- [ ] Odbiór opublikowanego P0 na komputerze i telefonie.

Nie podłączono automatycznego wdrażania z `main`. Po włączeniu GitHub Pages aktualizacje `gh-pages` będą publikowane. Stan „zaimplementowane” nie zastępuje odbioru wizualnego i testów na urządzeniach.

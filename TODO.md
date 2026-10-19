# Czytająca Wioska — „Nowy dom Kitka”

Aktualna specyfikacja: `docs/WORK_BRIEF.md`, 2026-10-19. Zastępuje dawny plan sylab i 12 ćwiczeń. Kitek, roślinność, kamera i sterowanie są zachowane. Nowy kod powstaje na `feat/new-home-story`; publiczna gra pozostaje przy poprzednim wydaniu.

## P0 — przyjazd, dom i list

- [x] Sprawdzić istniejące repozytorium i zachować rozpoczęte zmiany w historii Git.
- [x] Usunąć mechanikę sylab, quizowe komponenty i plan szkolnych zadań.
- [x] Dane JSON: sceny, dialogi, warunki, skutki, mieszkańcy i interakcje.
- [x] Bruno na placu; dialog ze wskazówką do domu przy stawie.
- [x] Wejście do osobnego wnętrza, stół, łóżko, koperta i list Feli.
- [x] Dziennik z celem oraz ponownym odczytem listów.
- [x] Zapis świata i migracja starszych zapisów bez utraty zdobytych pamiątek.
- [x] Build i 26 testów P0; scenariusz odbioru opisany w raporcie.

## P1 — pełne osiem scen

- [x] Fela i przekazanie lampy; ustawienie przy łóżku.
- [x] Notatka przy szafce; rozmowa z Brunonem.
- [x] Podniesienie skrzynki i odłożenie jej w ogrodzie; klucz.
- [x] Otwarcie szafki; książeczka i wskazówka do Toli.
- [x] Tola i Miluś; zaproszenia dla mieszkańców.
- [x] Spotkanie w domu i zakończenie historii bez kończenia gry.
- [x] Warianty rozmów, naturalne przypomnienia i jednorazowe skutki.
- [x] Build, test pełnej historii i wznowienia po każdym kroku.

## P2 — zabawa po historii i oprawa

- [x] Edytor mebli: wybór, podgląd 3D, obrót, siatka i kolizje.
- [x] Schowek dekoracji, około 20 przedmiotów, odzyskiwanie ustawionych mebli.
- [x] Proste stany i animacje mieszkańców, ponowne spotkania.
- [x] Odsłuch na żądanie, klawiatura, pad i dotyk dla nowych interakcji.
- [x] Responsywne dialogi, dziennik i edytor domu.
- [x] Build, 34 testy regresji i dokumentacja treści. Optymalizacja prototypu: wspólne materiały i aktualizacja geometrii tylko przy zmianie; pomiary wydajności pozostają do odbioru.

## Odbiór na urządzeniu

- [ ] Wygląd i shadery na GPU; przeglądarka udostępniona wcześniej zgłaszała brak WebGL.
- [ ] Pixel 8: dotyk, orientacja, płynność i pamięć.
- [ ] Fizyczny 8BitDo, ponowne połączenie i układ przycisków.
- [ ] Czytelność i zrozumiałość historii w zabawie z dzieckiem.
- [ ] Publikacja wyłącznie po wyraźnej zgodzie użytkownika.

Proceduralne modele i animacje są prototypami. Lista docelowych assetów: `docs/ASSETS.md`.

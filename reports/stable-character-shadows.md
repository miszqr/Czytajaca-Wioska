# Cienie postaci w słońcu — 2026-10-22

Zgłoszenie: migający cień na głowie Kitka oraz migotanie cienia na ziemi podczas chodzenia.

W poprzedniej konfiguracji głowa szerokości około 0,58 jednostki zajmowała zaledwie cztery piksele mapy cieni (1024², obszar 145 jednostek). Do mapy trafiały także nakładki oczu i inne detale cieńsze od przesunięcia normalnych. Dodatkowy płaski dysk pod stopami przecinał nierówności terenu i nawierzchnię ścieżek. Te ustawienia sprzyjały aliasingowi, samocieniowaniu oraz znikaniu fragmentów cienia kontaktowego.

Zmiany:

- Jedna mapa 2048² obejmuje stały obszar 104 jednostek. Głowa zajmuje teraz około 11 pikseli. Projekcja pozostaje nieruchoma względem świata, także przy ruchu kamery.
- Filtrowanie PCF o średniej jakości wygładza krawędzie; normal bias zmniejszono z 0,035 do 0,02.
- Zamknięte bryły postaci zapisują tylne ściany do mapy cienia. Używamy publicznego `customAllowRendering`, wywoływanego przez Babylon przed sprawdzeniem `forceBackFacesOnly` dla danego submesha. Test kontroluje rzeczywiste wywołania `setState` przed rysowaniem.
- Detale twarzy, płaskie paski i nakładki ubrań odbierają cienie, lecz nie tworzą własnych. Głowa, uszy, tułów, kończyny i plecak nadal rzucają cień. Postacie nadal przyjmują cienie otoczenia.
- Sceneria zachowuje standardowe odrzucanie ścian, aby jednostronne powierzchnie dachów nadal rzucały cień.
- Usunięto płaskie dyski kontaktowe w plenerze. We wnętrzu, które nie używa mapy słonecznej, dotychczasowe cienie kontaktowe pozostają.

Weryfikacja: `npm run check` — 54 testy w 10 plikach, walidacja treści, TypeScript, build oraz start modułów produkcyjnych zakończone poprawnie. Nowy test sprawdza stronę rysowaną w rzeczywistym przebiegu mapy cienia, brak detali oczu w tej mapie, stałość macierzy przy ruchu Kitka i kamery oraz pokrycie brzegu wyspy. Test pełnej wioski sprawdza wszystkie wierzchołki źródeł cieni względem nowej projekcji.

Ograniczenie: testy renderowania korzystają z NullEngine. Próba podglądu gry w przeglądarce roboczej zakończyła się komunikatem `WebGL not supported`. Wygląd cienia w ruchu i wpływ większej mapy na płynność telefonu wymagają sprawdzenia na urządzeniu z WebGL.

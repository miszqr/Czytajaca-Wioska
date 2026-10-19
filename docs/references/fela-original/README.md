# Oryginalna ilustracja Feli

To kompletne, niezmienione dane dostarczonego pliku `fela-concept.png` (2 438 200 bajtów). Transfer jednego dużego pliku przez połączenie GitHub został przerwany, dlatego oryginał zapisano w ośmiu częściach Base64. Nie zmniejszano obrazu ani jego jakości. Gra nie używa tej ilustracji podczas działania.

Odtworzenie PNG z głównego katalogu repozytorium:

```sh
python3 scripts/restore-fela-reference.py
```

Skrypt sprawdza rozmiar i SHA-256 przed zapisaniem `docs/references/fela-concept.png`. Nie nadpisuje pliku o innej zawartości. Python korzysta wyłącznie z biblioteki standardowej. Kolejność części i sumy kontrolne są w `manifest.json`.

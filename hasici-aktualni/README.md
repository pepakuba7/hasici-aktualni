# Hasiči Hodslavice — moderní statický web

Hotová statická verze webu pro otevření ve Visual Studio Code a nasazení na GitHub/Vercel.

## Jak otevřít lokálně

1. Rozbal ZIP.
2. Otevři složku ve Visual Studio Code.
3. Spusť `index.html`, ideálně přes rozšíření Live Server.

## Nasazení na GitHub + Vercel

Tato finální verze je připravená tak, aby soubory byly rovnou v kořeni projektu:

```text
index.html
o-nas.html
jednotka.html
technika.html
vyjezdy.html
mladez.html
akce.html
fotogalerie.html
kontakty.html
assets/
```

Na GitHub tedy nahraj přímo obsah rozbalené složky, ne další vnořenou složku. Vercel pak najde `index.html` automaticky a nebude padat na 404.

## Galerie

Fotky jsou ve složce `assets/gallery/` a seznam alb je v `assets/data/galleries.json`.
Lightbox podporuje posun mezi fotkami šipkami na obrazovce i klávesnicí.

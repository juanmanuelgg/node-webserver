# Apuntes

## (Auxiliares) Crear los iconos que se requieren para ser una PWA
[Crear maskeable para el manifest.json](https://maskable.app/editor)

```bash
sudo apt update
sudo apt install imagemagick
# Resize an image
convert original.png -resize 100x100 new.png
# Transform svg to ico
convert -density 256x256 -background transparent favicon.svg -define icon:auto-resize -colors 256 favicon.ico
```
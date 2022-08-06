# Apuntes

## Crear los iconos que se requieren para ser una PWA

### Crear un maskeable icon
[Crear maskeable para el manifest.json](https://maskable.app/editor)

### Transformar imagenes con imagemagick
```bash
sudo apt update
sudo apt install imagemagick
# Resize an image
convert original.png -resize 100x100 new.png
# Transform svg to ico
convert -density 256x256 -background transparent favicon.svg -define icon:auto-resize -colors 256 favicon.ico

# En este proyecto las imagenes usada se genera con el script ./temp/create-icons.sh
```
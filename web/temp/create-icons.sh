#!/bin/bash

# Modeo de invocacion:
# ./create-icons.sh

DESIRED_SIZES_ICO=(
'48'
'72'
'96'
'144'
'168'
'192'
)

DESIRED_SIZES_PNG=(
'192'
'384'
'512'
'1024'
)


function main () {
    if [ ! -f favicon.svg ]; then
        echo 'Se espera el logo bajo el nombre favicon.svg'
        exit 1
    fi

    convert -density 256x256 -background transparent favicon.svg -define icon:auto-resize -colors 256 favicon.ico
    convert -density 256x256 -background transparent favicon.svg -define icon:auto-resize -colors 256 favicon.png

    for size in "${DESIRED_SIZES_ICO[@]}"; do
        local icoFile="favicon_x${size}.ico"
        
        if [ -f $icoFile ]; then rm $icoFile; fi
        convert favicon.ico -resize "${size}x${size}" $icoFile
        
        if [ -f "../assets/${icoFile}" ]; then rm "../assets/${icoFile}"; fi
        mv $icoFile ../assets
        
        echo "Archivo creado: $icoFile y movido a assets"
    done

    for size in "${DESIRED_SIZES_PNG[@]}"; do
        local pngFile="logo${size}.png"
        
        if [ -f $pngFile ]; then rm $pngFile; fi
        convert favicon.png -resize "${size}x${size}" $pngFile
        
        if [ -f "../assets/${pngFile}" ]; then rm "../assets/${pngFile}"; fi
        mv $pngFile ../assets

        echo "Archivo creado: $pngFile y movido a assets"
    done

    echo 'Entra a https://maskable.app/editor y guardar un maskable_icon_x512.png'

    echo 'Pasar favicon.ico al estandar 16x16'
    convert favicon.ico -resize 16x16 favicon.ico
    rm ../assets/favicon.ico && mv favicon.ico ../assets

    # Quitar el archivo sobrante
    rm favicon.png
}

main
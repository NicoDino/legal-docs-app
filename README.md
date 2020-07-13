# legal-docs-app


## Pasos para deployar la app

- ng build --prod
- copiar el contenido del dist generado
- utilizando un cliente ftp (WinSCP por ejemplo) copiamos todos los archivos generados al servidor, en /var/www/legal-aid-app/. LOS ARCHIVOS DIRECTAMENTE, NO LOS ARCHIVOS DENTRO DE UNA CARPETA.

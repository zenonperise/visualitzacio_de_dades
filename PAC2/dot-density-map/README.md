# Dot Density Map

En aquesta carpeta es pot trobar un exemple de visualització del tipus Dot Entity Map. En concret, el mapa mostra algunes instal.lacions 
esportives a Catalunya categoritzades per tipus. 

Les dades han estat extretes del Cens d'equipaments esportius de Catalunya i posteriorment tractades amb l'script de python adjunt. 

La visualització s'ha implementat amb D3.js i Leaflet.js. Els mapes han estat extrets de OpenStreetMap.

Per visualitzar-lo cap obrir el fitxer html des d'un navegador. Per tal d'aconseguir això es pot arrancar un mini-servidor web de forma local. 
Obrir el fitxer directament, sense servidor web dona un problema de CORS. 

Comanda per arrancar un servidor web: 

docker run -p 80:80 -v "$(pwd)":/usr/share/nginx/html nginx

on $(pwd) es el directori on es troba el fitxer index.hml.

Seguidament es pot accedir, mitjancant un navegador a: http://localhost

## Links

* https://analisi.transparenciacatalunya.cat/Esport/Espais-esportius-i-complementaris-censats-al-Cens-/edxn-ww2s
* https://d3-graph-gallery.com/graph/bubblemap_leaflet_basic.html
* https://www.tutorialsteacher.com/d3js/loading-data-from-file-in-d3js
* https://leafletjs.com/SlavaUkraini/examples/quick-start/



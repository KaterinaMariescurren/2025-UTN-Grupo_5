
import requests

API_URL = "http://127.0.0.1:8000/puntos-impresion/" #si toquetean la url de la api modifiquen esto xD

# si encuentran mas puntos de impresion agreguenlo aca
puntos = [
  {
    "id": 2,
    "nombre": "Biblioteca Argentina para Ciegos",
    "direccion_texto": "Lezica 3909, CABA, Buenos Aires",
    "horario": "Lun a Vie: 9:00 - 17:00",
    "lat": -34.5654,
    "lng": -58.489
  },
  {
    "id": 3,
    "nombre": "Tiflolibros",
    "direccion_texto": "Av. Independencia 3065, CABA",
    "horario": "Lun a Vie: 10:00 - 18:00",
    "lat": -34.6177,
    "lng": -58.4058
  },
  {
    "id": 4,
    "nombre": "Biblioteca Braille de La Plata",
    "direccion_texto": "Calle 48 entre 5 y 6, La Plata, Buenos Aires",
    "horario": "Lun a Vie: 9:00 - 17:00",
    "lat": -34.9205,
    "lng": -57.9536
  },
  {
    "id": 5,
    "nombre": "Biblioteca Braille-Digital-Parlante",
    "direccion_texto": "Calle 5 N° 1381, La Plata, Buenos Aires",
    "horario": "Lun a Vie: 8:00 - 16:00",
    "lat": -34.919446,
    "lng": -57.938864
  }
]

for punto in puntos:
    try:
        response = requests.post(API_URL, json=punto)
        if response.status_code in (200, 201):
            print(f" punto creado: {punto['nombre']}")
        else:
            print(f" error creando {punto['nombre']}: {response.status_code} - {response.text}")
    except requests.exceptions.RequestException as e:
        print(f"No se pudo conectar al servidor: {e}")

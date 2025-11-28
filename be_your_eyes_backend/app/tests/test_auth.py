def test_register_persona(client):
    payload = {
        "email": "test@local.com",
        "contrasenia": "1234",
        "tipo": "persona",
        "persona": {
            "nombre": "nombre persona",
            "tipo": "persona"
        }
    }

    response = client.post("/register", json=payload)

    assert response.status_code == 200
    data = response.json()

    assert "access_token" in data
    assert data["token_type"] == "bearer"


def test_login(client):
    client.post("/register", json={
        "email": "login@test.com",
        "contrasenia": "abcd",
        "tipo": "persona",
        "persona": {
            "nombre": "Pepe Argento",
            "tipo": "persona"
        }
    })

    response = client.post("/login", json={
        "email": "login@test.com",
        "contrasenia": "abcd"
    })

    assert response.status_code == 200
    data = response.json()

    assert "access_token" in data
    assert data["tipo"] == "persona"


def test_obtener_local_id(client):
    l = client.post("/tipos_local/", json={"nombre": "Restaurante"})
    id_tipo = l.json()["id"]
    r = client.post("/register", json={
    "email": "local@test.com",
    "contrasenia": "123",
    "tipo": "local",
    "local": {
        "nombre": "Local Test",
        "telefono": "2284223567",
        "tipo_local_id": id_tipo,
        "direccion": {
            "calle": "Calle Falsa",
            "altura": "123",
            "codigo_postal": "7400"     
        },
        "horarios": [
            {
                "dia": "lunes",
                "horario_apertura": "09:00",
                "horario_cierre": "18:00"
            }
        ]
    }
})
  
    print(r.status_code, r.json())

    token = r.json()["access_token"]

    response = client.get(
        "/me/local_id",
        headers={"Authorization": f"Bearer {token}"}
    )

    assert response.status_code == 200
    assert "local_id" in response.json()

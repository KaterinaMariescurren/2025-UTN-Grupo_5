
def test_crear_tipo_local(client):
    data = {"nombre": "Restaurante"}
    response = client.post("/tipos_local/", json=data)
    assert response.status_code == 200
    assert response.json()["nombre"] == "Restaurante"
    assert "id" in response.json()


def test_listar_tipos_local(client):
    response = client.get("/tipos_local/")
    assert response.status_code == 200
    assert isinstance(response.json(), list)
    assert len(response.json()) >= 1

def test_obtener_tipo_local(client):
    # Creamos uno primero
    creado = client.post("/tipos_local/", json={"nombre": "Kiosco"}).json()

    response = client.get(f"/tipos_local/{creado['id']}")
    assert response.status_code == 200
    assert response.json()["nombre"] == "Kiosco"

def test_actualizar_tipo_local(client):
    creado = client.post("/tipos_local/", json={"nombre": "Bar"}).json()

    response = client.put(
        f"/tipos_local/{creado['id']}",
        json={"nombre": "Bar Actualizado"}
    )
    assert response.status_code == 200
    assert response.json()["nombre"] == "Bar Actualizado"

def test_eliminar_tipo_local(client):
    creado = client.post("/tipos_local/", json={"nombre": "Panadería"}).json()

    response = client.delete(f"/tipos_local/{creado['id']}")
    assert response.status_code == 200
    assert response.json()["nombre"] == "Panadería"

    # Verificar que ahora sí devuelve 404
    response2 = client.get(f"/tipos_local/{creado['id']}")
    assert response2.status_code == 404

def test_obtener_tipo_inexistente(client):
    response = client.get("/tipos_local/999999")
    assert response.status_code == 404

def test_eliminar_inexistente(client):
    response = client.delete("/tipos_local/999999")
    assert response.status_code == 404





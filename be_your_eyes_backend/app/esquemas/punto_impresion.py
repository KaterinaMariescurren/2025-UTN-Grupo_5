from pydantic import BaseModel

#para obtener
class PuntoImpresionSchema(BaseModel):
    id: int
    nombre: str
    direccion_texto: str
    horario: str | None = None
    lat: float
    lng: float
    

    class Config:
        orm_mode = True

#para crear
class PuntoImpresionCreate(BaseModel):
    nombre: str
    direccion_texto: str
    horario: str | None = None
    lat: float
    lng: float
    


# Para actualizar
class PuntoImpresionUpdate(BaseModel):
    nombre: str | None = None
    direccion_texto: str | None = None
    horario: str | None = None
    lat: float | None = None
    lng: float | None = None
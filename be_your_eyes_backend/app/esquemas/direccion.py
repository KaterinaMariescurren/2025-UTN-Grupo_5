from pydantic import BaseModel

class DireccionBase(BaseModel):
    altura: str
    calle: str
    codigo_postal: str

class DireccionCrear(DireccionBase):
    pass

class DireccionRespuesta(DireccionBase):
    id: int
    class Config:
        orm_mode = True
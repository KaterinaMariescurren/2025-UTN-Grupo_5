from pydantic import BaseModel

class TipoLocalBase(BaseModel):
    nombre: str

class TipoLocalCrear(TipoLocalBase):
    pass

class TipoLocalRespuesta(TipoLocalBase):
    id: int
    class Config:
        orm_mode = True
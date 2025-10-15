from pydantic import BaseModel, EmailStr
from typing import List, Optional

from app.esquemas.direccion import DireccionCrear
from app.esquemas.horario import HorarioCrear

class LocalBase(BaseModel):
    nombre: str
    telefono: str
    email: EmailStr
    direccion_id: int
    tipo_local_id: int

class LocalCrear(LocalBase):
    pass

class LocalRegistrar(BaseModel):
    nombre: str
    telefono: str
    tipo_local_id: int
    direccion: DireccionCrear
    horarios: List[HorarioCrear] = []

class LocalActualizar(BaseModel):
    nombre: Optional[str] = None
    telefono: Optional[str] = None
    email: Optional[EmailStr] = None
    direccion_id: Optional[int] = None
    tipo_local_id: Optional[int] = None

class LocalRespuesta(LocalBase):
    id: int

    class Config:
        orm_mode = True

from pydantic import BaseModel, EmailStr
from typing import List, Optional

from app.esquemas.direccion import DireccionCrear
from app.esquemas.horario import HorarioCrear
from app.esquemas.horario import HorarioRespuesta
from app.esquemas.direccion import DireccionRespuesta

class LocalBase(BaseModel):
    nombre: str
    telefono: str
    direccion_id: int
    tipo_local_id: int
    tiene_menu_accesible: bool = False
    tiene_qr: bool = False
    habilitado: bool = False

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
    direccion_id: Optional[int] = None
    tipo_local_id: Optional[int] = None

class LocalRespuesta(LocalBase):
    id: int
    horarios: List[HorarioRespuesta] = []
    direccion: Optional[DireccionRespuesta] = None
    class Config:
        orm_mode = True

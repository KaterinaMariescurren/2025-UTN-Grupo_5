from pydantic import BaseModel
from typing import Optional
from datetime import time

class HorarioBase(BaseModel):
    dia: str
    horario_apertura: time
    horario_cierre: time
    local_id: Optional[int] = None

class HorarioCrear(HorarioBase):
    pass

class HorarioActualizar(BaseModel):
    dia: Optional[str] = None
    horario_apertura: Optional[time] = None
    horario_cierre: Optional[time] = None
    local_id: Optional[int] = None

class HorarioRespuesta(HorarioBase):
    id: int

    class Config:
        orm_mode = True

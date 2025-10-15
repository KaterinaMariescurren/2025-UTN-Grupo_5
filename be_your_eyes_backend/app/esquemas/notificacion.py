from pydantic import BaseModel
from typing import Optional

class NotificacionBase(BaseModel):
    tiene_carta: bool
    persona_id: int
    local_id: int

class NotificacionCrear(NotificacionBase):
    pass

class NotificacionActualizar(BaseModel):
    tiene_carta: Optional[bool] = None
    persona_id: Optional[int] = None
    local_id: Optional[int] = None

class NotificacionRespuesta(NotificacionBase):
    id: int

    class Config:
        orm_mode = True

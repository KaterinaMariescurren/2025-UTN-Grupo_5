from pydantic import BaseModel, Field
from typing import Optional, List

class PlatoBase(BaseModel):
    nombre: str
    descripcion: Optional[str] = None
    precio: float
class PlatoCrear(BaseModel):
    nombre: str
    descripcion: Optional[str] = None
    precio: float
class PlatoOut(PlatoBase):
    id: int
    menu_categoria_id: int
    class Config:
        orm_mode = True
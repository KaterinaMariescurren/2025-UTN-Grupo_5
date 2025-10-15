from pydantic import BaseModel
from typing import List
from .categoria import CategoriaOut

class MenuOut(BaseModel):
    id: int
    nombre: str
    categorias: List[CategoriaOut] = []
    class Config:
        orm_mode = True

class MenuCrear(BaseModel):
    nombre: str
    local_id: int

class MenuUpdate(BaseModel):
    nombre: str


from pydantic import BaseModel
from typing import Optional, List
from .plato import PlatoOut

class CategoriaOut(BaseModel):
    id: int
    nombre: str
    platos: List[PlatoOut] = []
    class Config:
        orm_mode = True

class CategoriaCrear(BaseModel):
    nombre: str

class CategoriaUpdate(BaseModel):
    nombre: str


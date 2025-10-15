from pydantic import BaseModel, EmailStr
from typing import Optional

class PersonaBase(BaseModel):
    nombre: str
    email: EmailStr
    contrasenia: str
    tipo: str

class PersonaCrear(PersonaBase):
    pass

class PersonaRegistrar(BaseModel):
    nombre: str
    tipo: str  

class PersonaActualizar(BaseModel):
    nombre: Optional[str] = None
    email: Optional[EmailStr] = None
    contrasenia: Optional[str] = None
    tipo: Optional[str] = None

class PersonaRespuesta(PersonaBase):
    id: int

    class Config:
        orm_mode = True

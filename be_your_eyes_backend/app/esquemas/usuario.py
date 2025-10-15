from typing import Optional
from pydantic import BaseModel, EmailStr

from app.esquemas.local import LocalRegistrar
from app.esquemas.persona import PersonaRegistrar

class UsuarioCrear(BaseModel):
    email: EmailStr
    contrasenia: str
    tipo: str  # "persona" o "local"
    local: Optional[LocalRegistrar] = None
    persona: Optional[PersonaRegistrar] = None

class UsuarioLogin(BaseModel):
    email: EmailStr
    contrasenia: str

class UsuarioRespuesta(BaseModel):
    id: int
    email: EmailStr
    tipo: str

    class Config:
        from_attributes = True

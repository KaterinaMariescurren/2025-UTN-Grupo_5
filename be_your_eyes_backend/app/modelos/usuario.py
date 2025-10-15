from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from ..bd.sesion import Base

class Usuario(Base):
    __tablename__ = "usuario"
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(100), unique=True, nullable=False)
    contrasenia = Column(String(100), nullable=False)  # hash bcrypt
    tipo = Column(String(20), nullable=False)  # "persona" o "local"

    persona = relationship("Persona", back_populates="usuario", uselist=False)
    local = relationship("Local", back_populates="usuario", uselist=False)

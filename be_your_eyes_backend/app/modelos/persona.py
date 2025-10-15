from sqlalchemy import Column, ForeignKey, Integer, String
from sqlalchemy.orm import relationship
from ..bd.sesion import Base

class Persona(Base):
    __tablename__ = "persona"

    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(100), nullable=False)
    tipo = Column(String(20), nullable=False)
    usuario_id = Column(Integer, ForeignKey("usuario.id"), nullable=False, unique=True)

    usuario = relationship("Usuario", back_populates="persona")
    notificaciones = relationship("Notificacion", back_populates="persona")

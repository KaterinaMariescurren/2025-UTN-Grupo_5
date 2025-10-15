from sqlalchemy import Column, Integer, ForeignKey, Boolean
from sqlalchemy.orm import relationship
from ..bd.sesion import Base

class Notificacion(Base):
    __tablename__ = "notificacion"

    id = Column(Integer, primary_key=True, index=True)
    tiene_carta = Column(Boolean, default=False)

    persona_id = Column(Integer, ForeignKey("persona.id")) 
    local_id = Column(Integer, ForeignKey("local.id"))

    persona = relationship("Persona", back_populates="notificaciones") 
    local = relationship("Local", back_populates="notificaciones")

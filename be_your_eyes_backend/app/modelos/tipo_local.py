from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from ..bd.sesion import Base

class TipoLocal(Base):
    __tablename__ = "tipo_local"
    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String, nullable=False)

    locales = relationship("Local", back_populates="tipo_local")

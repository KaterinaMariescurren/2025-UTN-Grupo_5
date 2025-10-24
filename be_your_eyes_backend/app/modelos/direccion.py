from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from ..bd.sesion import Base

class Direccion(Base):
    __tablename__ = "direccion"
    id = Column(Integer, primary_key=True, index=True)
    altura = Column(String, nullable=False)
    calle = Column(String, nullable=False)
    codigo_postal = Column(String, nullable=False)

    local = relationship("Local", back_populates="direccion")

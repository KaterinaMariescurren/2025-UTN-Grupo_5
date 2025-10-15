from sqlalchemy import Column, Integer, String, ForeignKey, Float
from sqlalchemy.orm import relationship
from ..bd.sesion import Base

class Plato(Base):
    __tablename__ = "plato"
    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String, nullable=False)
    descripcion = Column(String, nullable=True)
    precio = Column(Float, nullable=False)
    categoria_id = Column(Integer, ForeignKey("categoria.id"), nullable=False)

    categoria = relationship("Categoria", back_populates="platos")
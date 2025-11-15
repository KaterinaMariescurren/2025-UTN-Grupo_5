from sqlalchemy import Column, Integer, String, ForeignKey, Float
from sqlalchemy.orm import relationship
from ..bd.sesion import Base

class Plato(Base):
    __tablename__ = "plato"
    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String, nullable=False)
    descripcion = Column(String, nullable=True)
    precio = Column(Float, nullable=False)
    menu_categoria_id = Column(Integer, ForeignKey("menu_categoria.id"), nullable=False)

    menu_categoria = relationship("MenuCategoria", back_populates="platos")

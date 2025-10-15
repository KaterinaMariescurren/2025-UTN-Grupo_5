from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from ..bd.sesion import Base

class Categoria(Base):
    __tablename__ = "categoria"
    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String, nullable=False)

    menu_categorias = relationship("MenuCategoria", back_populates="categoria", cascade="all, delete-orphan")
    platos = relationship("Plato", back_populates="categoria", cascade="all, delete-orphan")
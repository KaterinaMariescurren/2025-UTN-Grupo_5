from sqlalchemy import Column, Integer, String, Float, ForeignKey, Text
from sqlalchemy.orm import relationship
from ..bd.sesion import Base

class MenuCategoria(Base):
    __tablename__ = "menu_categoria"
    id = Column(Integer, primary_key=True, index=True)
    menu_id = Column(Integer, ForeignKey("menu.id"), nullable=False)
    categoria_id = Column(Integer, ForeignKey("categoria.id"), nullable=False)

    menu = relationship("Menu", back_populates="menu_categorias")
    categoria = relationship("Categoria", back_populates="menu_categorias")
    platos = relationship("Plato", back_populates="menu_categoria", cascade="all, delete-orphan")
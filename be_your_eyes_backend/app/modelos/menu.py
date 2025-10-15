from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from ..bd.sesion import Base

class Menu(Base):
    __tablename__ = "menu"
    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String, nullable=False)
    qr = Column(String, nullable=False)
    local_id = Column(Integer, ForeignKey("local.id"), nullable=False)

    menu_categorias = relationship("MenuCategoria", back_populates="menu", cascade="all, delete-orphan")
    local = relationship("Local", back_populates="menus")

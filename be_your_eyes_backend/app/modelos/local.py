from sqlalchemy import Column, Integer, String, ForeignKey, Boolean
from sqlalchemy.orm import relationship
from ..bd.sesion import Base

class Local(Base):
    __tablename__ = "local"
    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String, nullable=False)
    telefono = Column(String, nullable=False)
    direccion_id = Column(Integer, ForeignKey("direccion.id"), nullable=False)
    tipo_local_id = Column(Integer, ForeignKey("tipo_local.id"), nullable=False)
    usuario_id = Column(Integer, ForeignKey("usuario.id"), nullable=False, unique=True)
    tiene_menu_accesible = Column(Boolean, default=False)
    tiene_qr = Column(Boolean, default=False)

    usuario = relationship("Usuario", back_populates="local")
    tipo_local = relationship("TipoLocal", back_populates="locales")
    menus = relationship("Menu", back_populates="local", cascade="all, delete-orphan")
    horarios = relationship("Horario", back_populates="local", cascade="all, delete")
    notificaciones = relationship("Notificacion", back_populates="local")
    direccion = relationship("Direccion", back_populates="local", uselist=False)

from sqlalchemy import Column, Integer, String, Float
from ..bd.sesion import Base

class PuntoImpresion(Base):
    __tablename__ = "punto_impresion"
    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String, nullable=False)
    direccion_texto = Column(String, nullable=False)
    horario = Column(String, nullable=True) 
    lat = Column(Float, nullable=False) 
    lng = Column(Float, nullable=False) 
from sqlalchemy import Column, Integer, String, Time, ForeignKey
from sqlalchemy.orm import relationship
from ..bd.sesion import Base

class Horario(Base):
    __tablename__ = "horario"

    id = Column(Integer, primary_key=True, index=True)
    dia = Column(String(30), nullable=False)
    horario_apertura = Column(Time, nullable=False)
    horario_cierre = Column(Time, nullable=False)

    local_id = Column(Integer, ForeignKey("local.id"), nullable=False)

    local = relationship("Local", back_populates="horarios")

# app/crud/punto_impresion.py
from sqlalchemy.orm import Session
from app.modelos.punto_impresion import PuntoImpresion
from app.esquemas.punto_impresion import PuntoImpresionCreate, PuntoImpresionUpdate
from typing import List, Optional

def crear_punto_impresion(db: Session, punto: PuntoImpresionCreate) -> PuntoImpresion:
    nuevo_punto = PuntoImpresion(**punto.dict())
    db.add(nuevo_punto)
    db.commit()
    db.refresh(nuevo_punto)
    return nuevo_punto

def obtener_punto_impresion(db: Session, punto_id: int) -> Optional[PuntoImpresion]:
    return db.query(PuntoImpresion).filter(PuntoImpresion.id == punto_id).first()

def listar_puntos_impresion(
    db: Session, 
    nombre: Optional[str] = None, 
    ubicacion: Optional[str] = None
) -> List[PuntoImpresion]:
    query = db.query(PuntoImpresion)
    
    if nombre:
        query = query.filter(PuntoImpresion.nombre.ilike(f"%{nombre}%"))
    
    if ubicacion:
        query = query.filter(PuntoImpresion.direccion_texto.ilike(f"%{ubicacion}%"))
    
    return query.all()

def actualizar_punto_impresion(
    db: Session, 
    punto_id: int, 
    punto: PuntoImpresionCreate
) -> Optional[PuntoImpresion]:
    punto_db = obtener_punto_impresion(db, punto_id)
    if not punto_db:
        return None
    
    for key, value in punto.dict().items():
        setattr(punto_db, key, value)
    
    db.commit()
    db.refresh(punto_db)
    return punto_db

def eliminar_punto_impresion(db: Session, punto_id: int) -> bool:
    punto_db = obtener_punto_impresion(db, punto_id)
    if not punto_db:
        return False
    
    db.delete(punto_db)
    db.commit()
    return True
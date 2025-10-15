from sqlalchemy.orm import Session
from ..modelos.direccion import Direccion
from ..esquemas.direccion import DireccionCrear

def crear_direccion(db: Session, direccion: DireccionCrear):
    db_direccion = Direccion(**direccion.dict())
    db.add(db_direccion)
    db.commit()
    db.refresh(db_direccion)
    return db_direccion

def obtener_direccion(db: Session, direccion_id: int):
    return db.query(Direccion).filter(Direccion.id == direccion_id).first()

def listar_direcciones(db: Session):
    return db.query(Direccion).all()

def actualizar_direccion(db: Session, direccion_id: int, direccion_data: DireccionCrear):
    db_direccion = db.query(Direccion).filter(Direccion.id == direccion_id).first()
    if not db_direccion:
        return None
    update_data = direccion_data.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_direccion, key, value)
    db.commit()
    db.refresh(db_direccion)
    return db_direccion

def eliminar_direccion(db: Session, direccion_id: int):
    db_direccion = db.query(Direccion).filter(Direccion.id == direccion_id).first()
    if db_direccion:
        db.delete(db_direccion)
        db.commit()
    return db_direccion

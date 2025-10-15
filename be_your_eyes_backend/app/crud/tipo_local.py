from sqlalchemy.orm import Session
from ..modelos.tipo_local import TipoLocal
from ..esquemas.tipo_local import TipoLocalCrear

def crear_tipo_local(db: Session, tipo: TipoLocalCrear):
    db_tipo = TipoLocal(**tipo.dict())
    db.add(db_tipo)
    db.commit()
    db.refresh(db_tipo)
    return db_tipo

def obtener_tipo_local(db: Session, tipo_id: int):
    return db.query(TipoLocal).filter(TipoLocal.id == tipo_id).first()

def listar_tipos_local(db: Session):
    return db.query(TipoLocal).all()

def actualizar_tipo_local(db: Session, tipo_id: int, tipo_data: TipoLocalCrear):
    db_tipo = db.query(TipoLocal).filter(TipoLocal.id == tipo_id).first()
    if not db_tipo:
        return None
    update_data = tipo_data.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_tipo, key, value)
    db.commit()
    db.refresh(db_tipo)
    return db_tipo

def eliminar_tipo_local(db: Session, tipo_id: int):
    db_tipo = db.query(TipoLocal).filter(TipoLocal.id == tipo_id).first()
    if db_tipo:
        db.delete(db_tipo)
        db.commit()
    return db_tipo

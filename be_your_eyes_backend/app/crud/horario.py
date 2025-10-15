from sqlalchemy.orm import Session
from ..modelos.horario import Horario
from ..esquemas.horario import HorarioCrear, HorarioActualizar

def crear_horario(db: Session, horario: HorarioCrear):
    db_horario = Horario(**horario.dict())
    db.add(db_horario)
    db.commit()
    db.refresh(db_horario)
    return db_horario

def obtener_horario(db: Session, horario_id: int):
    return db.query(Horario).filter(Horario.id == horario_id).first()

def listar_horarios(db: Session):
    return db.query(Horario).all()

def actualizar_horario(db: Session, horario_id: int, horario_data: HorarioActualizar):
    db_horario = db.query(Horario).filter(Horario.id == horario_id).first()
    if not db_horario:
        return None
    update_data = horario_data.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_horario, key, value)
    db.commit()
    db.refresh(db_horario)
    return db_horario

def eliminar_horario(db: Session, horario_id: int):
    db_horario = db.query(Horario).filter(Horario.id == horario_id).first()
    if db_horario:
        db.delete(db_horario)
        db.commit()
    return db_horario

def listar_horarios_por_local(db: Session, local_id: int):
    return db.query(Horario).filter(Horario.local_id == local_id).all()

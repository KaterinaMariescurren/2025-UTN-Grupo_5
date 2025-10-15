from sqlalchemy.orm import Session
from ..modelos.notificacion import Notificacion
from ..esquemas.notificacion import NotificacionCrear, NotificacionActualizar

def crear_notificacion(db: Session, notificacion: NotificacionCrear):
    db_notificacion = Notificacion(**notificacion.dict())
    db.add(db_notificacion)
    db.commit()
    db.refresh(db_notificacion)
    return db_notificacion

def obtener_notificacion(db: Session, notificacion_id: int):
    return db.query(Notificacion).filter(Notificacion.id == notificacion_id).first()

def listar_notificaciones(db: Session):
    return db.query(Notificacion).all()

def listar_notificaciones_por_local(db: Session, local_id: int):
    return db.query(Notificacion).filter(Notificacion.local_id == local_id).all()

def listar_notificaciones_por_persona(db: Session, persona_id: int):
    return db.query(Notificacion).filter(Notificacion.persona_con_discapacidad_visual_id == persona_id).all()

def actualizar_notificacion(db: Session, notificacion_id: int, notificacion_data: NotificacionActualizar):
    db_notificacion = db.query(Notificacion).filter(Notificacion.id == notificacion_id).first()
    if not db_notificacion:
        return None
    update_data = notificacion_data.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_notificacion, key, value)
    db.commit()
    db.refresh(db_notificacion)
    return db_notificacion

def eliminar_notificacion(db: Session, notificacion_id: int):
    db_notificacion = db.query(Notificacion).filter(Notificacion.id == notificacion_id).first()
    if db_notificacion:
        db.delete(db_notificacion)
        db.commit()
    return db_notificacion

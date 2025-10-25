from sqlalchemy.orm import Session
from sqlalchemy import or_

from app.crud.usuario import crear_usuario
from app.modelos.direccion import Direccion
from app.modelos.horario import Horario
from app.modelos.menu import Menu
from ..modelos.local import Local
from ..esquemas.local import LocalCrear, LocalActualizar

def crear_local(db: Session, local: LocalCrear):
    db_local = Local(**local.dict())
    db.add(db_local)
    db.commit()
    db.refresh(db_local)
    return db_local

def registrar_local(db: Session, usuario_data, local_data):
    # Crear usuario
    usuario = crear_usuario(db, usuario_data.email, usuario_data.contrasenia, tipo="local")
    
    #  Crear dirección
    direccion = Direccion(**local_data.direccion.dict())
    db.add(direccion)
    db.commit()
    db.refresh(direccion)

    #  Crear local
    local = Local(
        nombre=local_data.nombre,
        telefono=local_data.telefono,
        tipo_local_id=local_data.tipo_local_id,
        usuario_id=usuario.id,
        direccion_id=direccion.id
    )
    db.add(local)
    db.commit()
    db.refresh(local)

    #  Crear horarios
    for h in local_data.horarios:
        horario = Horario(
            dia=h.dia,
            horario_apertura=h.horario_apertura,
            horario_cierre=h.horario_cierre,
            local_id=local.id
        )
        db.add(horario)
    db.commit()

    return usuario, local


def obtener_local(db: Session, local_id: int):
    return db.query(Local).filter(Local.id == local_id).first()

def listar_locales(db: Session):
    return db.query(Local).all()

def actualizar_local(db: Session, local_id: int, local_data: LocalActualizar):
    db_local = db.query(Local).filter(Local.id == local_id).first()
    if not db_local:
        return None
    update_data = local_data.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_local, key, value)
    db.commit()
    db.refresh(db_local)
    return db_local

def eliminar_local(db: Session, local_id: int):
    db_local = db.query(Local).filter(Local.id == local_id).first()
    if db_local:
        db.delete(db_local)
        db.commit()
    return db_local

def buscar_locales(db: Session, nombre: str = None, tipo_local_id: int = None, direccion_id: int = None):
    query = db.query(Local)
    if nombre:
        query = query.filter(Local.nombre.ilike(f"%{nombre}%"))
    if tipo_local_id:
        query = query.filter(Local.tipo_local_id == tipo_local_id)
    if direccion_id:
        query = query.filter(Local.direccion_id == direccion_id)
    return query.all()

def listar_locales_con_menus(db: Session):
    """Retorna lista de Local que tienen al menos un Menu asociado."""
    return db.query(Local).join(Menu).group_by(Local.id).all()
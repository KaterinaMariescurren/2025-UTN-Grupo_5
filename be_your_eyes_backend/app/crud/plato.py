from sqlalchemy.orm import Session
from app.esquemas import plato
from ..modelos.plato import Plato

def crear_plato(db: Session, menu_categoria_id: int, plato_en: plato.PlatoCrear) -> Plato:
    plato = Plato(
        nombre=plato_en.nombre,
        descripcion=plato_en.descripcion,
        precio=plato_en.precio,
        menu_categoria_id=menu_categoria_id
    )
    db.add(plato)
    db.commit()
    db.refresh(plato)
    return plato

def ver_platos_por_categorias(db: Session, menu_categoria_id: int):
    return db.query(Plato).filter(Plato.menu_categoria_id == menu_categoria_id).all()

def obtener_plato(db: Session, plato_id: int):
    return db.query(Plato).filter(Plato.id == plato_id).first()

def actualizar_plato(db: Session, plato_id: int, plato_en: plato.PlatoCrear):
    obj = obtener_plato(db, plato_id)
    if not obj:
        return None
    for k, v in plato_en.dict(exclude_unset=True).items():
        setattr(obj, k, v)
    db.commit()
    db.refresh(obj)
    return obj

def listar_platos(db: Session):
    return db.query(Plato).all()

def eliminar_plato(db: Session, plato_id: int) -> bool:
    obj = obtener_plato(db, plato_id)
    if not obj:
        return False
    db.delete(obj)
    db.commit()
    return True

from sqlalchemy.orm import Session
from app.modelos.categoria import Categoria

def crear_categoria(db: Session, nombre: str) -> Categoria:
    categoria = Categoria(nombre=nombre)
    db.add(categoria)
    db.commit()
    db.refresh(categoria)
    return categoria

def obtener_categoria(db: Session, categoria_id: int) -> Categoria:
    return db.query(Categoria).filter(Categoria.id == categoria_id).first()

def listar_categorias(db: Session):
    return db.query(Categoria).all()

def actualizar_categoria(db: Session, categoria_id: int, nombre: str) -> Categoria:
    categoria = obtener_categoria(db, categoria_id)
    if not categoria:
        return None
    categoria.nombre = nombre
    db.commit()
    db.refresh(categoria)
    return categoria

def eliminar_categoria(db: Session, categoria_id: int) -> bool:
    categoria = obtener_categoria(db, categoria_id)
    if not categoria:
        return False
    db.delete(categoria)
    db.commit()
    return True

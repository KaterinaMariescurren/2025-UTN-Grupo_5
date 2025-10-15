from sqlalchemy.orm import Session
from app.modelos.menu import Menu

def ver_menu_con_categorias(db: Session, menu_id: int):
    return db.query(Menu).filter(Menu.id == menu_id).first()

def obtener_menu(db: Session, menu_id: int) -> Menu:
    return db.query(Menu).filter(Menu.id == menu_id).first()

def listar_menus(db: Session):
    return db.query(Menu).all()

def listar_menus_por_local(db: Session, local_id: int):
    return db.query(Menu).filter(Menu.local_id == local_id).all()


def crear_menu(db: Session, nombre: str, local_id: int) -> Menu:
    menu = Menu(nombre=nombre, qr="", local_id=local_id)
    db.add(menu)
    db.commit()
    db.refresh(menu)
    return menu

def actualizar_menu(db: Session, menu_id: int, nombre: str = None, qr: str = None):
    menu = obtener_menu(db, menu_id)
    if not menu:
        return None
    if nombre is not None:
        menu.nombre = nombre
    if qr is not None:
        menu.qr = qr
    db.commit()
    db.refresh(menu)
    return menu

def eliminar_menu(db: Session, menu_id: int) -> bool:
    menu = obtener_menu(db, menu_id)
    if not menu:
        return False
    db.delete(menu)
    db.commit()
    return True

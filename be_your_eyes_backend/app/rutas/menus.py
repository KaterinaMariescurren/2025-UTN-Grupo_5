from fastapi import APIRouter, Depends, HTTPException, Response, Query
from sqlalchemy.orm import Session
from app.bd.sesion import get_db
from app.esquemas import plato,menu
from app.crud import menu as crud_menu, plato as crud_plato
from app.esquemas.categoria import CategoriaCrear
from app.modelos.categoria import Categoria
from app.modelos.menu_categoria import MenuCategoria
from app.modelos.plato import Plato
from app.utilidad.export_menu import export_menu_as_csv, export_menu_as_txt
from app.utilidad.auth import verificar_token

router = APIRouter(prefix="/menus", tags=["menus"], dependencies=[Depends(verificar_token)])

# Crear plato dentro de una categoría de un menú
@router.post("/{menu_id}/categorias/{categoria_id}/platos", response_model=plato.PlatoOut)
def crear_plato(menu_id: int, categoria_id: int, plato_in: plato.PlatoCrear, db: Session = Depends(get_db)):
    # Verificar que el menú existe
    menu = crud_menu.ver_menu_con_categorias(db, menu_id)
    if not menu:
        raise HTTPException(status_code=404, detail="Menú no encontrado")

    # Verificar que la categoría pertenece al menú
    relacion = db.query(MenuCategoria).filter(
        MenuCategoria.menu_id == menu_id,
        MenuCategoria.categoria_id == categoria_id
    ).first()
    if not relacion:
        raise HTTPException(status_code=404, detail="Categoría no pertenece a este menú")

    # Crear el plato asociado al MenuCategoria
    return crud_plato.crear_plato(db, relacion.id, plato_in)



@router.get("/local/{local_id}", response_model=list[menu.MenuOut])
def listar_menus_por_local(local_id: int, db: Session = Depends(get_db)):
    menus = crud_menu.listar_menus_por_local(db, local_id)
    if not menus:
        raise HTTPException(status_code=404, detail="No se encontraron menús para este local")
    return menus

@router.get("/{menu_id}/categorias")
def obtener_categorias_por_menu(menu_id: int, db: Session = Depends(get_db)):
    # Buscar las relaciones MenuCategoria
    menu_categorias = db.query(MenuCategoria).filter(MenuCategoria.menu_id == menu_id).all()
    if not menu_categorias:
        raise HTTPException(status_code=404, detail="No se encontraron categorías para este menú")
    
    # Extraer las categorías
    categorias = [mc.categoria for mc in menu_categorias]
    
    # Retornar solo campos necesarios
    return [{"id": c.id, "nombre": c.nombre} for c in categorias]

@router.post("/{menu_id}/categorias/")
def crear_categoria_en_menu(menu_id: int, categoria: CategoriaCrear, db: Session = Depends(get_db)):
    nombre = categoria.nombre.strip()
    if not nombre:
        raise HTTPException(status_code=400, detail="El nombre de la categoría es obligatorio")
    
    # Verificar si la categoría ya existe
    categoria_existente = db.query(Categoria).filter(Categoria.nombre.ilike(nombre)).first()
    if categoria_existente:
        # Verificar si ya está asociada a este menú
        relacion = db.query(MenuCategoria).filter(
            MenuCategoria.menu_id == menu_id,
            MenuCategoria.categoria_id == categoria_existente.id
        ).first()
        if relacion:
            raise HTTPException(status_code=400, detail="La categoría ya existe en este menú")
        # Si existe pero no está asociada al menú, crear la relación
        menu_categoria = MenuCategoria(menu_id=menu_id, categoria_id=categoria_existente.id)
        db.add(menu_categoria)
        db.commit()
        return {
            "id": categoria_existente.id,
            "nombre": categoria_existente.nombre,
            "menu_id": menu_id,
            "mensaje": "Categoría existente asociada al menú"
        }
    
    # Si no existe, crear categoría nueva
    nueva_categoria = Categoria(nombre=nombre)
    db.add(nueva_categoria)
    db.commit()
    db.refresh(nueva_categoria)
    
    # Asociarla al menú
    menu_categoria = MenuCategoria(menu_id=menu_id, categoria_id=nueva_categoria.id)
    db.add(menu_categoria)
    db.commit()
    
    return {
        "id": nueva_categoria.id,
        "nombre": nueva_categoria.nombre,
        "menu_id": menu_id,
        "mensaje": "Categoría creada y asociada al menú"
    }

@router.get("/{menu_id}/categorias/{categoria_id}/platos")
def obtener_platos_por_categoria(menu_id: int, categoria_id: int, db: Session = Depends(get_db)):
    # Verificar que la categoría pertenece al menú
    relacion = db.query(MenuCategoria).filter(
        MenuCategoria.menu_id == menu_id,
        MenuCategoria.categoria_id == categoria_id
    ).first()
    if not relacion:
        raise HTTPException(status_code=404, detail="La categoría no pertenece a este menú")
    
    # Obtener platos de la categoría
    platos = crud_plato.ver_platos_por_categorias(db, relacion.id)

    return [{"id": p.id, "nombre": p.nombre, "descripcion": p.descripcion, "precio": p.precio} for p in platos]

# Exportar menú en CSV o TXT
@router.get("/{menu_id}/export")
def exportar_menu(menu_id: int, formato: str = Query("csv", pattern="^(csv|txt)$"), db: Session = Depends(get_db)):
    menu = crud_menu.ver_menu_con_categorias(db, menu_id)
    if not menu:
        raise HTTPException(status_code=404, detail="Menú no encontrado")

    if formato == "csv":
        content = export_menu_as_csv(menu)
        return Response(content, media_type="text/csv", headers={
            "Content-Disposition": f"attachment; filename=menu_{menu_id}.csv"
        })
    else:  # formato == "txt"
        content = export_menu_as_txt(menu)
        return Response(content, media_type="text/plain; charset=utf-8", headers={
            "Content-Disposition": f"attachment; filename=menu_{menu_id}.txt"
        })

@router.post("/", response_model=menu.MenuOut)
def crear_menu(menu_in: menu.MenuCrear, db: Session = Depends(get_db)):
    return crud_menu.crear_menu(db, menu_in.nombre, menu_in.local_id)

@router.get("/", response_model=list[menu.MenuOut])
def listar_menus(db: Session = Depends(get_db)):
    return crud_menu.listar_menus(db)

@router.get("/{menu_id}", response_model=menu.MenuOut)
def obtener_menu(menu_id: int, db: Session = Depends(get_db)):
    menu_db = crud_menu.obtener_menu(db, menu_id)
    if not menu_db:
        raise HTTPException(status_code=404, detail="Menú no encontrado")
    return menu_db

@router.put("/{menu_id}", response_model=menu.MenuOut)
def actualizar_menu(menu_id: int, menu_in: menu.MenuUpdate, db: Session = Depends(get_db)):
    updated = crud_menu.actualizar_menu(db, menu_id, menu_in.nombre)
    if not updated:
        raise HTTPException(status_code=404, detail="Menú no encontrado")
    return updated

@router.delete("/{menu_id}")
def eliminar_menu(menu_id: int, db: Session = Depends(get_db)):
    ok = crud_menu.eliminar_menu(db, menu_id)
    if not ok:
        raise HTTPException(status_code=404, detail="Menú no encontrado")
    return {"ok": True}

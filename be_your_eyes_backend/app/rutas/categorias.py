from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.bd.sesion import get_db
from app.esquemas import categoria
from app.crud import categoria as crud_categoria
from app.utilidad.auth import verificar_token

router = APIRouter(prefix="/categorias", tags=["categorias"], dependencies=[Depends(verificar_token)])

@router.post("/", response_model=categoria.CategoriaOut)
def crear_categoria(categoria_in: categoria.CategoriaCrear, db: Session = Depends(get_db)):
    return crud_categoria.crear_categoria(db, categoria_in.nombre)

@router.get("/", response_model=list[categoria.CategoriaOut])
def listar_categorias(db: Session = Depends(get_db)):
    return crud_categoria.listar_categorias(db)

@router.get("/{categoria_id}", response_model=categoria.CategoriaOut)
def obtener_categoria(categoria_id: int, db: Session = Depends(get_db)):
    obj = crud_categoria.obtener_categoria(db, categoria_id)
    if not obj:
        raise HTTPException(status_code=404, detail="Categoría no encontrada")
    return obj

@router.put("/{categoria_id}", response_model=categoria.CategoriaOut)
def actualizar_categoria(categoria_id: int, categoria_in: categoria.CategoriaUpdate, db: Session = Depends(get_db)):
    updated = crud_categoria.actualizar_categoria(db, categoria_id, categoria_in.nombre)
    if not updated:
        raise HTTPException(status_code=404, detail="Categoría no encontrada")
    return updated

@router.delete("/{categoria_id}")
def eliminar_categoria(categoria_id: int, db: Session = Depends(get_db)):
    ok = crud_categoria.eliminar_categoria(db, categoria_id)
    if not ok:
        raise HTTPException(status_code=404, detail="Categoría no encontrada")
    return {"ok": True}

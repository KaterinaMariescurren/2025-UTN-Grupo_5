from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.bd.sesion import get_db
from app.esquemas import plato
from app.crud import plato as crud_plato
from app.utilidad.auth import verificar_token

router = APIRouter(prefix="/platos", tags=["platos"], dependencies=[Depends(verificar_token)])

# Crear plato directamente (sin menú/categoría explícito)
@router.post("/categoria/{categoria_id}", response_model=plato.PlatoOut)
def crear_plato(categoria_id: int, plato_in: plato.PlatoCrear, db: Session = Depends(get_db)):
    return crud_plato.crear_plato(db, categoria_id, plato_in)

# Obtener un plato
@router.get("/{plato_id}", response_model=plato.PlatoOut)
def obtener_plato(plato_id: int, db: Session = Depends(get_db)):
    obj = crud_plato.obtener_plato(db, plato_id)
    if not obj:
        raise HTTPException(status_code=404, detail="Plato no encontrado")
    return obj

# Listar todos los platos
@router.get("/", response_model=list[plato.PlatoOut])
def listar_platos(db: Session = Depends(get_db)):
    return crud_plato.listar_platos(db)

# Actualizar plato
@router.put("/{plato_id}", response_model=plato.PlatoOut)
def actualizar_plato(plato_id: int, plato_in: plato.PlatoCrear, db: Session = Depends(get_db)):
    updated = crud_plato.actualizar_plato(db, plato_id, plato_in)
    if not updated:
        raise HTTPException(status_code=404, detail="Plato no encontrado")
    return updated

# Eliminar plato
@router.delete("/{plato_id}")
def eliminar_plato(plato_id: int, db: Session = Depends(get_db)):
    ok = crud_plato.eliminar_plato(db, plato_id)
    if not ok:
        raise HTTPException(status_code=404, detail="Plato no encontrado")
    return {"ok": True}

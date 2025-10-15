from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from ..bd.sesion import get_db
from ..crud import local as crud_local
from ..esquemas.local import LocalCrear, LocalRespuesta, LocalActualizar

router = APIRouter(prefix="/locales", tags=["Locales"])

@router.post("/", response_model=LocalRespuesta)
def crear_local(local: LocalCrear, db: Session = Depends(get_db)):
    return crud_local.crear_local(db, local)

@router.get("/", response_model=List[LocalRespuesta])
def listar_locales(db: Session = Depends(get_db)):
    return crud_local.listar_locales(db)

@router.get("/{local_id}", response_model=LocalRespuesta)
def obtener_local(local_id: int, db: Session = Depends(get_db)):
    local = crud_local.obtener_local(db, local_id)
    if not local:
        raise HTTPException(status_code=404, detail="Local no encontrado")
    return local

@router.put("/{local_id}", response_model=LocalRespuesta)
def actualizar_local(local_id: int, local: LocalActualizar, db: Session = Depends(get_db)):
    actualizado = crud_local.actualizar_local(db, local_id, local)
    if not actualizado:
        raise HTTPException(status_code=404, detail="Local no encontrado")
    return actualizado

@router.delete("/{local_id}", response_model=LocalRespuesta)
def eliminar_local(local_id: int, db: Session = Depends(get_db)):
    eliminado = crud_local.eliminar_local(db, local_id)
    if not eliminado:
        raise HTTPException(status_code=404, detail="Local no encontrado")
    return eliminado

@router.get("/buscar/", response_model=List[LocalRespuesta])
def buscar_locales(nombre: str = None, tipo_local_id: int = None, direccion_id: int = None, db: Session = Depends(get_db)):
    return crud_local.buscar_locales(db, nombre, tipo_local_id, direccion_id)

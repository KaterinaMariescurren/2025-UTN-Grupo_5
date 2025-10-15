from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from ..bd.sesion import get_db
from ..crud import tipo_local as crud_tipo_local
from ..esquemas.tipo_local import TipoLocalCrear, TipoLocalRespuesta

router = APIRouter(prefix="/tipos_local", tags=["Tipos de Local"])

@router.post("/", response_model=TipoLocalRespuesta)
def crear_tipo(tipo: TipoLocalCrear, db: Session = Depends(get_db)):
    return crud_tipo_local.crear_tipo_local(db, tipo)

@router.get("/", response_model=List[TipoLocalRespuesta])
def listar_tipos(db: Session = Depends(get_db)):
    return crud_tipo_local.listar_tipos_local(db)

@router.get("/{tipo_id}", response_model=TipoLocalRespuesta)
def obtener_tipo(tipo_id: int, db: Session = Depends(get_db)):
    tipo = crud_tipo_local.obtener_tipo_local(db, tipo_id)
    if not tipo:
        raise HTTPException(status_code=404, detail="Tipo de local no encontrado")
    return tipo

@router.put("/{tipo_id}", response_model=TipoLocalRespuesta)
def actualizar_tipo(tipo_id: int, tipo: TipoLocalCrear, db: Session = Depends(get_db)):
    actualizado = crud_tipo_local.actualizar_tipo_local(db, tipo_id, tipo)
    if not actualizado:
        raise HTTPException(status_code=404, detail="Tipo de local no encontrado")
    return actualizado

@router.delete("/{tipo_id}", response_model=TipoLocalRespuesta)
def eliminar_tipo(tipo_id: int, db: Session = Depends(get_db)):
    eliminado = crud_tipo_local.eliminar_tipo_local(db, tipo_id)
    if not eliminado:
        raise HTTPException(status_code=404, detail="Tipo de local no encontrado")
    return eliminado

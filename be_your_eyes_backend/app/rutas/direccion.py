from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.utilidad.auth import verificar_token
from ..bd.sesion import get_db
from ..crud import direccion as crud_direccion
from ..esquemas.direccion import DireccionCrear, DireccionRespuesta

router = APIRouter(prefix="/direcciones", tags=["Direcciones"], dependencies=[Depends(verificar_token)])

@router.post("/", response_model=DireccionRespuesta)
def crear_direccion(direccion: DireccionCrear, db: Session = Depends(get_db)):
    return crud_direccion.crear_direccion(db, direccion)

@router.get("/", response_model=List[DireccionRespuesta])
def listar_direcciones(db: Session = Depends(get_db)):
    return crud_direccion.listar_direcciones(db)

@router.get("/{direccion_id}", response_model=DireccionRespuesta)
def obtener_direccion(direccion_id: int, db: Session = Depends(get_db)):
    direccion = crud_direccion.obtener_direccion(db, direccion_id)
    if not direccion:
        raise HTTPException(status_code=404, detail="Dirección no encontrada")
    return direccion

@router.put("/{direccion_id}", response_model=DireccionRespuesta)
def actualizar_direccion(direccion_id: int, direccion: DireccionCrear, db: Session = Depends(get_db)):
    actualizado = crud_direccion.actualizar_direccion(db, direccion_id, direccion)
    if not actualizado:
        raise HTTPException(status_code=404, detail="Dirección no encontrada")
    return actualizado

@router.delete("/{direccion_id}", response_model=DireccionRespuesta)
def eliminar_direccion(direccion_id: int, db: Session = Depends(get_db)):
    eliminado = crud_direccion.eliminar_direccion(db, direccion_id)
    if not eliminado:
        raise HTTPException(status_code=404, detail="Dirección no encontrada")
    return eliminado

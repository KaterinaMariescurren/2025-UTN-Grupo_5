# app/rutas/punto_impresion.py
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional

from app.utilidad.auth import verificar_token
from ..bd.sesion import get_db
from ..esquemas.punto_impresion import (
    PuntoImpresionSchema,
    PuntoImpresionCreate,
    #PuntoImpresionUpdate
)
from ..crud import punto_impresion as crud 

router = APIRouter(
    prefix="/puntos-impresion",
    tags=["Puntos de Impresión"],
    dependencies=[Depends(verificar_token)]
)

@router.get("/", response_model=List[PuntoImpresionSchema])
def obtener_puntos_impresion(
    db: Session = Depends(get_db),
    nombre: Optional[str] = None,
    ubicacion: Optional[str] = None
):
    return crud.listar_puntos_impresion(db, nombre, ubicacion) 

@router.get("/{punto_id}", response_model=PuntoImpresionSchema)
def obtener_punto_por_id(punto_id: int, db: Session = Depends(get_db)):
    punto = crud.obtener_punto_impresion(db, punto_id)
    if not punto:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Punto de impresión con ID {punto_id} no encontrado"
        )
    return punto

@router.post("/", response_model=PuntoImpresionSchema, status_code=status.HTTP_201_CREATED)
def crear_punto_impresion(punto: PuntoImpresionCreate, db: Session = Depends(get_db)):
    return crud.crear_punto_impresion(db, punto)  

@router.put("/{punto_id}", response_model=PuntoImpresionSchema)
def actualizar_punto_impresion(
    punto_id: int,
    punto: PuntoImpresionCreate,
    db: Session = Depends(get_db)
):
    punto_actualizado = crud.actualizar_punto_impresion(db, punto_id, punto)
    if not punto_actualizado:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Punto de impresión con ID {punto_id} no encontrado"
        )
    return punto_actualizado


@router.delete("/{punto_id}", status_code=status.HTTP_204_NO_CONTENT)
def eliminar_punto_impresion(punto_id: int, db: Session = Depends(get_db)):
    eliminado = crud.eliminar_punto_impresion(db, punto_id)
    if not eliminado:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Punto de impresión con ID {punto_id} no encontrado"
        )
    return None
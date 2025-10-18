# routers/puntos_impresion.py
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from ..bd.sesion import get_db
from ..modelos.punto_impresion import PuntoImpresion
from ..esquemas.punto_impresion import (
    PuntoImpresionSchema,
    PuntoImpresionCreate,
    PuntoImpresionUpdate
)

router = APIRouter(
    prefix="/puntos-impresion",
    tags=["Puntos de Impresión"]
)


# GET - Obtener todos los puntos con filtros opcionales
@router.get("/", response_model=List[PuntoImpresionSchema])
def obtener_puntos_impresion(
    db: Session = Depends(get_db),
    nombre: Optional[str] = None,
    ubicacion: Optional[str] = None
):
    query = db.query(PuntoImpresion)
    
    if nombre:
        query = query.filter(PuntoImpresion.nombre.ilike(f"%{nombre}%"))  #busco por nombre
    
    if ubicacion:
        query = query.filter(PuntoImpresion.direccion_texto.ilike(f"%{ubicacion}%")) #busco por direccion
    
    puntos = query.all()
    return puntos


# GET - Obtener un punto específico por ID
@router.get("/{punto_id}", response_model=PuntoImpresionSchema)
def obtener_punto_por_id(
    punto_id: int,
    db: Session = Depends(get_db)
):
    """
    Obtiene un punto de impresión específico por su ID.
    """
    punto = db.query(PuntoImpresion).filter(PuntoImpresion.id == punto_id).first()
    
    if not punto:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Punto de impresión con ID {punto_id} no encontrado"
        )
    
    return punto


# POST - Crear un nuevo punto de impresión
@router.post("/", response_model=PuntoImpresionSchema, status_code=status.HTTP_201_CREATED)
def crear_punto_impresion(
    punto: PuntoImpresionCreate,
    db: Session = Depends(get_db)
):
    nuevo_punto = PuntoImpresion(**punto.dict())
    
    db.add(nuevo_punto)
    db.commit()
    db.refresh(nuevo_punto)
    
    return nuevo_punto


# PUT - Actualizar un punto de impresión completo
@router.put("/{punto_id}", response_model=PuntoImpresionSchema)
def actualizar_punto_impresion(
    punto_id: int,
    punto: PuntoImpresionCreate,
    db: Session = Depends(get_db)
):
    """
    Actualiza todos los datos de un punto de impresión.
    """
    punto_db = db.query(PuntoImpresion).filter(PuntoImpresion.id == punto_id).first()
    
    if not punto_db:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Punto de impresión con ID {punto_id} no encontrado"
        )
    
    # Actualizar todos los campos
    for key, value in punto.dict().items():
        setattr(punto_db, key, value)
    
    db.commit()
    db.refresh(punto_db)
    
    return punto_db


# DELETE - Eliminar un punto de impresión
@router.delete("/{punto_id}", status_code=status.HTTP_204_NO_CONTENT)
def eliminar_punto_impresion(
    punto_id: int,
    db: Session = Depends(get_db)
):
    """
    Elimina un punto de impresión por su ID.
    """
    punto_db = db.query(PuntoImpresion).filter(PuntoImpresion.id == punto_id).first()
    
    if not punto_db:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Punto de impresión con ID {punto_id} no encontrado"
        )
    
    db.delete(punto_db)
    db.commit()
    
    return None
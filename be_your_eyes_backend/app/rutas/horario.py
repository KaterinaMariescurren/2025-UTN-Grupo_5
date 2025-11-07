from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.utilidad.auth import verificar_token
from ..bd.sesion import get_db
from ..crud import horario as crud_horario
from ..esquemas.horario import HorarioCrear, HorarioRespuesta, HorarioActualizar

router = APIRouter(prefix="/horarios", tags=["Horarios"], dependencies=[Depends(verificar_token)])

@router.post("/", response_model=HorarioRespuesta)
def crear_horario(horario: HorarioCrear, db: Session = Depends(get_db)):
    return crud_horario.crear_horario(db, horario)

@router.get("/", response_model=List[HorarioRespuesta])
def listar_horarios(db: Session = Depends(get_db)):
    return crud_horario.listar_horarios(db)

@router.get("/{horario_id}", response_model=HorarioRespuesta)
def obtener_horario(horario_id: int, db: Session = Depends(get_db)):
    horario = crud_horario.obtener_horario(db, horario_id)
    if not horario:
        raise HTTPException(status_code=404, detail="Horario no encontrado")
    return horario

@router.put("/{horario_id}", response_model=HorarioRespuesta)
def actualizar_horario(horario_id: int, horario: HorarioActualizar, db: Session = Depends(get_db)):
    actualizado = crud_horario.actualizar_horario(db, horario_id, horario)
    if not actualizado:
        raise HTTPException(status_code=404, detail="Horario no encontrado")
    return actualizado

@router.delete("/{horario_id}", response_model=HorarioRespuesta)
def eliminar_horario(horario_id: int, db: Session = Depends(get_db)):
    eliminado = crud_horario.eliminar_horario(db, horario_id)
    if not eliminado:
        raise HTTPException(status_code=404, detail="Horario no encontrado")
    return eliminado

@router.get("/local/{local_id}", response_model=List[HorarioRespuesta])
def listar_horarios_por_local(local_id: int, db: Session = Depends(get_db)):
    return crud_horario.listar_horarios_por_local(db, local_id)

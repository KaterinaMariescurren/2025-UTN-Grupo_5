from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from ..bd.sesion import get_db
from ..crud import notificacion as crud_notificacion
from ..esquemas.notificacion import NotificacionCrear, NotificacionRespuesta, NotificacionActualizar

router = APIRouter(prefix="/notificaciones", tags=["Notificaciones"])

@router.post("/", response_model=NotificacionRespuesta)
def crear_notificacion(notificacion: NotificacionCrear, db: Session = Depends(get_db)):
    return crud_notificacion.crear_notificacion(db, notificacion)

@router.get("/", response_model=List[NotificacionRespuesta])
def listar_notificaciones(db: Session = Depends(get_db)):
    return crud_notificacion.listar_notificaciones(db)

@router.get("/{notificacion_id}", response_model=NotificacionRespuesta)
def obtener_notificacion(notificacion_id: int, db: Session = Depends(get_db)):
    notif = crud_notificacion.obtener_notificacion(db, notificacion_id)
    if not notif:
        raise HTTPException(status_code=404, detail="Notificación no encontrada")
    return notif

@router.get("/local/{local_id}", response_model=List[NotificacionRespuesta])
def listar_por_local(local_id: int, db: Session = Depends(get_db)):
    return crud_notificacion.listar_notificaciones_por_local(db, local_id)

@router.get("/persona/{persona_id}", response_model=List[NotificacionRespuesta])
def listar_por_persona(persona_id: int, db: Session = Depends(get_db)):
    return crud_notificacion.listar_notificaciones_por_persona(db, persona_id)

@router.put("/{notificacion_id}", response_model=NotificacionRespuesta)
def actualizar_notificacion(notificacion_id: int, notificacion: NotificacionActualizar, db: Session = Depends(get_db)):
    actualizado = crud_notificacion.actualizar_notificacion(db, notificacion_id, notificacion)
    if not actualizado:
        raise HTTPException(status_code=404, detail="Notificación no encontrada")
    return actualizado

@router.delete("/{notificacion_id}", response_model=NotificacionRespuesta)
def eliminar_notificacion(notificacion_id: int, db: Session = Depends(get_db)):
    eliminado = crud_notificacion.eliminar_notificacion(db, notificacion_id)
    if not eliminado:
        raise HTTPException(status_code=404, detail="Notificación no encontrada")
    return eliminado

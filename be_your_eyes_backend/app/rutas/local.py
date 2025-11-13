from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.utilidad.auth import verificar_token
from ..bd.sesion import get_db
from ..crud import local as crud_local
from ..esquemas.local import LocalCrear, LocalRespuesta, LocalActualizar

router = APIRouter(prefix="/locales", tags=["Locales"], dependencies=[Depends(verificar_token)])

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

@router.get("/con_menus/", response_model=List[LocalRespuesta])
def listar_locales_con_menus(db: Session = Depends(get_db)):
    """Devuelve los locales que ofrecen al menos un menú."""
    return crud_local.listar_locales_con_menus(db)

# Habilitar o deshabilitar un local (solo administrador)
@router.patch("/{local_id}/habilitar", response_model=LocalRespuesta)
def cambiar_estado_local(
    local_id: int,
    habilitado: bool,
    db: Session = Depends(get_db),
    usuario: dict = Depends(verificar_token)  # el token devuelve info del usuario
):
    # Verificar que sea administrador
    if usuario.get("tipo") != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Solo los administradores pueden cambiar el estado de un local."
        )

    if habilitado == True:
        local = crud_local.habilitar_local(db, local_id)
    else :
        local = crud_local.deshabilitar_local(db, local_id)
    
    if not local:
        raise HTTPException(status_code=404, detail="Local no encontrado")
    return local
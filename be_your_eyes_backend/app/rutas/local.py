from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.utilidad.auth import verificar_token
from ..bd.sesion import get_db
from app.modelos.usuario import Usuario
from ..crud import local as crud_local
from ..esquemas.local import LocalCrear, LocalRespuesta, LocalActualizar
from pydantic import BaseModel

class MessageResponse(BaseModel):
    message: str

router = APIRouter(prefix="/locales", tags=["Locales"], dependencies=[Depends(verificar_token)])

@router.post("/", response_model=LocalRespuesta)
def crear_local(local: LocalCrear, db: Session = Depends(get_db)):
    return crud_local.crear_local(db, local)

@router.get("/", response_model=List[LocalRespuesta])
def listar_locales(db: Session = Depends(get_db), usuario: dict = Depends(verificar_token)):
    return crud_local.listar_locales(db, usuario)

@router.get("/{local_id}", response_model=LocalRespuesta)
def obtener_local(local_id: int, db: Session = Depends(get_db)):
    
    local = crud_local.obtener_local(db, local_id)
    if not local:
        raise HTTPException(status_code=404, detail="Local no encontrado")
    
    # Obtener el usuario asociado para incluir el email
    usuario = db.query(Usuario).filter(Usuario.id == local.usuario_id).first()
    
    # Crear respuesta con email
    local_dict = {
        "id": local.id,
        "nombre": local.nombre,
        "telefono": local.telefono,
        "direccion_id": local.direccion_id,
        "tipo_local_id": local.tipo_local_id,
        "tiene_menu_accesible": local.tiene_menu_accesible,
        "tiene_qr": local.tiene_qr,
        "habilitado": local.habilitado,
        "horarios": local.horarios,
        "direccion": local.direccion,
        "email": usuario.email if usuario else ""  # Agregar email
    }
    
    return local_dict


@router.put("/{local_id}", response_model=LocalRespuesta)
def actualizar_local(local_id: int, local: LocalActualizar, db: Session = Depends(get_db)):
    
    # Obtener el local
    db_local = crud_local.obtener_local(db, local_id)
    if not db_local:
        raise HTTPException(status_code=404, detail="Local no encontrado")
    
    # Actualizar datos del local
    if local.nombre:
        db_local.nombre = local.nombre
    if local.telefono:
        db_local.telefono = local.telefono
    if local.direccion_id:
        db_local.direccion_id = local.direccion_id
    if local.tipo_local_id:
        db_local.tipo_local_id = local.tipo_local_id
    
    # Actualizar email del usuario si se proporciona
    if local.email:
        usuario = db.query(Usuario).filter(Usuario.id == db_local.usuario_id).first()
        if usuario:
            usuario.email = local.email
    
    db.commit()
    db.refresh(db_local)
    
    # Obtener usuario para devolver el email
    usuario = db.query(Usuario).filter(Usuario.id == db_local.usuario_id).first()
    
    return {
        **db_local.__dict__,
        "email": usuario.email if usuario else ""
    }

@router.delete("/{local_id}", response_model=MessageResponse)
def eliminar_local(local_id: int, db: Session = Depends(get_db)):
    # Buscar el local
    db_local = crud_local.obtener_local(db, local_id)
    if not db_local:
        raise HTTPException(status_code=404, detail="Local no encontrado")
    
    # Borrar dependencias primero para evitar errores de constraints
    db.query(crud_local.Horario).filter(crud_local.Horario.local_id == local_id).delete()
    db.query(crud_local.Menu).filter(crud_local.Menu.local_id == local_id).delete()
    
    # Borrar el local
    db.delete(db_local)
    db.commit()

    return {"message": "Local eliminado correctamente"}


@router.get("/buscar/", response_model=List[LocalRespuesta])
def buscar_locales(nombre: str = None, tipo_local_id: int = None, direccion_id: int = None, db: Session = Depends(get_db), usuario: dict = Depends(verificar_token)):
    return crud_local.buscar_locales(db,usuario, nombre, tipo_local_id, direccion_id)

@router.get("/con_menus/", response_model=List[LocalRespuesta])
def listar_locales_con_menus(db: Session = Depends(get_db), usuario: dict = Depends(verificar_token)):
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
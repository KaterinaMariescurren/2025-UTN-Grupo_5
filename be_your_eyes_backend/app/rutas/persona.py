from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.utilidad.auth import verificar_token
from app.modelos.usuario import Usuario
from app.crud.usuario import eliminar_usuario
from ..bd.sesion import get_db
from ..crud import persona as crud_persona
from ..esquemas.persona import PersonaCrear, PersonaRespuesta, PersonaActualizar
from app.utilidad.auth import hash_password, verify_password

router = APIRouter(prefix="/personas", tags=["Personas"], dependencies=[Depends(verificar_token)])

@router.post("/", response_model=PersonaRespuesta)
def crear_persona(persona: PersonaCrear, db: Session = Depends(get_db)):
    return crud_persona.crear_persona(db, persona)

@router.get("/", response_model=List[PersonaRespuesta])
def listar_personas(db: Session = Depends(get_db)):
    return crud_persona.listar_personas(db)

@router.get("/{persona_id}", response_model=PersonaRespuesta)
def obtener_persona(persona_id: int, db: Session = Depends(get_db)):
    persona = crud_persona.obtener_persona(db, persona_id)
    if not persona:
        raise HTTPException(status_code=404, detail="Persona no encontrada")
    
    # Obtener el usuario asociado para devolver el email
    usuario = db.query(Usuario).filter(Usuario.id == persona.usuario_id).first()
    
    # Crear respuesta con email
    return PersonaRespuesta(
        id=persona.id,
        nombre=persona.nombre,
        email=usuario.email if usuario else "",
        contrasenia="",  # No devolvemos la contraseña por seguridad
        tipo=persona.tipo
    )

@router.put("/{persona_id}", response_model=PersonaRespuesta)
def actualizar_persona(persona_id: int, persona: PersonaActualizar, db: Session = Depends(get_db)):
    
    # Obtener la persona
    db_persona = crud_persona.obtener_persona(db, persona_id)
    if not db_persona:
        raise HTTPException(status_code=404, detail="Persona no encontrada")
    
    # Obtener el usuario asociado
    usuario = db.query(Usuario).filter(Usuario.id == db_persona.usuario_id).first()
    if not usuario:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    
    # Actualizar datos de persona
    if persona.nombre:
        db_persona.nombre = persona.nombre
    if persona.tipo:
        db_persona.tipo = persona.tipo
    
    # Actualizar email del usuario
    if persona.email:
        usuario.email = persona.email
    
    # Manejar cambio de contraseña
    if persona.contrasenia:
        # Si se proporciona contrasenia_actual, verificarla
        if hasattr(persona, 'contrasenia_actual') and persona.contrasenia_actual:
            if not verify_password(persona.contrasenia_actual, usuario.contrasenia):
                raise HTTPException(status_code=401, detail="Contraseña actual incorrecta")
        
        # Hash la nueva contraseña
        usuario.contrasenia = hash_password(persona.contrasenia)
    
    db.commit()
    db.refresh(db_persona)
    db.refresh(usuario)
    
    return PersonaRespuesta(
        id=db_persona.id,
        nombre=db_persona.nombre,
        email=usuario.email,
        contrasenia="",
        tipo=db_persona.tipo
    )


@router.delete("/{persona_id}")
def eliminar_persona(persona_id: int, db: Session = Depends(get_db)):
    
    # Obtener la persona
    db_persona = crud_persona.obtener_persona(db, persona_id)
    if not db_persona:
        raise HTTPException(status_code=404, detail="Persona no encontrada")
    
    # Guardar el usuario_id antes de borrar
    usuario_id = db_persona.usuario_id
    
    # Eliminar la persona primero
    db.delete(db_persona)
    db.commit()
    
    # Eliminar el usuario asociado
    if usuario_id:
        eliminar_usuario(db, usuario_id)
    
    return {"message": "Persona y usuario eliminados correctamente"}
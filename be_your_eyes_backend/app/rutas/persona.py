from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from ..bd.sesion import get_db
from ..crud import persona as crud_persona
from ..esquemas.persona import PersonaCrear, PersonaRespuesta, PersonaActualizar

router = APIRouter(prefix="/personas", tags=["Personas"])

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
    return persona

@router.put("/{persona_id}", response_model=PersonaRespuesta)
def actualizar_persona(persona_id: int, persona: PersonaActualizar, db: Session = Depends(get_db)):
    actualizado = crud_persona.actualizar_persona(db, persona_id, persona)
    if not actualizado:
        raise HTTPException(status_code=404, detail="Persona no encontrada")
    return actualizado

@router.delete("/{persona_id}", response_model=PersonaRespuesta)
def eliminar_persona(persona_id: int, db: Session = Depends(get_db)):
    eliminado = crud_persona.eliminar_persona(db, persona_id)
    if not eliminado:
        raise HTTPException(status_code=404, detail="Persona no encontrada")
    return eliminado

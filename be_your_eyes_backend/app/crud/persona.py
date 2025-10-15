from sqlalchemy.orm import Session
from app.crud.usuario import crear_usuario
from app.modelos.persona import Persona as PersonaModelo
from ..esquemas.persona import PersonaCrear, PersonaActualizar

def crear_persona(db: Session, persona: PersonaCrear):
    db_persona = PersonaModelo(**persona.dict())
    db.add(db_persona)
    db.commit()
    db.refresh(db_persona)
    return db_persona

def registrar_persona(db: Session, usuario_data, persona_data):
    usuario = crear_usuario(db, usuario_data.email, usuario_data.contrasenia, tipo="persona")

    persona = PersonaModelo(
        nombre=persona_data.nombre,
        tipo=persona_data.tipo,
        usuario_id=usuario.id
    )
    db.add(persona)
    db.commit()
    db.refresh(persona)

    return usuario, persona


def obtener_persona(db: Session, persona_id: int):
    return db.query(PersonaModelo).filter(PersonaModelo.id == persona_id).first()

def listar_personas(db: Session):
    return db.query(PersonaModelo).all()

def actualizar_persona(db: Session, persona_id: int, persona_data: PersonaActualizar):
    db_persona = db.query(PersonaModelo).filter(PersonaModelo.id == persona_id).first()
    if not db_persona:
        return None
    update_data = persona_data.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_persona, key, value)
    db.commit()
    db.refresh(db_persona)
    return db_persona

def eliminar_persona(db: Session, persona_id: int):
    db_persona = db.query(PersonaModelo).filter(PersonaModelo.id == persona_id).first()
    if db_persona:
        db.delete(db_persona)
        db.commit()
    return db_persona

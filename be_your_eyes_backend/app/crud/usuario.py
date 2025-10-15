from sqlalchemy.orm import Session
from ..modelos.usuario import Usuario
from ..utilidad.auth import hash_password, verify_password

def crear_usuario(db: Session, email: str, contrasenia: str, tipo: str):
    hashed = hash_password(contrasenia)
    usuario = Usuario(email=email, contrasenia=hashed, tipo=tipo)
    db.add(usuario)
    db.commit()
    db.refresh(usuario)
    return usuario

def autenticar_usuario(db: Session, email: str, contrasenia: str):
    usuario = db.query(Usuario).filter(Usuario.email == email).first()
    if not usuario:
        return None
    if not verify_password(contrasenia, usuario.contrasenia):
        return None
    return usuario

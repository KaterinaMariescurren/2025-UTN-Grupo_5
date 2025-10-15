from sqlalchemy.orm import Session
from fastapi import APIRouter
from fastapi import Depends, HTTPException
from app.bd.sesion import get_db
from app.modelos.local import Local
from app.modelos.usuario import Usuario
from ..esquemas.usuario import UsuarioCrear, UsuarioLogin
from ..crud.local import registrar_local
from ..crud.persona import registrar_persona
from ..utilidad.auth import crear_token, verificar_token



router = APIRouter(tags=["Auth"])

@router.post("/register")
def register(payload: UsuarioCrear, db: Session = Depends(get_db)):
    if payload.tipo == "local" and payload.local:
        usuario, local = registrar_local(db, payload, payload.local)
    elif payload.tipo == "persona" and payload.persona:
        usuario, persona = registrar_persona(db, payload, payload.persona)
    else:
        raise HTTPException(status_code=400, detail="Datos incompletos para el tipo de usuario")

    token = crear_token({"sub": usuario.email, "tipo": usuario.tipo})
    return {"access_token": token, "token_type": "bearer"}

@router.post("/login")
def login(payload: UsuarioLogin, db: Session = Depends(get_db)):
    from ..crud.usuario import autenticar_usuario
    usuario = autenticar_usuario(db, payload.email, payload.contrasenia)
    if not usuario:
        raise HTTPException(status_code=401, detail="Email o contraseña incorrectos")
    token = crear_token({"sub": usuario.email, "tipo": usuario.tipo})
    return {"access_token": token, "token_type": "bearer"}

@router.get("/me/local_id")
def obtener_local_id(
    user_data: dict = Depends(verificar_token),
    db: Session = Depends(get_db)
):
    # Buscar el usuario en la BD usando el email del token
    usuario = db.query(Usuario).filter(Usuario.email == user_data["email"]).first()
    if not usuario:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")

    # Verificar que tenga un local
    local = db.query(Local).filter(Local.usuario_id == usuario.id).first()
    if not local:
        raise HTTPException(status_code=404, detail="El usuario no tiene local asociado")

    return {"local_id": local.id}


# create_admin.py

from app.bd.sesion import SessionLocal
from app.modelos.usuario import Usuario
from app.utilidad.auth import hash_password  # si tienes hash de contraseñas

def create_admin_user():
    db = SessionLocal()

    # datos del admin
    email = "admin@example.com"
    password = "admin123"

    # Verificar si ya existe
    existing_user = db.query(Usuario).filter(Usuario.email == email).first()
    if existing_user:
        print("⚠️ El usuario administrador ya existe.")
        db.close()
        return

    # Crear nuevo usuario
    admin_user = Usuario(
        email=email,
        contrasenia=hash_password(password),  
        tipo="admin",  
    )

    db.add(admin_user)
    db.commit()
    db.refresh(admin_user)
    db.close()

    print(f"✅ Usuario administrador creado correctamente: {email}")

if __name__ == "__main__":
    create_admin_user()

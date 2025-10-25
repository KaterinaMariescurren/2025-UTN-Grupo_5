from fastapi import FastAPI
from app.bd.sesion import engine, Base 
from .rutas import menus, auth, platos, categorias,local, tipo_local,direccion,horario,persona,notificacion, punto_impresion
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="BeYourEyes Backend", version="0.1.0")


# Orígenes permitidos (puedes poner tu frontend o "*")
origins = [
    "http://localhost:3000",   # si tu frontend corre en React/Next.js
    "http://10.106.47.229:3000",  # ejemplo con tu IP local
    "http://10.106.47.229:8000",  # si también accedes directo a backend
    "*"  # permitir todos los orígenes (solo en desarrollo!)
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,            # orígenes permitidos
    allow_credentials=True,
    allow_methods=["*"],              # permitir todos los métodos (GET, POST, etc.)
    allow_headers=["*"],              # permitir todos los headers
)

Base.metadata.create_all(bind=engine)

# Incluir routers
app.include_router(menus.router)
app.include_router(platos.router)
app.include_router(categorias.router)
app.include_router(local.router)
app.include_router(tipo_local.router)
app.include_router(direccion.router)
app.include_router(horario.router)
app.include_router(persona.router)
app.include_router(notificacion.router)
app.include_router(punto_impresion.router)
app.include_router(auth.router)

@app.get("/")
def root():
    return {"message": "BeYourEyes API activa"}

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.bd.sesion import get_db
from app.utilidad.qr import generar_qr, respuesta_qr_png
from app.modelos.menu import Menu

router = APIRouter(prefix="/qr", tags=["QR"])

@router.get("/menu/{menu_id}")
def generar_qr_menu(
    menu_id: int,
    db: Session = Depends(get_db),
    download: bool = Query(True, description="Forzar descarga del QR (por defecto True)")
):
    """
    Genera un QR para un menú específico y permite descargarlo.
    """
    menu = db.query(Menu).filter(Menu.id == menu_id).first()
    if not menu:
        raise HTTPException(status_code=404, detail="Menú no encontrado")
    
    local_id = menu.local_id

    url_menu = f"https://beyoureyes.app/local/{local_id}/menu/{menu_id}"

    qr_bytes = generar_qr(url_menu)
    
    
    return respuesta_qr_png(qr_bytes, filename=f"menu_{menu_id}.png", download=download)

import qrcode
import io
from fastapi.responses import StreamingResponse
from pathlib import Path

def generar_qr(url: str, save_path: str | None = None):
    """
    Genera un código QR y lo devuelve como BytesIO o lo guarda en disco si se indica save_path.
    """
    qr_img = qrcode.make(url)
    buf = io.BytesIO()
    qr_img.save(buf, format="PNG")
    buf.seek(0)

    # Opcional: guardar archivo físico
    if save_path:
        Path(save_path).parent.mkdir(parents=True, exist_ok=True)
        with open(save_path, "wb") as f:
            f.write(buf.getvalue())

    return buf


def respuesta_qr_png(qr_bytes: io.BytesIO, filename: str = "qr.png", download: bool = True):
    """
    Devuelve el QR como StreamingResponse.
    Si download=True, fuerza descarga; si no, lo muestra inline.
    """
    disposition = "attachment" if download else "inline"
    return StreamingResponse(
        qr_bytes,
        media_type="image/png",
        headers={"Content-Disposition": f'{disposition}; filename="{filename}"'}
    )

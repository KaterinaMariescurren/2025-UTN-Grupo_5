from typing import List
from io import StringIO
import csv
from ..modelos.menu import Menu

def export_menu_as_csv(menu: Menu):
    output = StringIO()
    writer = csv.writer(output)
    writer.writerow(["categoria", "plato", "descripcion", "precio"])
    for mc in menu.menu_categorias:
        categoria = mc.categoria
        for p in categoria.platos:
            writer.writerow([categoria.nombre, p.nombre, p.descripcion or "", f"{p.precio:.2f}"])
    return output.getvalue().encode("utf-8")

def export_menu_as_txt(menu: Menu):
    lines = []
    lines.append(f"Menú: {menu.nombre}")
    lines.append("=" * 20)
    for mc in menu.menu_categorias:
        categoria = mc.categoria
        lines.append(f"\nCategoría: {categoria.nombre}")
        lines.append("-" * 15)
        for p in categoria.platos:
            lines.append(f"  {p.nombre} - {p.precio:.2f}")
            if p.descripcion:
                lines.append(f"    {p.descripcion}")
    return "\n".join(lines).encode("utf-8")

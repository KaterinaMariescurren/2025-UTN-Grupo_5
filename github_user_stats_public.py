import os
import subprocess
import pandas as pd
from github import Github

# ===============================
# 🔧 Configuración
# ===============================
REPO_NAME = "KaterinaMariescurren/2025-UTN-Grupo_5"  # Repo público
OUTPUT_CSV = "github_full_user_stats.csv"


GITHUB_TOKEN = os.getenv("GITHUB_TOKEN")
if GITHUB_TOKEN:
    print("🔐 Usando token de GitHub (mayor límite de requests).")
    g = Github(GITHUB_TOKEN)
else:
    print("🌐 Sin token: modo público (límite de 60 requests/hora).")
    g = Github()

repo = g.get_repo(REPO_NAME)

# ===============================
# 1️⃣ Extraer datos de Pull Requests
# ===============================
print("📥 Obteniendo PRs desde la API de GitHub...")
pr_data = {}

try:
    for pr in repo.get_pulls(state="all"):
        commits = pr.get_commits()
        for commit in commits:
            author = commit.author.login if commit.author else "unknown"
            stats = commit.stats
            if author not in pr_data:
                pr_data[author] = {"commits": 0, "additions": 0, "deletions": 0}
            pr_data[author]["commits"] += 1
            pr_data[author]["additions"] += stats.additions
            pr_data[author]["deletions"] += stats.deletions
except Exception as e:
    print(f"⚠️ Error obteniendo PRs: {e}")
    pr_data = {}

# ===============================
# 2️⃣ Extraer datos de Git local
# ===============================
print("📊 Obteniendo commits directos del repo local...")

try:
    git_log = subprocess.check_output(
        ["git", "log", "--all", "--pretty=format:%an", "--numstat"],
        universal_newlines=True
    )
except subprocess.CalledProcessError:
    print("❌ Error: asegúrate de ejecutar este script dentro del repositorio clonado.")
    exit(1)

local_data = {}
current_author = None

for line in git_log.splitlines():
    if not line.strip():
        continue
    if "\t" not in line:  # es un autor
        current_author = line.strip().lower()
        if current_author not in local_data:
            local_data[current_author] = {"commits": 0, "additions": 0, "deletions": 0}
        local_data[current_author]["commits"] += 1
    else:
        try:
            added, deleted, _ = line.split("\t")
            added = int(added) if added.isdigit() else 0
            deleted = int(deleted) if deleted.isdigit() else 0
            local_data[current_author]["additions"] += added
            local_data[current_author]["deletions"] += deleted
        except ValueError:
            continue

# ===============================
# 3️⃣ Combinar ambas fuentes
# ===============================
print("🔄 Combinando información de GitHub y Git local...")

combined = {}

def merge_data(target, source):
    for user, data in source.items():
        if user not in target:
            target[user] = {"commits": 0, "additions": 0, "deletions": 0}
        target[user]["commits"] += data["commits"]
        target[user]["additions"] += data["additions"]
        target[user]["deletions"] += data["deletions"]

merge_data(combined, pr_data)
merge_data(combined, local_data)

# ===============================
# 4️⃣ Generar CSV final
# ===============================
print(f"💾 Generando CSV: {OUTPUT_CSV}")

rows = []
for user, data in combined.items():
    total = data["additions"] + data["deletions"]
    rows.append({
        "usuario": user,
        "commits": data["commits"],
        "lineas_agregadas": data["additions"],
        "lineas_borradas": data["deletions"],
        "total_lineas_modificadas": total
    })

df = pd.DataFrame(rows).sort_values(by="total_lineas_modificadas", ascending=False)
df.to_csv(OUTPUT_CSV, index=False)

print("\n✅ Archivo generado correctamente:", OUTPUT_CSV)
print(df)

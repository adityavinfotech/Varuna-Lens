# 🌊 Varuna Lens

[![Ask DeepWiki](https://deepwiki.com/badge.svg)](https://deepwiki.com/adityavinfotech/Varuna-Lens)  
*AI-Powered Conversational Interface for ARGO Ocean Data Discovery and Visualization*

---

Varuna Lens is an **interactive AI platform** that lets you dive deep into the world’s oceans using ARGO float datasets.  
It combines **LLMs**, **structured databases**, and **rich visual dashboards** to make complex oceanographic data **accessible, intuitive, and visually stunning**.

---

## ✨ Features

- 💬 **Conversational AI** — Ask natural language questions like:
  - “Show me salinity profiles in the Arabian Sea (March 2023)”
  - “Compare temperature trends near the equator for the last 6 months”

- 🌍 **Interactive Geospatial Maps** — Explore ARGO float positions, trajectories, and clusters.

- 📊 **Dynamic Visualizations** — Depth vs. temperature/salinity plots, timelines, comparisons.

- 📂 **Multi-format Export** — Save insights as CSV, NetCDF, or PNG charts.

- 🧭 **Accessible to Everyone** — Scientists, students, and policymakers can explore without coding skills.

---

## 🛠️ Tech Stack

<details>
<summary><b>Backend</b></summary>

- Pure Python backend  
- **Data ingestion:** `xarray`, `netCDF4`, `pandas`  
- **Database:** PostgreSQL + FAISS/Chroma (vector search)  
- **LLM Interface:** RAG with Model Context Protocol (MCP)  
</details>

<details>
<summary><b>Frontend</b></summary>

- **Framework:** React + Next.js  
- **UI:** `shadcn/ui` + TailwindCSS (glassmorphism, ocean palette 🌊)  
- **Visualizations:** Plotly, Leaflet, Recharts  
</details>

<details>
<summary><b>Deployment</b></summary>

- Containerized with Docker  
- Cloud-ready (Vercel/Render for frontend, Supabase/Postgres for backend)  
</details>

---

## 🚀 Getting Started

```bash
# 1. Clone Repository
git clone https://github.com/your-org/varuna-lens.git
cd varuna-lens

# 2. Setup Environment
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# 3. Download ARGO Dataset (Indian Ocean MVP)
wget ftp://ftp.ifremer.fr/ifremer/argo/dac/ar_index_global_meta.txt

# 4. Run Backend
python app/main.py

# 5. Start Frontend
cd frontend
npm install
npm run dev

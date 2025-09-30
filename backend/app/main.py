from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import HTMLResponse, JSONResponse
from typing import List, Optional
from datetime import datetime

from .models.oceanographic import FloatMarker, HeatmapPoint, FloatTrajectory
from .visualization.folium_maps import OceanographicMapGenerator
from .services.sample_data import SampleDataGenerator

# Initialize FastAPI app
app = FastAPI(
    title="Varuna Lens API",
    description="AI-Powered Oceanographic Data Analysis Platform",
    version="1.0.0"
)

# Configure CORS for Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "https://varuna-lens.vercel.app"
    ],
    allow_credentials=True,
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)

# Initialize services
sample_generator = SampleDataGenerator()
map_generator = OceanographicMapGenerator()

@app.get("/")
async def root():
    """Root endpoint with API information"""
    return {
        "message": "Varuna Lens Oceanographic Data API",
        "version": "1.0.0",
        "status": "active",
        "endpoints": {
            "interactive_map": "/api/map/interactive",
            "argo_floats": "/api/floats",
            "temperature_data": "/api/data/temperature",
            "salinity_data": "/api/data/salinity"
        }
    }

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "timestamp": datetime.utcnow().isoformat()
    }

@app.get("/api/map/interactive", response_class=HTMLResponse)
async def get_interactive_map(
    center_lat: float = Query(15.0, ge=-90, le=90),
    center_lon: float = Query(68.0, ge=-180, le=180),
    include_temperature: bool = Query(True),
    include_salinity: bool = Query(False),
    include_trajectories: bool = Query(False)
):
    """Generate interactive Folium map with oceanographic data"""
    try:
        # Get data
        float_data = sample_generator.generate_sample_floats()
        temp_data = sample_generator.generate_temperature_heatmap_data() if include_temperature else None
        salinity_data = sample_generator.generate_salinity_heatmap_data() if include_salinity else None
        trajectories = sample_generator.generate_sample_trajectories() if include_trajectories else None
        
        # Generate map
        map_html = map_generator.generate_complete_map(
            float_data=float_data,
            temp_data=temp_data,
            salinity_data=salinity_data,
            trajectories=trajectories,
            center=[center_lat, center_lon]
        )
        
        return HTMLResponse(content=map_html)
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating map: {str(e)}")

@app.get("/api/floats", response_model=List[FloatMarker])
async def get_argo_floats(
    status: Optional[str] = Query(None),
    limit: int = Query(50, ge=1, le=200)
):
    """Get ARGO float data with current positions and measurements"""
    try:
        floats = sample_generator.generate_sample_floats()
        
        # Filter by status if specified
        if status:
            floats = [f for f in floats if f.status == status]
        
        return floats[:limit]
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching float data: {str(e)}")

@app.get("/api/data/temperature", response_model=List[HeatmapPoint])
async def get_temperature_data():
    """Get temperature data for heatmap visualization"""
    try:
        return sample_generator.generate_temperature_heatmap_data()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching temperature data: {str(e)}")

@app.get("/api/data/salinity", response_model=List[heatmapPoint])
async def get_salinity_data():
    """Get salinity data for heatmap visualization"""
    try:
        return sample_generator.generate_salinity_heatmap_data()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching salinity data: {str(e)}")

@app.get("/api/trajectories", response_model=List[FloatTrajectory])
async def get_float_trajectories(
    float_ids: Optional[str] = Query(None),
    limit: int = Query(10, ge=1, le=20)
):
    """Get float trajectory data"""
    try:
        trajectories = sample_generator.generate_sample_trajectories()
        
        # Filter by float IDs if specified
        if float_ids:
            requested_ids = [id.strip() for id in float_ids.split(',')]
            trajectories = [t for t in trajectories if t.float_id in requested_ids]
        
        return trajectories[:limit]
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching trajectory data: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=True
    )

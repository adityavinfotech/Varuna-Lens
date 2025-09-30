# Varuna Lens Backend

Python backend for the Varuna Lens AI-powered oceanographic data analysis platform.

## Features

- **FastAPI** - High-performance async API framework
- **Folium Maps** - Interactive oceanographic visualizations
- **Pydantic Models** - Type-safe data validation based on oceanographic standards
- **Sample Data Generation** - Realistic ARGO float and measurement data
- **CORS Support** - Ready for Next.js frontend integration

## Quick Start

### Prerequisites

- Python 3.8+
- pip or conda

### Installation

1. **Clone the repository** (if not already done):
   ```bash
   git clone https://github.com/adityavinfotech/Varuna-Lens.git
   cd Varuna-Lens/backend
   ```

2. **Create virtual environment**:
   ```bash
   python -m venv venv
   
   # Windows
   venv\Scripts\activate
   
   # macOS/Linux
   source venv/bin/activate
   ```

3. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

4. **Run the server**:
   ```bash
   python -m app.main
   ```

   Or using uvicorn directly:
   ```bash
   uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
   ```

5. **Access the API**:
   - API Documentation: http://localhost:8000/docs
   - Interactive Map: http://localhost:8000/api/map/interactive
   - Health Check: http://localhost:8000/health

## API Endpoints

### Core Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/` | GET | API information and status |
| `/health` | GET | Health check |
| `/docs` | GET | Interactive API documentation |

### Data Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/floats` | GET | ARGO float data with positions |
| `/api/data/temperature` | GET | Temperature heatmap data |
| `/api/data/salinity` | GET | Salinity heatmap data |
| `/api/trajectories` | GET | Float trajectory data |
| `/api/statistics` | GET | Overall data statistics |

### Visualization Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/map/interactive` | GET | Interactive Folium map (HTML) |

### Query Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/query` | POST | Advanced oceanographic data queries |

## Interactive Map Features

The `/api/map/interactive` endpoint generates a complete Folium map with:

### Base Layers
- **Ocean Base** - Specialized oceanographic basemap
- **Satellite** - High-resolution satellite imagery
- **Street Map** - OpenStreetMap for reference
- **Bathymetry** - Ocean depth visualization

### Data Layers
- **ARGO Floats** - Clustered markers with detailed popups
- **Temperature Heatmap** - Surface temperature distribution
- **Salinity Heatmap** - Salinity patterns
- **Float Trajectories** - Historical movement paths
- **Measurement Stations** - Fixed monitoring locations

### Interactive Controls
- **Layer Control** - Toggle different data layers
- **Fullscreen** - Expand map to full screen
- **Measure Tool** - Distance and area measurements
- **Mouse Position** - Real-time coordinates
- **Mini Map** - Overview navigation
- **Draw Tools** - Create custom shapes and annotations

### Query Parameters

```
GET /api/map/interactive?center_lat=15.0&center_lon=68.0&include_temperature=true&include_salinity=false&include_trajectories=true&time_range_hours=24
```

- `center_lat` - Map center latitude (-90 to 90)
- `center_lon` - Map center longitude (-180 to 180)
- `include_temperature` - Include temperature heatmap (boolean)
- `include_salinity` - Include salinity heatmap (boolean)
- `include_trajectories` - Include float trajectories (boolean)
- `time_range_hours` - Data time range in hours (1-168)

## Data Models

### ARGO Float Data
```json
{
  "id": "F001",
  "latitude": 15.5,
  "longitude": 68.2,
  "temperature": 28.5,
  "salinity": 35.2,
  "status": "active",
  "last_update": "2024-01-15T10:30:00Z",
  "depth": 10.5
}
```

### Heatmap Data Points
```json
{
  "latitude": 15.0,
  "longitude": 68.0,
  "value": 28.5,
  "parameter": "temperature"
}
```

### Oceanographic Measurements
```json
{
  "measurement_id": "550e8400-e29b-41d4-a716-446655440000",
  "timestamp": "2024-01-15T10:30:00Z",
  "location": {
    "latitude": 15.5,
    "longitude": 68.2,
    "depth": 10.5
  },
  "parameters": {
    "temperature": 28.5,
    "salinity": 35.2,
    "ph": 8.1,
    "dissolved_oxygen": 6.8
  },
  "quality_flags": {
    "temperature": 1,
    "salinity": 1
  },
  "metadata": {
    "instrument_type": "CTD",
    "platform": "float",
    "data_source": "IMOS"
  }
}
```

## Integration with Next.js Frontend

### API Client Example

```typescript
// lib/api.ts
const API_BASE_URL = 'http://localhost:8000'

export async function getInteractiveMap(): Promise<string> {
  const response = await fetch(`${API_BASE_URL}/api/map/interactive`)
  return response.text()
}

export async function getFloatData() {
  const response = await fetch(`${API_BASE_URL}/api/floats`)
  return response.json()
}
```

### React Component Example

```tsx
// components/PythonMap.tsx
import { useEffect, useState } from 'react'

export function PythonMap() {
  const [mapHtml, setMapHtml] = useState<string>('')

  useEffect(() => {
    fetch('http://localhost:8000/api/map/interactive')
      .then(response => response.text())
      .then(setMapHtml)
  }, [])

  return (
    <div 
      className="w-full h-full"
      dangerouslySetInnerHTML={{ __html: mapHtml }}
    />
  )
}
```

## Development

### Project Structure

```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py                 # FastAPI application
│   ├── models/
│   │   └── oceanographic.py    # Pydantic data models
│   ├── services/
│   │   ├── data_service.py     # Data query service
│   │   └── sample_data.py      # Sample data generator
│   └── visualization/
│       └── folium_maps.py      # Folium map generator
├── requirements.txt            # Python dependencies
└── README.md                  # This file
```

### Adding New Features

1. **New Data Models** - Add to `app/models/oceanographic.py`
2. **New API Endpoints** - Add to `app/main.py`
3. **New Visualizations** - Add to `app/visualization/folium_maps.py`
4. **New Data Sources** - Extend `app/services/data_service.py`

### Testing

```bash
# Install test dependencies
pip install pytest pytest-asyncio httpx

# Run tests
pytest
```

## Deployment

### Docker

```dockerfile
FROM python:3.9-slim

WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt

COPY app/ ./app/
EXPOSE 8000

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### Environment Variables

```bash
# .env
API_HOST=0.0.0.0
API_PORT=8000
CORS_ORIGINS=http://localhost:3000,https://varuna-lens.vercel.app
```

## Data Standards

This backend implements oceanographic data standards:

- **IODE Quality Flags** - International quality control standards
- **CF Conventions** - Climate and Forecast metadata conventions
- **ARGO Data Format** - Standard for autonomous float data
- **NetCDF Support** - Scientific data format compatibility

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## License

This project is part of the Varuna Lens oceanographic data platform.

## Support

For questions about the backend API:
- Check the interactive documentation at `/docs`
- Review the data models in `app/models/`
- See example usage in the integration section

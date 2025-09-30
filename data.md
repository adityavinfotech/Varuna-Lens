# Varuna Lens - Data Format Documentation

## Overview
Varuna Lens is an oceanographic data analysis platform that processes and visualizes marine environmental data. This document outlines the required data formats, structures, and specifications for optimal application performance.

## Core Data Types

### 1. Oceanographic Measurements

#### Primary Data Structure
\`\`\`json
{
  "measurement_id": "string (UUID)",
  "timestamp": "ISO 8601 datetime string",
  "location": {
    "latitude": "number (-90 to 90)",
    "longitude": "number (-180 to 180)",
    "depth": "number (meters, positive value)"
  },
  "parameters": {
    "temperature": "number (Celsius)",
    "salinity": "number (PSU - Practical Salinity Units)",
    "ph": "number (0-14 scale)",
    "dissolved_oxygen": "number (mg/L)",
    "turbidity": "number (NTU - Nephelometric Turbidity Units)",
    "conductivity": "number (mS/cm)",
    "pressure": "number (dbar)",
    "chlorophyll_a": "number (μg/L)",
    "nitrate": "number (μmol/L)",
    "phosphate": "number (μmol/L)",
    "silicate": "number (μmol/L)"
  },
  "quality_flags": {
    "temperature": "integer (0-9, IODE quality flags)",
    "salinity": "integer (0-9, IODE quality flags)",
    "ph": "integer (0-9, IODE quality flags)",
    "dissolved_oxygen": "integer (0-9, IODE quality flags)"
  },
  "metadata": {
    "instrument_type": "string",
    "platform": "string (ship, buoy, glider, etc.)",
    "cruise_id": "string",
    "station_id": "string",
    "data_source": "string",
    "processing_level": "string (raw, processed, quality_controlled)"
  }
}
\`\`\`

#### Quality Flag Standards (IODE)
- 0: No quality control performed
- 1: Good data
- 2: Probably good data
- 3: Probably bad data that are potentially correctable
- 4: Bad data
- 5: Value changed
- 6: Not used
- 7: Nominal value
- 8: Interpolated value
- 9: Missing value

### 2. Time Series Data

#### Format for Temporal Analysis
\`\`\`json
{
  "series_id": "string",
  "location": {
    "latitude": "number",
    "longitude": "number",
    "depth": "number",
    "station_name": "string"
  },
  "parameter": "string (temperature, salinity, etc.)",
  "unit": "string",
  "time_range": {
    "start": "ISO 8601 datetime",
    "end": "ISO 8601 datetime",
    "interval": "string (hourly, daily, monthly)"
  },
  "data_points": [
    {
      "timestamp": "ISO 8601 datetime",
      "value": "number",
      "quality_flag": "integer"
    }
  ],
  "statistics": {
    "min": "number",
    "max": "number",
    "mean": "number",
    "std_dev": "number",
    "count": "integer"
  }
}
\`\`\`

### 3. Spatial Grid Data

#### For Mapping and Visualization
\`\`\`json
{
  "grid_id": "string",
  "parameter": "string",
  "timestamp": "ISO 8601 datetime",
  "spatial_bounds": {
    "north": "number (latitude)",
    "south": "number (latitude)",
    "east": "number (longitude)",
    "west": "number (longitude)"
  },
  "resolution": {
    "lat_step": "number (degrees)",
    "lon_step": "number (degrees)"
  },
  "depth_level": "number (meters)",
  "unit": "string",
  "grid_data": [
    {
      "lat": "number",
      "lon": "number",
      "value": "number",
      "quality_flag": "integer"
    }
  ],
  "interpolation_method": "string (kriging, inverse_distance, etc.)",
  "data_coverage": "number (percentage 0-100)"
}
\`\`\`

### 4. Profile Data (CTD/Vertical Profiles)

#### Depth-based Measurements
\`\`\`json
{
  "profile_id": "string",
  "timestamp": "ISO 8601 datetime",
  "location": {
    "latitude": "number",
    "longitude": "number"
  },
  "cast_info": {
    "cast_number": "integer",
    "max_depth": "number (meters)",
    "instrument": "string"
  },
  "profile_data": [
    {
      "depth": "number (meters)",
      "temperature": "number (Celsius)",
      "salinity": "number (PSU)",
      "pressure": "number (dbar)",
      "density": "number (kg/m³)",
      "sound_velocity": "number (m/s)",
      "quality_flags": {
        "temperature": "integer",
        "salinity": "integer",
        "pressure": "integer"
      }
    }
  ]
}
\`\`\`

## File Format Support

### 1. CSV Format
\`\`\`csv
timestamp,latitude,longitude,depth,temperature,salinity,ph,dissolved_oxygen,quality_temp,quality_sal
2024-01-15T10:30:00Z,-23.5,151.2,10.5,24.8,35.2,8.1,6.8,1,1
2024-01-15T10:35:00Z,-23.5,151.2,20.0,24.2,35.3,8.0,6.7,1,1
\`\`\`

### 2. NetCDF Format
- CF Convention compliant
- Standard oceanographic variable names
- Proper coordinate systems (latitude, longitude, depth, time)
- Metadata attributes for units, long names, and quality information

### 3. JSON/GeoJSON
- For real-time data feeds
- API responses
- Spatial data with geographic context

## Database Schema Requirements

### Core Tables

#### measurements
\`\`\`sql
CREATE TABLE measurements (
    id UUID PRIMARY KEY,
    timestamp TIMESTAMPTZ NOT NULL,
    latitude DECIMAL(10,8) NOT NULL,
    longitude DECIMAL(11,8) NOT NULL,
    depth DECIMAL(10,3) NOT NULL,
    temperature DECIMAL(6,3),
    salinity DECIMAL(6,3),
    ph DECIMAL(4,2),
    dissolved_oxygen DECIMAL(6,3),
    turbidity DECIMAL(8,3),
    conductivity DECIMAL(8,3),
    pressure DECIMAL(8,3),
    chlorophyll_a DECIMAL(8,3),
    nitrate DECIMAL(8,3),
    phosphate DECIMAL(8,3),
    silicate DECIMAL(8,3),
    instrument_type VARCHAR(100),
    platform VARCHAR(100),
    cruise_id VARCHAR(50),
    station_id VARCHAR(50),
    data_source VARCHAR(100),
    processing_level VARCHAR(50),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
\`\`\`

#### quality_flags
\`\`\`sql
CREATE TABLE quality_flags (
    measurement_id UUID REFERENCES measurements(id),
    parameter VARCHAR(50) NOT NULL,
    flag_value INTEGER NOT NULL CHECK (flag_value >= 0 AND flag_value <= 9),
    flag_description TEXT,
    PRIMARY KEY (measurement_id, parameter)
);
\`\`\`

#### spatial_grids
\`\`\`sql
CREATE TABLE spatial_grids (
    id UUID PRIMARY KEY,
    parameter VARCHAR(50) NOT NULL,
    timestamp TIMESTAMPTZ NOT NULL,
    north_bound DECIMAL(10,8),
    south_bound DECIMAL(10,8),
    east_bound DECIMAL(11,8),
    west_bound DECIMAL(11,8),
    lat_resolution DECIMAL(10,8),
    lon_resolution DECIMAL(10,8),
    depth_level DECIMAL(10,3),
    unit VARCHAR(20),
    interpolation_method VARCHAR(50),
    data_coverage DECIMAL(5,2),
    created_at TIMESTAMPTZ DEFAULT NOW()
);
\`\`\`

## API Data Format

### Request Format
\`\`\`json
{
  "query": {
    "parameters": ["temperature", "salinity", "ph"],
    "spatial_bounds": {
      "north": -20.0,
      "south": -30.0,
      "east": 155.0,
      "west": 145.0
    },
    "temporal_bounds": {
      "start": "2024-01-01T00:00:00Z",
      "end": "2024-12-31T23:59:59Z"
    },
    "depth_range": {
      "min": 0,
      "max": 100
    },
    "quality_threshold": 2,
    "aggregation": "daily",
    "format": "json"
  }
}
\`\`\`

### Response Format
\`\`\`json
{
  "status": "success",
  "query_info": {
    "total_records": 15420,
    "processing_time": "0.45s",
    "data_coverage": 87.3
  },
  "data": [
    // Array of measurement objects as defined above
  ],
  "metadata": {
    "units": {
      "temperature": "Celsius",
      "salinity": "PSU",
      "ph": "pH units"
    },
    "coordinate_system": "WGS84",
    "vertical_datum": "Mean Sea Level"
  }
}
\`\`\`

## Data Validation Rules

### Required Fields
- timestamp (must be valid ISO 8601)
- latitude (-90 to 90)
- longitude (-180 to 180)
- depth (>= 0)
- At least one measurement parameter

### Value Ranges
- Temperature: -5°C to 40°C (typical ocean range)
- Salinity: 0 to 45 PSU
- pH: 6.0 to 9.0
- Dissolved Oxygen: 0 to 15 mg/L
- Turbidity: 0 to 1000 NTU
- Conductivity: 0 to 70 mS/cm

### Data Quality Requirements
- Missing values: Use null, not -999 or similar
- Timestamps must be in UTC
- Coordinates must use WGS84 datum
- Quality flags must follow IODE standards

## Sample Data Files

### Minimal CSV Example
\`\`\`csv
timestamp,latitude,longitude,depth,temperature,salinity
2024-01-15T10:00:00Z,-25.5,153.2,5.0,26.8,35.4
2024-01-15T10:05:00Z,-25.5,153.2,10.0,26.2,35.5
2024-01-15T10:10:00Z,-25.5,153.2,15.0,25.8,35.6
\`\`\`

### Complete JSON Example
\`\`\`json
{
  "measurement_id": "550e8400-e29b-41d4-a716-446655440000",
  "timestamp": "2024-01-15T10:30:00Z",
  "location": {
    "latitude": -25.5,
    "longitude": 153.2,
    "depth": 10.5
  },
  "parameters": {
    "temperature": 26.8,
    "salinity": 35.4,
    "ph": 8.1,
    "dissolved_oxygen": 6.8,
    "turbidity": 2.3,
    "conductivity": 54.2,
    "pressure": 10.6,
    "chlorophyll_a": 0.8
  },
  "quality_flags": {
    "temperature": 1,
    "salinity": 1,
    "ph": 1,
    "dissolved_oxygen": 1
  },
  "metadata": {
    "instrument_type": "CTD",
    "platform": "research_vessel",
    "cruise_id": "VL2024-001",
    "station_id": "STN-001",
    "data_source": "IMOS",
    "processing_level": "quality_controlled"
  }
}
\`\`\`

## Integration Guidelines

### Real-time Data Ingestion
- Use WebSocket connections for live data streams
- Implement data buffering for high-frequency measurements
- Support batch uploads for historical data

### Data Export Formats
- CSV: For spreadsheet analysis
- NetCDF: For scientific computing
- JSON: For web applications
- GeoJSON: For GIS applications

### Performance Considerations
- Index on timestamp, latitude, longitude for spatial-temporal queries
- Partition large tables by date ranges
- Use appropriate data types to minimize storage
- Implement data compression for archived data

## Contact & Support

For questions about data formats or integration:
- Technical Documentation: See API documentation
- Data Standards: Follow CF Conventions and IODE guidelines
- Quality Control: Implement automated validation checks
- Performance: Monitor query response times and optimize as needed
  
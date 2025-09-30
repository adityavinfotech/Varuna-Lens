from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime
from enum import Enum

class QualityFlag(int, Enum):
    """IODE Quality Flag Standards"""
    GOOD = 1
    PROBABLY_GOOD = 2
    BAD = 4
    MISSING = 9

class FloatMarker(BaseModel):
    """ARGO float marker data for Folium maps"""
    id: str
    latitude: float = Field(..., ge=-90, le=90)
    longitude: float = Field(..., ge=-180, le=180)
    temperature: Optional[float] = None
    salinity: Optional[float] = None
    status: str = Field(..., description="active, inactive, or maintenance")
    last_update: Optional[datetime] = None
    depth: Optional[float] = None

class HeatmapPoint(BaseModel):
    """Data point for temperature/salinity heatmaps"""
    latitude: float = Field(..., ge=-90, le=90)
    longitude: float = Field(..., ge=-180, le=180)
    value: float
    parameter: str  # temperature, salinity, etc.

class TrajectoryPoint(BaseModel):
    """Point in a float trajectory"""
    latitude: float = Field(..., ge=-90, le=90)
    longitude: float = Field(..., ge=-180, le=180)
    timestamp: datetime

class FloatTrajectory(BaseModel):
    """Complete trajectory for a float"""
    float_id: str
    points: List[TrajectoryPoint]

from typing import List, Dict, Any, Optional
from datetime import datetime, timedelta
import asyncio
from ..models.oceanographic import (
    OceanographicMeasurement, DataQuery, QualityFlag
)
from .sample_data import SampleDataGenerator

class DataService:
    """Service for handling oceanographic data operations"""
    
    def __init__(self):
        self.sample_generator = SampleDataGenerator()
        # In production, this would connect to a real database
        self._cached_measurements = None
        self._cache_timestamp = None
        self._cache_duration = timedelta(minutes=15)  # Cache for 15 minutes
    
    async def query_measurements(self, query: DataQuery) -> List[OceanographicMeasurement]:
        """Query oceanographic measurements based on criteria"""
        
        # Get all measurements (from cache or generate new)
        measurements = await self._get_measurements()
        
        # Apply filters
        filtered_measurements = []
        
        for measurement in measurements:
            # Check spatial bounds
            if query.spatial_bounds:
                if not self._is_within_spatial_bounds(measurement, query.spatial_bounds):
                    continue
            
            # Check temporal bounds
            if query.temporal_bounds:
                if not self._is_within_temporal_bounds(measurement, query.temporal_bounds):
                    continue
            
            # Check depth range
            if query.depth_range:
                if not self._is_within_depth_range(measurement, query.depth_range):
                    continue
            
            # Check quality threshold
            if query.quality_threshold:
                if not self._meets_quality_threshold(measurement, query.quality_threshold):
                    continue
            
            # Check parameters
            if query.parameters:
                if not self._has_required_parameters(measurement, query.parameters):
                    continue
            
            filtered_measurements.append(measurement)
        
        return filtered_measurements
    
    async def get_statistics(self) -> Dict[str, Any]:
        """Get overall data statistics"""
        
        measurements = await self._get_measurements()
        
        if not measurements:
            return {
                "total_measurements": 0,
                "date_range": None,
                "spatial_coverage": None,
                "parameters": {}
            }
        
        # Calculate statistics
        total_count = len(measurements)
        
        # Date range
        timestamps = [m.timestamp for m in measurements]
        date_range = {
            "start": min(timestamps).isoformat(),
            "end": max(timestamps).isoformat()
        }
        
        # Spatial coverage
        latitudes = [m.location.latitude for m in measurements]
        longitudes = [m.location.longitude for m in measurements]
        spatial_coverage = {
            "north": max(latitudes),
            "south": min(latitudes),
            "east": max(longitudes),
            "west": min(longitudes)
        }
        
        # Parameter statistics
        parameter_stats = {}
        
        # Temperature statistics
        temps = [m.parameters.temperature for m in measurements if m.parameters.temperature is not None]
        if temps:
            parameter_stats["temperature"] = {
                "count": len(temps),
                "min": min(temps),
                "max": max(temps),
                "mean": sum(temps) / len(temps),
                "unit": "°C"
            }
        
        # Salinity statistics
        salinities = [m.parameters.salinity for m in measurements if m.parameters.salinity is not None]
        if salinities:
            parameter_stats["salinity"] = {
                "count": len(salinities),
                "min": min(salinities),
                "max": max(salinities),
                "mean": sum(salinities) / len(salinities),
                "unit": "PSU"
            }
        
        # pH statistics
        ph_values = [m.parameters.ph for m in measurements if m.parameters.ph is not None]
        if ph_values:
            parameter_stats["ph"] = {
                "count": len(ph_values),
                "min": min(ph_values),
                "max": max(ph_values),
                "mean": sum(ph_values) / len(ph_values),
                "unit": "pH units"
            }
        
        # Dissolved oxygen statistics
        oxygen_values = [m.parameters.dissolved_oxygen for m in measurements if m.parameters.dissolved_oxygen is not None]
        if oxygen_values:
            parameter_stats["dissolved_oxygen"] = {
                "count": len(oxygen_values),
                "min": min(oxygen_values),
                "max": max(oxygen_values),
                "mean": sum(oxygen_values) / len(oxygen_values),
                "unit": "mg/L"
            }
        
        return {
            "total_measurements": total_count,
            "date_range": date_range,
            "spatial_coverage": spatial_coverage,
            "parameters": parameter_stats,
            "data_sources": self._get_data_sources_stats(measurements),
            "quality_distribution": self._get_quality_distribution(measurements)
        }
    
    async def _get_measurements(self) -> List[OceanographicMeasurement]:
        """Get measurements from cache or generate new ones"""
        
        current_time = datetime.utcnow()
        
        # Check if cache is valid
        if (self._cached_measurements is not None and 
            self._cache_timestamp is not None and
            current_time - self._cache_timestamp < self._cache_duration):
            return self._cached_measurements
        
        # Generate new measurements
        self._cached_measurements = self.sample_generator.generate_sample_measurements(500)
        self._cache_timestamp = current_time
        
        return self._cached_measurements
    
    def _is_within_spatial_bounds(self, measurement: OceanographicMeasurement, bounds) -> bool:
        """Check if measurement is within spatial bounds"""
        lat = measurement.location.latitude
        lon = measurement.location.longitude
        
        return (bounds.south <= lat <= bounds.north and
                bounds.west <= lon <= bounds.east)
    
    def _is_within_temporal_bounds(self, measurement: OceanographicMeasurement, bounds) -> bool:
        """Check if measurement is within temporal bounds"""
        return bounds.start <= measurement.timestamp <= bounds.end
    
    def _is_within_depth_range(self, measurement: OceanographicMeasurement, depth_range) -> bool:
        """Check if measurement is within depth range"""
        depth = measurement.location.depth
        return depth_range.min <= depth <= depth_range.max
    
    def _meets_quality_threshold(self, measurement: OceanographicMeasurement, threshold: QualityFlag) -> bool:
        """Check if measurement meets quality threshold"""
        if not measurement.quality_flags:
            return False
        
        # Check if any quality flag meets the threshold
        flags = [
            measurement.quality_flags.temperature,
            measurement.quality_flags.salinity,
            measurement.quality_flags.ph,
            measurement.quality_flags.dissolved_oxygen
        ]
        
        # Remove None values
        valid_flags = [f for f in flags if f is not None]
        
        if not valid_flags:
            return False
        
        # Check if at least one flag meets threshold (lower values are better)
        return any(flag <= threshold for flag in valid_flags)
    
    def _has_required_parameters(self, measurement: OceanographicMeasurement, required_params: List[str]) -> bool:
        """Check if measurement has required parameters"""
        params = measurement.parameters
        
        for param in required_params:
            if param == "temperature" and params.temperature is None:
                return False
            elif param == "salinity" and params.salinity is None:
                return False
            elif param == "ph" and params.ph is None:
                return False
            elif param == "dissolved_oxygen" and params.dissolved_oxygen is None:
                return False
            elif param == "turbidity" and params.turbidity is None:
                return False
            elif param == "conductivity" and params.conductivity is None:
                return False
            elif param == "pressure" and params.pressure is None:
                return False
            elif param == "chlorophyll_a" and params.chlorophyll_a is None:
                return False
        
        return True
    
    def _get_data_sources_stats(self, measurements: List[OceanographicMeasurement]) -> Dict[str, int]:
        """Get statistics about data sources"""
        sources = {}
        
        for measurement in measurements:
            if measurement.metadata and measurement.metadata.data_source:
                source = measurement.metadata.data_source
                sources[source] = sources.get(source, 0) + 1
        
        return sources
    
    def _get_quality_distribution(self, measurements: List[OceanographicMeasurement]) -> Dict[str, int]:
        """Get distribution of quality flags"""
        quality_dist = {}
        
        for measurement in measurements:
            if not measurement.quality_flags:
                continue
            
            flags = [
                measurement.quality_flags.temperature,
                measurement.quality_flags.salinity,
                measurement.quality_flags.ph,
                measurement.quality_flags.dissolved_oxygen
            ]
            
            for flag in flags:
                if flag is not None:
                    flag_name = flag.name
                    quality_dist[flag_name] = quality_dist.get(flag_name, 0) + 1
        
        return quality_dist

import random
import numpy as np
from datetime import datetime, timedelta
from typing import List
from ..models.oceanographic import (
    FloatMarker, HeatmapPoint, FloatTrajectory, TrajectoryPoint,
    OceanographicMeasurement, Location, OceanographicParameters,
    QualityFlags, Metadata, QualityFlag, Platform, ProcessingLevel
)

class SampleDataGenerator:
    """Generate sample oceanographic data for testing and demonstration"""
    
    def __init__(self):
        # Arabian Sea and Bay of Bengal bounds
        self.arabian_sea_bounds = {
            'lat_min': 8.0, 'lat_max': 25.0,
            'lon_min': 60.0, 'lon_max': 78.0
        }
        
        self.bay_of_bengal_bounds = {
            'lat_min': 5.0, 'lat_max': 22.0,
            'lon_min': 78.0, 'lon_max': 95.0
        }
        
        # Realistic oceanographic parameter ranges
        self.temp_range = {'min': 24.0, 'max': 32.0}  # Tropical waters
        self.salinity_range = {'min': 33.5, 'max': 37.0}  # Indian Ocean
        self.ph_range = {'min': 7.8, 'max': 8.3}
        self.oxygen_range = {'min': 4.0, 'max': 8.5}
        
        # Sample float IDs
        self.float_ids = [
            'F001', 'F002', 'F003', 'F004', 'F005', 'F006', 'F007', 'F008',
            'F009', 'F010', 'F011', 'F012', 'F013', 'F014', 'F015', 'F016'
        ]
    
    def generate_sample_floats(self, count: int = 16) -> List[FloatMarker]:
        """Generate sample ARGO float data"""
        floats = []
        
        for i in range(min(count, len(self.float_ids))):
            # Randomly choose region
            if random.choice([True, False]):
                # Arabian Sea
                lat = random.uniform(
                    self.arabian_sea_bounds['lat_min'],
                    self.arabian_sea_bounds['lat_max']
                )
                lon = random.uniform(
                    self.arabian_sea_bounds['lon_min'],
                    self.arabian_sea_bounds['lon_max']
                )
            else:
                # Bay of Bengal
                lat = random.uniform(
                    self.bay_of_bengal_bounds['lat_min'],
                    self.bay_of_bengal_bounds['lat_max']
                )
                lon = random.uniform(
                    self.bay_of_bengal_bounds['lon_min'],
                    self.bay_of_bengal_bounds['lon_max']
                )
            
            # Generate realistic measurements
            temperature = round(random.uniform(
                self.temp_range['min'], 
                self.temp_range['max']
            ), 1)
            
            salinity = round(random.uniform(
                self.salinity_range['min'],
                self.salinity_range['max']
            ), 1)
            
            # Determine status (most floats are active)
            status_weights = ['active'] * 7 + ['inactive'] * 2 + ['maintenance'] * 1
            status = random.choice(status_weights)
            
            # Generate last update time
            last_update = datetime.utcnow() - timedelta(
                minutes=random.randint(5, 1440)  # 5 minutes to 24 hours ago
            )
            
            float_marker = FloatMarker(
                id=self.float_ids[i],
                latitude=lat,
                longitude=lon,
                temperature=temperature,
                salinity=salinity,
                status=status,
                last_update=last_update,
                depth=random.uniform(0, 50)  # Surface measurements
            )
            
            floats.append(float_marker)
        
        return floats
    
    def generate_temperature_heatmap_data(self, count: int = 200) -> List[HeatmapPoint]:
        """Generate temperature heatmap data points"""
        points = []
        
        for _ in range(count):
            # Generate points across both regions
            if random.choice([True, False]):
                # Arabian Sea
                lat = random.uniform(
                    self.arabian_sea_bounds['lat_min'],
                    self.arabian_sea_bounds['lat_max']
                )
                lon = random.uniform(
                    self.arabian_sea_bounds['lon_min'],
                    self.arabian_sea_bounds['lon_max']
                )
                # Arabian Sea tends to be warmer
                temp_bias = 1.0
            else:
                # Bay of Bengal
                lat = random.uniform(
                    self.bay_of_bengal_bounds['lat_min'],
                    self.bay_of_bengal_bounds['lat_max']
                )
                lon = random.uniform(
                    self.bay_of_bengal_bounds['lon_min'],
                    self.bay_of_bengal_bounds['lon_max']
                )
                # Bay of Bengal slightly cooler
                temp_bias = -0.5
            
            # Generate temperature with spatial correlation
            base_temp = self._get_temperature_for_location(lat, lon)
            temperature = base_temp + temp_bias + random.uniform(-1.0, 1.0)
            
            point = HeatmapPoint(
                latitude=lat,
                longitude=lon,
                value=round(temperature, 1),
                parameter='temperature'
            )
            
            points.append(point)
        
        return points
    
    def generate_salinity_heatmap_data(self, count: int = 150) -> List[HeatmapPoint]:
        """Generate salinity heatmap data points"""
        points = []
        
        for _ in range(count):
            # Generate points across both regions
            if random.choice([True, False]):
                # Arabian Sea
                lat = random.uniform(
                    self.arabian_sea_bounds['lat_min'],
                    self.arabian_sea_bounds['lat_max']
                )
                lon = random.uniform(
                    self.arabian_sea_bounds['lon_min'],
                    self.arabian_sea_bounds['lon_max']
                )
                # Arabian Sea has higher salinity
                salinity_bias = 0.8
            else:
                # Bay of Bengal
                lat = random.uniform(
                    self.bay_of_bengal_bounds['lat_min'],
                    self.bay_of_bengal_bounds['lat_max']
                )
                lon = random.uniform(
                    self.bay_of_bengal_bounds['lon_min'],
                    self.bay_of_bengal_bounds['lon_max']
                )
                # Bay of Bengal has lower salinity due to river input
                salinity_bias = -1.2
            
            # Generate salinity with spatial correlation
            base_salinity = 35.0  # Base salinity
            salinity = base_salinity + salinity_bias + random.uniform(-0.5, 0.5)
            
            point = HeatmapPoint(
                latitude=lat,
                longitude=lon,
                value=round(salinity, 1),
                parameter='salinity'
            )
            
            points.append(point)
        
        return points
    
    def generate_sample_trajectories(self, count: int = 6) -> List[FloatTrajectory]:
        """Generate sample float trajectories"""
        trajectories = []
        
        for i in range(count):
            float_id = self.float_ids[i]
            
            # Generate trajectory points over time
            points = []
            current_time = datetime.utcnow() - timedelta(days=30)
            
            # Starting position
            if i % 2 == 0:
                # Start in Arabian Sea
                start_lat = random.uniform(
                    self.arabian_sea_bounds['lat_min'],
                    self.arabian_sea_bounds['lat_max']
                )
                start_lon = random.uniform(
                    self.arabian_sea_bounds['lon_min'],
                    self.arabian_sea_bounds['lon_max']
                )
            else:
                # Start in Bay of Bengal
                start_lat = random.uniform(
                    self.bay_of_bengal_bounds['lat_min'],
                    self.bay_of_bengal_bounds['lat_max']
                )
                start_lon = random.uniform(
                    self.bay_of_bengal_bounds['lon_min'],
                    self.bay_of_bengal_bounds['lon_max']
                )
            
            current_lat = start_lat
            current_lon = start_lon
            
            # Generate trajectory points (every 3 days for 30 days)
            for day in range(0, 30, 3):
                # Add some drift (realistic ocean current movement)
                drift_lat = random.uniform(-0.1, 0.1)  # ~11 km max drift
                drift_lon = random.uniform(-0.1, 0.1)
                
                current_lat += drift_lat
                current_lon += drift_lon
                
                # Keep within reasonable bounds
                current_lat = max(5.0, min(25.0, current_lat))
                current_lon = max(60.0, min(95.0, current_lon))
                
                point = TrajectoryPoint(
                    latitude=current_lat,
                    longitude=current_lon,
                    timestamp=current_time + timedelta(days=day)
                )
                
                points.append(point)
            
            trajectory = FloatTrajectory(
                float_id=float_id,
                points=points
            )
            
            trajectories.append(trajectory)
        
        return trajectories
    
    def generate_sample_measurements(self, count: int = 100) -> List[OceanographicMeasurement]:
        """Generate sample oceanographic measurements"""
        measurements = []
        
        for _ in range(count):
            # Random location
            if random.choice([True, False]):
                lat = random.uniform(
                    self.arabian_sea_bounds['lat_min'],
                    self.arabian_sea_bounds['lat_max']
                )
                lon = random.uniform(
                    self.arabian_sea_bounds['lon_min'],
                    self.arabian_sea_bounds['lon_max']
                )
            else:
                lat = random.uniform(
                    self.bay_of_bengal_bounds['lat_min'],
                    self.bay_of_bengal_bounds['lat_max']
                )
                lon = random.uniform(
                    self.bay_of_bengal_bounds['lon_min'],
                    self.bay_of_bengal_bounds['lon_max']
                )
            
            # Random depth
            depth = random.uniform(0, 200)
            
            # Generate parameters
            parameters = OceanographicParameters(
                temperature=round(random.uniform(
                    self.temp_range['min'], 
                    self.temp_range['max']
                ), 2),
                salinity=round(random.uniform(
                    self.salinity_range['min'],
                    self.salinity_range['max']
                ), 2),
                ph=round(random.uniform(
                    self.ph_range['min'],
                    self.ph_range['max']
                ), 2),
                dissolved_oxygen=round(random.uniform(
                    self.oxygen_range['min'],
                    self.oxygen_range['max']
                ), 2),
                pressure=round(depth * 1.025, 1),  # Approximate pressure from depth
                chlorophyll_a=round(random.uniform(0.1, 2.0), 2)
            )
            
            # Quality flags (mostly good data)
            quality_flags = QualityFlags(
                temperature=random.choice([QualityFlag.GOOD] * 8 + [QualityFlag.PROBABLY_GOOD] * 2),
                salinity=random.choice([QualityFlag.GOOD] * 8 + [QualityFlag.PROBABLY_GOOD] * 2),
                ph=random.choice([QualityFlag.GOOD] * 7 + [QualityFlag.PROBABLY_GOOD] * 3),
                dissolved_oxygen=random.choice([QualityFlag.GOOD] * 8 + [QualityFlag.PROBABLY_GOOD] * 2)
            )
            
            # Metadata
            metadata = Metadata(
                instrument_type=random.choice(['CTD', 'ARGO_FLOAT', 'GLIDER', 'MOORING']),
                platform=random.choice([Platform.FLOAT, Platform.SHIP, Platform.GLIDER]),
                cruise_id=f"VL2024-{random.randint(1, 20):03d}",
                station_id=f"STN-{random.randint(1, 100):03d}",
                data_source="IMOS",
                processing_level=ProcessingLevel.QUALITY_CONTROLLED
            )
            
            # Create measurement
            measurement = OceanographicMeasurement(
                timestamp=datetime.utcnow() - timedelta(
                    hours=random.randint(1, 168)  # Last week
                ),
                location=Location(
                    latitude=lat,
                    longitude=lon,
                    depth=depth
                ),
                parameters=parameters,
                quality_flags=quality_flags,
                metadata=metadata
            )
            
            measurements.append(measurement)
        
        return measurements
    
    def _get_temperature_for_location(self, lat: float, lon: float) -> float:
        """Get realistic temperature based on location"""
        # Simple model: temperature decreases with latitude
        # and has some longitudinal variation
        
        base_temp = 30.0  # Tropical base temperature
        
        # Latitude effect (cooler towards north)
        lat_effect = -(lat - 10) * 0.2
        
        # Longitude effect (Arabian Sea warmer than Bay of Bengal)
        if lon < 78:  # Arabian Sea
            lon_effect = 0.5
        else:  # Bay of Bengal
            lon_effect = -0.3
        
        return base_temp + lat_effect + lon_effect

import folium
import pandas as pd
import numpy as np
from folium import plugins
from typing import List, Dict, Optional, Tuple
import json
from datetime import datetime
import branca.colormap as cm
from ..models.oceanographic import FloatMarker, HeatmapPoint, FloatTrajectory

class OceanographicMapGenerator:
    """Generate interactive oceanographic maps using Folium"""
    
    def __init__(self):
        # Default center for Arabian Sea/Indian Ocean
        self.default_center = [15.0, 68.0]
        self.default_zoom = 6
        
        # Color schemes for different parameters
        self.color_schemes = {
            'temperature': ['#000080', '#0000FF', '#00FFFF', '#00FF00', '#FFFF00', '#FF8000', '#FF0000'],
            'salinity': ['#E8F4FD', '#B3D9F2', '#7FBEE3', '#4BA3D0', '#1F88BD', '#0F6DAA', '#0A5297'],
            'chlorophyll': ['#000033', '#000055', '#000077', '#004400', '#008800', '#00BB00', '#00FF00'],
            'oxygen': ['#8B0000', '#CD5C5C', '#F0E68C', '#98FB98', '#00CED1', '#0000CD', '#000080']
        }
    
    def create_base_map(self, 
                       center: Optional[List[float]] = None, 
                       zoom: int = 6,
                       style: str = 'ocean') -> folium.Map:
        """Create base oceanographic map with custom styling"""
        center = center or self.default_center
        
        # Create map with custom configuration
        m = folium.Map(
            location=center,
            zoom_start=zoom,
            tiles=None,
            prefer_canvas=True,
            control_scale=True
        )
        
        # Add different base layers
        if style == 'ocean':
            # Ocean-focused basemap
            folium.TileLayer(
                tiles='https://server.arcgisonline.com/ArcGIS/rest/services/Ocean/World_Ocean_Base/MapServer/tile/{z}/{y}/{x}',
                attr='Esri Ocean Basemap',
                name='Ocean Base',
                overlay=False,
                control=True
            ).add_to(m)
        
        # Add satellite imagery
        folium.TileLayer(
            tiles='https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
            attr='Esri Satellite',
            name='Satellite',
            overlay=False,
            control=True
        ).add_to(m)
        
        # Add OpenStreetMap
        folium.TileLayer(
            tiles='OpenStreetMap',
            name='Street Map',
            overlay=False,
            control=True
        ).add_to(m)
        
        # Add bathymetry layer
        folium.TileLayer(
            tiles='https://tiles.arcgis.com/tiles/C8EMgrsFcRFL6LrL/arcgis/rest/services/GEBCO_basemap_NCEI/MapServer/tile/{z}/{y}/{x}',
            attr='GEBCO Bathymetry',
            name='Bathymetry',
            overlay=True,
            control=True,
            opacity=0.6
        ).add_to(m)
        
        return m
    
    def add_argo_floats(self, 
                       map_obj: folium.Map, 
                       float_data: List[FloatMarker]) -> folium.Map:
        """Add ARGO float markers with detailed popups"""
        
        # Create marker cluster for better performance
        marker_cluster = plugins.MarkerCluster(
            name="ARGO Floats",
            overlay=True,
            control=True,
            options={
                'disableClusteringAtZoom': 10,
                'maxClusterRadius': 50
            }
        )
        
        for float_info in float_data:
            # Determine marker properties based on status and data
            if float_info.status == 'active':
                color = 'green'
                icon = 'play'
            elif float_info.status == 'inactive':
                color = 'red'
                icon = 'stop'
            else:  # maintenance
                color = 'orange'
                icon = 'wrench'
            
            # Create detailed popup content
            popup_content = self._create_float_popup(float_info)
            
            # Add marker to cluster
            folium.Marker(
                location=[float_info.latitude, float_info.longitude],
                popup=folium.Popup(popup_content, max_width=300),
                tooltip=f"Float {float_info.id} - {float_info.status.title()}",
                icon=folium.Icon(
                    color=color,
                    icon=icon,
                    prefix='fa'
                )
            ).add_to(marker_cluster)
        
        marker_cluster.add_to(map_obj)
        return map_obj
    
    def add_temperature_heatmap(self, 
                              map_obj: folium.Map, 
                              temp_data: List[HeatmapPoint],
                              name: str = "Temperature") -> folium.Map:
        """Add temperature heatmap layer"""
        
        if not temp_data:
            return map_obj
        
        # Prepare data for heatmap
        heat_data = []
        for point in temp_data:
            heat_data.append([
                point.latitude, 
                point.longitude, 
                point.value
            ])
        
        # Create heatmap layer
        heatmap = plugins.HeatMap(
            heat_data,
            name=name,
            min_opacity=0.3,
            max_zoom=18,
            radius=20,
            blur=15,
            gradient=self._get_gradient_colors('temperature')
        )
        
        heatmap.add_to(map_obj)
        return map_obj
    
    def add_salinity_heatmap(self, 
                           map_obj: folium.Map, 
                           salinity_data: List[HeatmapPoint]) -> folium.Map:
        """Add salinity heatmap layer"""
        
        if not salinity_data:
            return map_obj
        
        heat_data = []
        for point in salinity_data:
            heat_data.append([
                point.latitude, 
                point.longitude, 
                point.value
            ])
        
        heatmap = plugins.HeatMap(
            heat_data,
            name="Salinity",
            min_opacity=0.3,
            max_zoom=18,
            radius=20,
            blur=15,
            gradient=self._get_gradient_colors('salinity')
        )
        
        heatmap.add_to(map_obj)
        return map_obj
    
    def add_float_trajectories(self, 
                             map_obj: folium.Map, 
                             trajectories: List[FloatTrajectory]) -> folium.Map:
        """Add float trajectory paths with temporal information"""
        
        trajectory_group = folium.FeatureGroup(name="Float Trajectories")
        
        for trajectory in trajectories:
            if len(trajectory.points) < 2:
                continue
            
            # Create trajectory line
            trajectory_coords = [
                [point.latitude, point.longitude] 
                for point in trajectory.points
            ]
            
            # Add trajectory polyline
            folium.PolyLine(
                locations=trajectory_coords,
                color='blue',
                weight=3,
                opacity=0.7,
                popup=f'Float {trajectory.float_id} Trajectory'
            ).add_to(trajectory_group)
            
            # Add start marker (green)
            start_point = trajectory.points[0]
            folium.Marker(
                location=[start_point.latitude, start_point.longitude],
                popup=f'Float {trajectory.float_id} - Start<br>{start_point.timestamp.strftime("%Y-%m-%d %H:%M")}',
                icon=folium.Icon(color='green', icon='play', prefix='fa'),
                tooltip=f'Start: {trajectory.float_id}'
            ).add_to(trajectory_group)
            
            # Add end marker (red)
            end_point = trajectory.points[-1]
            folium.Marker(
                location=[end_point.latitude, end_point.longitude],
                popup=f'Float {trajectory.float_id} - Latest<br>{end_point.timestamp.strftime("%Y-%m-%d %H:%M")}',
                icon=folium.Icon(color='red', icon='stop', prefix='fa'),
                tooltip=f'Latest: {trajectory.float_id}'
            ).add_to(trajectory_group)
        
        trajectory_group.add_to(map_obj)
        return map_obj
    
    def add_contour_lines(self, 
                         map_obj: folium.Map, 
                         grid_data: List[Dict],
                         parameter: str = 'temperature') -> folium.Map:
        """Add contour lines for oceanographic parameters"""
        
        if not grid_data:
            return map_obj
        
        # Convert to DataFrame for easier processing
        df = pd.DataFrame(grid_data)
        
        # Create contour data (simplified approach)
        # In production, you'd use proper contouring algorithms
        contour_group = folium.FeatureGroup(name=f"{parameter.title()} Contours")
        
        # Add sample contour lines (this would be replaced with actual contouring)
        # For demonstration, we'll add some sample isolines
        if parameter == 'temperature':
            self._add_sample_isotherms(contour_group)
        elif parameter == 'salinity':
            self._add_sample_isohalines(contour_group)
        
        contour_group.add_to(map_obj)
        return map_obj
    
    def add_measurement_stations(self, 
                               map_obj: folium.Map, 
                               stations: List[Dict]) -> folium.Map:
        """Add measurement station markers"""
        
        station_group = folium.FeatureGroup(name="Measurement Stations")
        
        for station in stations:
            popup_content = f"""
            <div style="width: 250px;">
                <h4>{station.get('name', 'Station')}</h4>
                <p><strong>ID:</strong> {station.get('id', 'N/A')}</p>
                <p><strong>Type:</strong> {station.get('type', 'Unknown')}</p>
                <p><strong>Depth:</strong> {station.get('depth', 'N/A')}m</p>
                <p><strong>Last Measurement:</strong> {station.get('last_measurement', 'N/A')}</p>
            </div>
            """
            
            folium.Marker(
                location=[station['latitude'], station['longitude']],
                popup=folium.Popup(popup_content, max_width=300),
                tooltip=station.get('name', 'Station'),
                icon=folium.Icon(
                    color='blue',
                    icon='tachometer-alt',
                    prefix='fa'
                )
            ).add_to(station_group)
        
        station_group.add_to(map_obj)
        return map_obj
    
    def add_legend(self, 
                  map_obj: folium.Map, 
                  parameter: str, 
                  min_val: float, 
                  max_val: float,
                  unit: str) -> folium.Map:
        """Add color legend for heatmap data"""
        
        colors = self.color_schemes.get(parameter, self.color_schemes['temperature'])
        
        # Create colormap
        colormap = cm.LinearColormap(
            colors=colors,
            vmin=min_val,
            vmax=max_val,
            caption=f'{parameter.title()} ({unit})'
        )
        
        colormap.add_to(map_obj)
        return map_obj
    
    def generate_complete_map(self, 
                            float_data: List[FloatMarker],
                            temp_data: Optional[List[HeatmapPoint]] = None,
                            salinity_data: Optional[List[HeatmapPoint]] = None,
                            trajectories: Optional[List[FloatTrajectory]] = None,
                            stations: Optional[List[Dict]] = None,
                            center: Optional[List[float]] = None) -> str:
        """Generate complete interactive oceanographic map"""
        
        # Create base map
        m = self.create_base_map(center=center)
        
        # Add ARGO floats
        if float_data:
            m = self.add_argo_floats(m, float_data)
        
        # Add temperature heatmap
        if temp_data:
            m = self.add_temperature_heatmap(m, temp_data)
            # Add temperature legend
            temp_values = [p.value for p in temp_data]
            if temp_values:
                m = self.add_legend(m, 'temperature', min(temp_values), max(temp_values), '°C')
        
        # Add salinity heatmap
        if salinity_data:
            m = self.add_salinity_heatmap(m, salinity_data)
        
        # Add trajectories
        if trajectories:
            m = self.add_float_trajectories(m, trajectories)
        
        # Add measurement stations
        if stations:
            m = self.add_measurement_stations(m, stations)
        
        # Add map controls and plugins
        self._add_map_controls(m)
        
        # Return HTML string
        return m._repr_html_()
    
    def _create_float_popup(self, float_info: FloatMarker) -> str:
        """Create detailed popup content for ARGO float"""
        
        status_color = {
            'active': 'green',
            'inactive': 'red',
            'maintenance': 'orange'
        }.get(float_info.status, 'gray')
        
        popup_content = f"""
        <div style="width: 280px; font-family: Arial, sans-serif;">
            <h4 style="margin: 0 0 10px 0; color: #2c3e50;">
                <i class="fa fa-tint" style="color: {status_color};"></i> 
                Float {float_info.id}
            </h4>
            
            <table style="width: 100%; font-size: 12px;">
                <tr>
                    <td><strong>Status:</strong></td>
                    <td><span style="color: {status_color}; font-weight: bold;">
                        {float_info.status.title()}
                    </span></td>
                </tr>
                <tr>
                    <td><strong>Position:</strong></td>
                    <td>{float_info.latitude:.3f}°, {float_info.longitude:.3f}°</td>
                </tr>
        """
        
        if float_info.temperature is not None:
            popup_content += f"""
                <tr>
                    <td><strong>Temperature:</strong></td>
                    <td>{float_info.temperature:.1f}°C</td>
                </tr>
            """
        
        if float_info.salinity is not None:
            popup_content += f"""
                <tr>
                    <td><strong>Salinity:</strong></td>
                    <td>{float_info.salinity:.1f} PSU</td>
                </tr>
            """
        
        if float_info.depth is not None:
            popup_content += f"""
                <tr>
                    <td><strong>Depth:</strong></td>
                    <td>{float_info.depth:.0f}m</td>
                </tr>
            """
        
        if float_info.last_update:
            popup_content += f"""
                <tr>
                    <td><strong>Last Update:</strong></td>
                    <td>{float_info.last_update.strftime('%Y-%m-%d %H:%M UTC')}</td>
                </tr>
            """
        
        popup_content += """
            </table>
            
            <div style="margin-top: 10px; text-align: center;">
                <button onclick="alert('View detailed profile data')" 
                        style="background: #3498db; color: white; border: none; 
                               padding: 5px 10px; border-radius: 3px; cursor: pointer;">
                    View Profile
                </button>
            </div>
        </div>
        """
        
        return popup_content
    
    def _get_gradient_colors(self, parameter: str) -> Dict:
        """Get gradient color scheme for parameter"""
        colors = self.color_schemes.get(parameter, self.color_schemes['temperature'])
        
        gradient = {}
        for i, color in enumerate(colors):
            gradient[i / (len(colors) - 1)] = color
        
        return gradient
    
    def _add_sample_isotherms(self, group: folium.FeatureGroup):
        """Add sample temperature contour lines"""
        # Sample isotherm lines for Arabian Sea
        isotherms = [
            {
                'coords': [[10, 65], [20, 65], [25, 70], [20, 75], [10, 70]],
                'temp': 28,
                'color': '#FF4500'
            },
            {
                'coords': [[12, 67], [18, 67], [22, 72], [18, 77], [12, 72]],
                'temp': 26,
                'color': '#FF6347'
            }
        ]
        
        for isotherm in isotherms:
            folium.PolyLine(
                locations=isotherm['coords'],
                color=isotherm['color'],
                weight=2,
                opacity=0.8,
                popup=f"Temperature: {isotherm['temp']}°C"
            ).add_to(group)
    
    def _add_sample_isohalines(self, group: folium.FeatureGroup):
        """Add sample salinity contour lines"""
        # Sample isohaline lines
        isohalines = [
            {
                'coords': [[11, 66], [19, 66], [24, 71], [19, 76], [11, 71]],
                'salinity': 35.5,
                'color': '#4169E1'
            },
            {
                'coords': [[13, 68], [17, 68], [21, 73], [17, 78], [13, 73]],
                'salinity': 35.0,
                'color': '#6495ED'
            }
        ]
        
        for isohaline in isohalines:
            folium.PolyLine(
                locations=isohaline['coords'],
                color=isohaline['color'],
                weight=2,
                opacity=0.8,
                popup=f"Salinity: {isohaline['salinity']} PSU"
            ).add_to(group)
    
    def _add_map_controls(self, map_obj: folium.Map):
        """Add various controls and plugins to the map"""
        
        # Layer control
        folium.LayerControl(position='topright').add_to(map_obj)
        
        # Fullscreen button
        plugins.Fullscreen(
            position='topleft',
            title='Fullscreen',
            title_cancel='Exit fullscreen',
            force_separate_button=True
        ).add_to(map_obj)
        
        # Measure tool
        plugins.MeasureControl(
            position='topleft',
            primary_length_unit='kilometers',
            secondary_length_unit='miles',
            primary_area_unit='sqkilometers',
            secondary_area_unit='acres'
        ).add_to(map_obj)
        
        # Mouse position
        plugins.MousePosition().add_to(map_obj)
        
        # Mini map
        minimap = plugins.MiniMap(
            tile_layer='OpenStreetMap',
            position='bottomleft',
            width=150,
            height=150,
            collapsed_width=25,
            collapsed_height=25
        )
        minimap.add_to(map_obj)
        
        # Draw tools
        draw = plugins.Draw(
            export=True,
            position='topleft',
            draw_options={
                'polyline': True,
                'polygon': True,
                'circle': False,
                'rectangle': True,
                'marker': True,
                'circlemarker': False,
            }
        )
        draw.add_to(map_obj)

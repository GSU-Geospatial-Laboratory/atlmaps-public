{
	"coverage": {
		"name": "atlpm0092_geo",
		"nativeName": "atlpm0092_geo",
		"namespace": {
			"name": "atlmaps",
			"href": "http:\/\/www.atlmaps.com:8080\/geoserver\/rest\/namespaces\/atlmaps.json"
		},
		"title": "atlpm0092_geo",
		"description": "Generated from GeoTIFF",
		"keywords": {
			"string": ["WCS", "GeoTIFF", "atlpm0092_geo"]
		},
		"nativeCRS": {
			"@class": "projected",
			"$": "PROJCS[\"NAD83 \/ Georgia West\", \n  GEOGCS[\"NAD83\", \n    DATUM[\"North American Datum 1983\", \n      SPHEROID[\"GRS 1980\", 6378137.0, 298.257222101, AUTHORITY[\"EPSG\",\"7019\"]], \n      TOWGS84[0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0], \n      AUTHORITY[\"EPSG\",\"6269\"]], \n    PRIMEM[\"Greenwich\", 0.0, AUTHORITY[\"EPSG\",\"8901\"]], \n    UNIT[\"degree\", 0.017453292519943295], \n    AXIS[\"Geodetic longitude\", EAST], \n    AXIS[\"Geodetic latitude\", NORTH], \n    AUTHORITY[\"EPSG\",\"4269\"]], \n  PROJECTION[\"Transverse_Mercator\"], \n  PARAMETER[\"central_meridian\", -84.16666666666667], \n  PARAMETER[\"latitude_of_origin\", 30.0], \n  PARAMETER[\"scale_factor\", 0.9999], \n  PARAMETER[\"false_easting\", 2296583.333333333], \n  PARAMETER[\"false_northing\", 0.0], \n  UNIT[\"foot_survey_us\", 0.30480060960121924], \n  AXIS[\"Easting\", EAST], \n  AXIS[\"Northing\", NORTH]]"
		},
		"srs": "EPSG:3521",
		"nativeBoundingBox": {
			"minx": 2178620.22,
			"maxx": 2262216.661656,
			"miny": 1323869.581742,
			"maxy": 1416462.86,
			"crs": "EPSG:4326"
		},
		"latLonBoundingBox": {
			"minx": -84.5554090552638,
			"maxx": -84.27958735214095,
			"miny": 33.63884669921147,
			"maxy": 33.89387175210521,
			"crs": "EPSG:4326"
		},
		"projectionPolicy": "FORCE_DECLARED",
		"enabled": true,
		"metadata": {
			"entry": [{
					"@key": "cachingEnabled",
					"$": "false"
				}, {
					"@key": "dirName",
					"$": "librarymaps_atlpm0092_geo"
				}
			]
		},
		"store": {
			"@class": "coverageStore",
			"name": "atlpm0092",
			"href": "http:\/\/www.atlmaps.com:8080\/geoserver\/rest\/workspaces\/atlmaps\/coveragestores\/atlpm0092.json"
		},
		"nativeFormat": "GeoTIFF",
		"grid": {
			"@dimension": "2",
			"range": {
				"low": "0 0",
				"high": "12516 13863"
			},
			"transform": {
				"scaleX": 6.679166,
				"scaleY": -6.679166,
				"shearX": 0,
				"shearY": 0,
				"translateX": 2178623.5595830004,
				"translateY": 1416459.5204170002
			},
			"crs": "EPSG:3520"
		},
		"supportedFormats": {
			"string": ["GIF", "PNG", "JPEG", "TIFF", "GEOTIFF"]
		},
		"interpolationMethods": {
			"string": ["bilinear", "bicubic"]
		},
		"dimensions": {
			"coverageDimension": [{
					"name": "RED_BAND",
					"description": "GridSampleDimension[-Infinity,Infinity]"
				}, {
					"name": "GREEN_BAND",
					"description": "GridSampleDimension[-Infinity,Infinity]"
				}, {
					"name": "BLUE_BAND",
					"description": "GridSampleDimension[-Infinity,Infinity]"
				}
			]
		},
		"parameters": {
			"entry": [{
					"string": ["InputTransparentColor", ""]
				}, {
					"string": ["SUGGESTED_TILE_SIZE", "256,256"]
				}
			]
		}
	}
}
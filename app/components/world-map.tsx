"use client"

import { useState } from "react"
import { ComposableMap, Geographies, Geography, Marker, ZoomableGroup } from "react-simple-maps"
import { Tooltip } from "react-tooltip"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Building2, Factory, Wrench, Truck, Briefcase } from "lucide-react"

// Use a more reliable world map topology
const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json"

// Fallback simple world outline if topology fails
const fallbackWorldPath = "M-180,-90 L180,-90 L180,90 L-180,90 Z"

// Location types with their respective colors and icons
const locationTypes = {
  manufacturing: { color: "#0088FE", name: "Manufacturing", icon: Factory },
  rnd: { color: "#00C49F", name: "R&D Center", icon: Wrench },
  distribution: { color: "#FFBB28", name: "Distribution", icon: Truck },
  headquarters: { color: "#FF8042", name: "Headquarters", icon: Briefcase },
  office: { color: "#8884d8", name: "Office", icon: Building2 },
}

// Sandvik locations with coordinates and types
const locations = [
  // Manufacturing sites
  {
    name: "Sandviken, Sweden",
    coordinates: [16.7611, 60.6175],
    type: "manufacturing",
    businessAreas: ["SMMS", "SMRS"],
  },
  { name: "Gimo, Sweden", coordinates: [17.1667, 60.1667], type: "manufacturing", businessAreas: ["SMMS"] },
  { name: "Svedala, Sweden", coordinates: [13.2333, 55.5167], type: "manufacturing", businessAreas: ["SRPS"] },
  { name: "Rovereto, Italy", coordinates: [11.0396, 45.8906], type: "manufacturing", businessAreas: ["SMMS"] },
  { name: "Renningen, Germany", coordinates: [8.9333, 48.7667], type: "manufacturing", businessAreas: ["SMMS"] },
  { name: "Mebane, NC, USA", coordinates: [-79.267, 36.0959], type: "manufacturing", businessAreas: ["SMMS"] },
  { name: "Alachua, FL, USA", coordinates: [-82.4251, 29.7805], type: "manufacturing", businessAreas: ["SMRS"] },
  { name: "Westminster, SC, USA", coordinates: [-83.1018, 34.6618], type: "manufacturing", businessAreas: ["SMMS"] },
  { name: "Burlington, ON, Canada", coordinates: [-79.799, 43.3255], type: "manufacturing", businessAreas: ["SMRS"] },
  {
    name: "Pune, India",
    coordinates: [73.8567, 18.5204],
    type: "manufacturing",
    businessAreas: ["SMMS", "SMRS", "SRPS"],
  },
  { name: "Langfang, China", coordinates: [116.703, 39.5196], type: "manufacturing", businessAreas: ["SMMS"] },
  { name: "Changzhou, China", coordinates: [119.9742, 31.7976], type: "manufacturing", businessAreas: ["SMRS"] },
  { name: "Semine, Japan", coordinates: [139.6503, 35.6762], type: "manufacturing", businessAreas: ["SMMS"] },
  {
    name: "Jandakot, WA, Australia",
    coordinates: [115.8613, -32.0975],
    type: "manufacturing",
    businessAreas: ["SRPS"],
  },
  {
    name: "Kempton Park, South Africa",
    coordinates: [28.23, -26.1186],
    type: "manufacturing",
    businessAreas: ["SRPS", "SMRS"],
  },
  { name: "Taubaté, Brazil", coordinates: [-45.5553, -23.0265], type: "manufacturing", businessAreas: ["SRPS"] },

  // R&D Centers
  { name: "Stockholm, Sweden", coordinates: [18.0686, 59.3293], type: "rnd", businessAreas: ["SMMS", "SMRS"] },
  { name: "Tampere, Finland", coordinates: [23.761, 61.4978], type: "rnd", businessAreas: ["SMRS"] },
  { name: "Turku, Finland", coordinates: [22.2666, 60.4518], type: "rnd", businessAreas: ["SMMS"] },
  { name: "Pittsburgh, PA, USA", coordinates: [-79.9959, 40.4406], type: "rnd", businessAreas: ["SMMS"] },
  { name: "Shanghai, China", coordinates: [121.4737, 31.2304], type: "rnd", businessAreas: ["SMMS", "SMRS"] },

  // Distribution Centers
  { name: "Singapore", coordinates: [103.8198, 1.3521], type: "distribution", businessAreas: ["SMMS", "SMRS", "SRPS"] },
  {
    name: "Rotterdam, Netherlands",
    coordinates: [4.4777, 51.9244],
    type: "distribution",
    businessAreas: ["SMMS", "SMRS"],
  },
  { name: "Houston, TX, USA", coordinates: [-95.3698, 29.7604], type: "distribution", businessAreas: ["SMRS", "SRPS"] },
  { name: "Dubai, UAE", coordinates: [55.2708, 25.2048], type: "distribution", businessAreas: ["SMMS", "SMRS"] },

  // Headquarters
  {
    name: "Stockholm, Sweden (Global HQ)",
    coordinates: [18.0686, 59.3293],
    type: "headquarters",
    businessAreas: ["Corporate"],
  },
  {
    name: "Atlanta, GA, USA (Americas HQ)",
    coordinates: [-84.388, 33.749],
    type: "headquarters",
    businessAreas: ["Americas"],
  },
  { name: "Singapore (APAC HQ)", coordinates: [103.8198, 1.3521], type: "headquarters", businessAreas: ["APAC"] },

  // Offices
  { name: "London, UK", coordinates: [-0.1278, 51.5074], type: "office", businessAreas: ["SMMS", "SMRS"] },
  { name: "Paris, France", coordinates: [2.3522, 48.8566], type: "office", businessAreas: ["SMMS"] },
  { name: "Madrid, Spain", coordinates: [-3.7038, 40.4168], type: "office", businessAreas: ["SMRS"] },
  { name: "Moscow, Russia", coordinates: [37.6173, 55.7558], type: "office", businessAreas: ["SMMS", "SMRS"] },
  {
    name: "São Paulo, Brazil",
    coordinates: [-46.6333, -23.5505],
    type: "office",
    businessAreas: ["SMMS", "SMRS", "SRPS"],
  },
  { name: "Mexico City, Mexico", coordinates: [-99.1332, 19.4326], type: "office", businessAreas: ["SMMS", "SMRS"] },
  {
    name: "Johannesburg, South Africa",
    coordinates: [28.0473, -26.2041],
    type: "office",
    businessAreas: ["SMMS", "SMRS", "SRPS"],
  },
  { name: "Mumbai, India", coordinates: [72.8777, 19.076], type: "office", businessAreas: ["SMMS", "SMRS"] },
  { name: "Seoul, South Korea", coordinates: [126.978, 37.5665], type: "office", businessAreas: ["SMMS"] },
  {
    name: "Sydney, Australia",
    coordinates: [151.2093, -33.8688],
    type: "office",
    businessAreas: ["SMMS", "SMRS", "SRPS"],
  },
]

export default function WorldMap() {
  const [tooltipContent, setTooltipContent] = useState("")
  const [selectedType, setSelectedType] = useState<string | null>(null)

  const filteredLocations = selectedType ? locations.filter((location) => location.type === selectedType) : locations

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Global Footprint</span>
          <div className="flex gap-2">
            {Object.entries(locationTypes).map(([type, { color, name, icon: Icon }]) => (
              <Badge
                key={type}
                variant="outline"
                className={`cursor-pointer flex items-center gap-1 ${
                  selectedType === type ? "bg-gray-100 border-gray-300" : ""
                }`}
                style={{ borderColor: selectedType === type ? color : undefined }}
                onClick={() => setSelectedType(selectedType === type ? null : type)}
              >
                <Icon className="h-3 w-3" style={{ color }} />
                <span>{name}</span>
              </Badge>
            ))}
          </div>
        </CardTitle>
        <CardDescription>
          Sandvik's global presence across manufacturing, R&D, distribution, and offices
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[500px] w-full overflow-hidden border rounded-lg bg-blue-50">
          <ComposableMap
            projectionConfig={{
              scale: 120,
            }}
            width={800}
            height={400}
            style={{
              width: "100%",
              height: "100%",
            }}
          >
            <ZoomableGroup center={[0, 0]} zoom={1} maxZoom={3}>
              <Geographies geography={geoUrl}>
                {({ geographies }) =>
                  geographies.map((geo) => (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      fill="#E8F4FD"
                      stroke="#B0BEC5"
                      strokeWidth={0.5}
                      style={{
                        default: {
                          outline: "none",
                          fill: "#E8F4FD",
                          stroke: "#B0BEC5",
                        },
                        hover: {
                          outline: "none",
                          fill: "#F0F8FF",
                          stroke: "#90A4AE",
                        },
                        pressed: {
                          outline: "none",
                          fill: "#E3F2FD",
                        },
                      }}
                    />
                  ))
                }
              </Geographies>

              {filteredLocations.map((location, index) => {
                const { color, icon: Icon } = locationTypes[location.type as keyof typeof locationTypes]
                return (
                  <Marker
                    key={`${location.name}-${index}`}
                    coordinates={[location.coordinates[0], location.coordinates[1]]}
                    onMouseEnter={() => {
                      setTooltipContent(`
                        <div>
                          <strong>${location.name}</strong><br/>
                          <span>${locationTypes[location.type as keyof typeof locationTypes].name}</span><br/>
                          <span>Business Areas: ${location.businessAreas.join(", ")}</span>
                        </div>
                      `)
                    }}
                    onMouseLeave={() => {
                      setTooltipContent("")
                    }}
                    data-tooltip-id="location-tooltip"
                  >
                    <circle r={4} fill={color} stroke="#fff" strokeWidth={1} />
                  </Marker>
                )
              })}
            </ZoomableGroup>
          </ComposableMap>
          <Tooltip id="location-tooltip" html={tooltipContent} />
        </div>

        <div className="mt-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2 pt-4 border-t">
          {Object.entries(locationTypes).map(([type, { color, name, icon: Icon }]) => (
            <div key={type} className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full" style={{ backgroundColor: color }}></div>
              <Icon className="h-4 w-4" style={{ color }} />
              <span className="text-sm">{name}</span>
              <span className="text-sm text-gray-500">({locations.filter((l) => l.type === type).length})</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

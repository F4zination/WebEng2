import "../css/routing.css";
import L from "leaflet";
import { useMap } from "react-leaflet";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import "leaflet-routing-machine";

/**
 * Sets the routing coordinates for the controller.
 * 
 * @param {LatLng} start - The start coordinates.
 * @param {LatLng} end - The end coordinates.
 */
export function setRoutingCoordinates(start, end) {
  controller.setWaypoints([]);
  controller.spliceWaypoints(0, 1, start);
  controller.spliceWaypoints(1, 1, end);
}

/**
 * Sets a single waypoint for the routing controller.
 * 
 * @param {LatLng} coordinates - The coordinates of the waypoint.
 */
export function setRoutWaypoint(coordinates) {
  controller.setWaypoints([coordinates]);
}

/**
 * The routing controller for the map.
 */
export const controller = L.Routing.control({
  waypoints: [],
  autoRoute: true,
  routeWhileDragging: false,
  draggableWaypoints: false,
  createMarker: function () {
    return null;
  },
});

/**
 * Renders the routing component on the map.
 * 
 * @returns {null} Returns null.
 */
export default function Routing() {
  const map = useMap();
  if (!map) return null;
  controller.addTo(map);
  return null;
}

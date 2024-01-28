/**
 * The Routing component is used to display the map page.
 */
import L from 'leaflet';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';
import 'leaflet-routing-machine';
import '../css/routing.css';
import { useMap } from 'react-leaflet';
import { f7 } from 'framework7-react';
import { $ } from 'dom7';

/**
 * Set the routing origin and destination.
 * @param start - the origin
 * @param end - the destination
 */
export function setRoutingOriginDestination(start, end) {
  routingControl.setWaypoints([]);
  routingControl.spliceWaypoints(0, 1, start); // -> Start LatLng
  routingControl.spliceWaypoints(1, 1, end); // -> Target LatLng
  console.log(routingControl.getWaypoints());
}

/**
 * Set a routing waypoint.
 * @param coordinates - the coordinates of the waypoint
 */
export function setRoutingWaypoint(coordinates) {
  routingControl.setWaypoints([coordinates]);
}

/**
 * The routingControl is used to display the routing.
 */
export const routingControl = L.Routing.control({
  waypoints: [],
  draggableWaypoints: false,
  routeWhileDragging: false,
  autoRoute: true,
  createMarker: function () {
    return null;
  }
});

/**
 * Generate the routing control.
 *
 * @returns {null}
 */
export default function Routing() {
  const map = useMap();
  if (!map) return null;
  routingControl.addTo(map);
  return null;
}

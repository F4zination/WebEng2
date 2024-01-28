/**
 * The infosheet component is used to display the wikipedia information.
 */
import React, { useContext } from "react";
import {
  Sheet,
  BlockTitle,
  f7,
  Button,
  Icon,
  MessagesTitle,
} from "framework7-react";
import Framework7 from "framework7";
import { $ } from "dom7";
import "../css/app.css";
import "../css/info_sheet.css";
import {
  DEFAULT_WIKI,
  DestinationContext,
  OriginContext,
  CenterLocationContext,
} from "../js/Context";
import { setRoutingOriginDestination } from "./Routing";

/**
 * Get the wikitext for a given city
 * @param {string} city - the city to get the wikitext for
 * @returns {Promise<string>} - the wikitext
 */
export async function getWikipediaByCity(city) {
  return fetch(
    `https://en.wikipedia.org/w/api.php?origin=*&format=json&action=query&prop=extracts&exintro&explaintext&redirects=1&exsentences=10&titles=${city}`
  )
    .then((response) => response.json())
    .then((json) => {
      return (
        json.query.pages[Object.keys(json.query.pages)[0]].extract ||
        DEFAULT_WIKI
      );
    });
}

/**
 * Generates the wikipedia box
 * @returns {JSX.Element} - the wikipedia box
 */
export default function infosheet() {
  const { destination } = useContext(DestinationContext);
  const { origin } = useContext(OriginContext);
  const { centerLocation } = useContext(CenterLocationContext);

  /**
   * Start the navigation to the destination
   * @returns {Promise<void>}
   */
  async function startNavigation() {
    f7.sheet.close(".infosheet");
    console.log(origin.coordinates, destination.coordinates);
    setRoutingOriginDestination(origin.coordinates, destination.coordinates);
  }

  // the props used for the sheet element
  let sheetProps = {
    className: "infosheet",
    style: { height: "auto", maxHeight: "100%" },
    backdrop: true,
    swipeToClose: true,
    swipeToStep: true,
    closeByBackdropClick: true,
    closeOnEscape: true,
    side: "right", // Add this line to make the sheet collapse from the right
  };
  if (Framework7.device.desktop) {
    sheetProps.swipeToStep = false;
  }

  return (
    <Sheet {...sheetProps}>
      <div className="sheet-inner">
        <div className="sheet-modal-swipe-step" id="infosheet-location">
          <div
            className="display-flex padding justify-content-space-between align-items-center"
            id="infosheet-header"
          >
            <h1>{centerLocation.address.city}</h1>
            <Button
              id="navigateButton"
              tooltip={"Navigate to " + destination.address.city}
              onClick={startNavigation}
            >
              <Icon
                id="navIcon"
                ios="f7:arrow_right"
                aurora="f7:arrow_right"
                md="material:arrow_forward"
                size={$("#navigateButton").height()}
              />
            </Button>
          </div>
        </div>
        <div
          className="page-content"
          id="infosheet-page-content"
          style={{
            maxHeight: window.innerHeight - $("#infosheet-location").height(),
          }}
        >
          <div className="padding-horizontal padding-bottom"></div>
          <BlockTitle medium className="margin-top no-margin-left">
            Wikipedia
          </BlockTitle>
          <p>{centerLocation.wikipedia}</p>
        </div>
      </div>
    </Sheet>
  );
}

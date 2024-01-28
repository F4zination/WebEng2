import React, { useContext } from "react";
import { Sheet, BlockTitle, f7, Button, Icon } from "framework7-react";
import Framework7 from "framework7";
import { $ } from "dom7";
import "../css/app.css";
import "../css/info_sheet.css";
import {
  DEFAULT_WIKI,
  SecondLocationCT,
  FirstLocationCT,
  CurrentLocationCT,
} from "../js/context";
import { setRoutingCoordinates } from "./routing";

/**
 * Call to wikipedia API with a given place name and return the corresponding text
 * @param {string} place - the the place name to search for
 * @returns {Promise<string>} - the text for the place
 */
export async function getWikipediaByCity(placeName) {
  const formattedPlaceName = encodeURIComponent(placeName);
  const endpoint = `https://de.wikipedia.org/w/api.php?`;
  const params = {
    action: "query",
    prop: "extracts|info",
    exintro: "true",
    explaintext: "true",
    inprop: "url",
    titles: formattedPlaceName,
    format: "json",
    origin: "*",
  };

  const url = endpoint + new URLSearchParams(params).toString();

  return fetch(url)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      return (
        data.query.pages[Object.keys(data.query.pages)[0]].extract ||
        DEFAULT_WIKI
      );
    })
    .catch((error) => {
      console.error("Fetching Wikipedia data failed:", error);
    });
}

/**
 * Create a information sheet for a given city
 * @returns {JSX.Element} the information sheet element
 */
export default function InfoSheet() {
  const { destination } = useContext(SecondLocationCT);
  const { origin } = useContext(FirstLocationCT);
  const { currentLocation } = useContext(CurrentLocationCT);

  /**
   * Navigate to the location that was searched of clicked last
   * @returns {Promise<void>}
   */
  async function startNavigation() {
    f7.sheet.close(".infosheet");
    console.log(origin.coordinates, destination.coordinates);
    setRoutingCoordinates(origin.coordinates, destination.coordinates);
  }

  // Properties for the sheet element
  let properties = {
    className: "infosheet",
    style: { height: "auto", maxHeight: "100%" },
    backdrop: true,
    closeByBackdropClick: true,
    swipeToStep: true,
    swipeToClose: true,
    closeOnEscape: true,
  };

  if (Framework7.device.desktop) {
    properties.swipeToStep = false;
  }

  return (
    <Sheet {...properties}>
      <div className="sheet-inner">
        <div className="sheet-modal-swipe-step" id="infosheet-location">
          <div
            className="display-flex padding justify-content-space-between align-items-center"
            id="infosheet-header"
          >
            <h1>{currentLocation.address.city}</h1>
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
          <p>{currentLocation.wikipedia}</p>
        </div>
      </div>
    </Sheet>
  );
}

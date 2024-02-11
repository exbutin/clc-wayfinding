import React from "react";
import { Button } from "@mui/material";
import Papa from "papaparse";

const AdminTableWarnings = ({ pins, levels, menus }) => {
  const isValidUrl = async (url) => {
    if (!url || !url.endsWith(".png")) {
      return false;
    }

    try {
      const response = await fetch(url);
      if (!response.ok) {
        return false;
      }

      // Check if the response body is a PNG file
      const blob = await response.blob();
      return blob.type === "image/png";
    } catch (error) {
      return false;
    }
  };

  const exportWarningsToCSV = async () => {
    const warnings = [];

    // Check for invalid active_image URLs in pins
    for (const pin of pins) {
      if (!(await isValidUrl(pin.active_image))) {
        warnings.push({
          check: "active_image has valid url",
          itemID: pin._id,
          itemDetail: pin.active_image,
          description: "PNG not found at specified url",
        });
      }
    }

    // Check for invalid inactive_image URLs in pins
    for (const pin of pins) {
      if (!(await isValidUrl(pin.inactive_image))) {
        warnings.push({
          check: "inactive_image has valid url",
          itemID: pin._id,
          itemDetail: pin.active_image,
          description: "PNG not found at specified url",
        });
      }
    }

    // Check for locations in pins that don't exist in menus, but only for pins with a category of "fab"
    const menuLocations = new Set(menus.map((menu) => menu.location));
    for (const pin of pins) {
      if (pin.category === "fab" && !menuLocations.has(pin.name)) {
        warnings.push({
          check: "pin location exists in menus",
          itemID: pin._id,
          itemDetail: pin.name,
          description: "location not found in menus",
        });
      }
    }

    // Check for locations in menus that don't exist in pins
    const pinLocations = new Set(pins.map((pin) => pin.name));
    for (const menu of menus) {
      if (!pinLocations.has(menu.location)) {
        warnings.push({
          check: "menu location exists in pins",
          itemID: menu._id,
          itemDetail: menu.location,
          description: "location not found in pins",
        });
      }
    }

    // Add checks for levels and menus here
    // ...

    const csv = Papa.unparse(warnings);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");

    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "warnings.csv");
    link.style.visibility = "hidden";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Button
      style={{ padding: "3px 16px" }}
      onClick={exportWarningsToCSV}
      variant="contained"
      color="primary"
      aria-label="contained primary button group"
    >
      Export Warnings
    </Button>
  );
};

export default AdminTableWarnings;

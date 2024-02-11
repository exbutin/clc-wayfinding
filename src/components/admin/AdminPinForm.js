import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { TextField, Button, Grid } from "@material-ui/core";
import {
  updateDatabase,
  addDatabaseRecord,
  fetchDatabase,
} from "../../redux/Actions";
import { makeStyles } from "@material-ui/core/styles";
import { Autocomplete } from "@material-ui/lab";
import { colors, defaultLocation } from "../Constants";

const useStyles = makeStyles((theme) => ({
  button: {
    backgroundColor: colors.primary,
    color: "white",
    boxShadow: "1px 1px 1px 1px rgba(0, 0, 0, 0.1)",
    margin: theme.spacing(1),
    "&:hover": {
      backgroundColor: colors.secondary,
    },
    "&:focus": {
      outline: "none",
    },
    "&:active": {
      boxShadow: "none",
    },
  },
}));

function AdminPinForm({ pin = {}, handleClose }) {
  const dispatch = useDispatch();
  const pins = useSelector((state) => state.database.pins);
  const activeFilter = useSelector((state) => state.mapButtons.activeFilter);
  const activeLevel = useSelector((state) => state.mapButtons.activeLevel);
  const [name, setName] = useState(pin.name || "");
  const [section, setSection] = useState(pin.section || "");
  const [category, setCategory] = useState(
    pin.category || activeFilter.category[0]
  );
  const [level, setLevel] = useState(pin.level || activeLevel.name);
  const [coordinates, setCoordinates] = useState(
    pin.coordinates || defaultLocation
  );
  const [activeImage, setActiveImage] = useState(pin.active_image || "");
  const [inactiveImage, setInactiveImage] = useState(pin.inactive_image || "");
  const classes = useStyles();

  const uniqueCategories = [...new Set(pins.map((pin) => pin.category))];
  const uniqueLevels = [...new Set(pins.map((pin) => pin.level))];
  const uniqueNames = [...new Set(pins.map((pin) => pin.name))];
  const uniqueSections = [...new Set(pins.map((pin) => pin.section))];
  const uniqueActiveImages = [...new Set(pins.map((pin) => pin.active_image))];
  const uniqueInactiveImages = [
    ...new Set(pins.map((pin) => pin.inactive_image)),
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (pin._id) {
      const updatedRow = {
        name,
        section,
        category,
        level,
        coordinates: coordinates,
        active_image: activeImage,
        inactive_image: inactiveImage,
      };
      // If pin._id is present, update the existing pin
      dispatch(updateDatabase("pins", pin._id, updatedRow));
    } else {
      const updatedRow = {
        name,
        section,
        category,
        level,
        coordinates: [coordinates.lng, coordinates.lat],
        active_image: activeImage,
        inactive_image: inactiveImage,
      };
      // If pin._id is not present, create a new pin
      dispatch(addDatabaseRecord("pins", updatedRow));
    }
    await dispatch(fetchDatabase());
    handleClose();
  };

  return (
    <form onSubmit={handleSubmit}>
      <Button className={classes.button} type="submit">
        {pin._id ? "Update Pin" : "Create Pin"}
      </Button>
      <Button className={classes.button} onClick={handleClose}>
        Close
      </Button>
      <Grid container direction="column">
        <Autocomplete
          value={name}
          onChange={(event, newValue) => {
            setName(newValue);
          }}
          getOptionLabel={(option) => (option ? option : "")}
          freeSolo
          options={uniqueNames}
          renderInput={(params) => <TextField {...params} label="Name" />}
        />

        <Autocomplete
          value={section}
          onChange={(event, newValue) => {
            setSection(newValue);
          }}
          getOptionLabel={(option) => (option ? option : "")}
          freeSolo
          options={uniqueSections}
          renderInput={(params) => <TextField {...params} label="Section" />}
        />

        <Autocomplete
          value={category}
          onChange={(event, newValue) => {
            setCategory(newValue);
          }}
          getOptionLabel={(option) => (option ? option : "")}
          freeSolo
          options={uniqueCategories}
          renderInput={(params) => <TextField {...params} label="Category" />}
        />

        <Autocomplete
          value={level}
          onChange={(event, newValue) => {
            setLevel(newValue);
          }}
          getOptionLabel={(option) => (option ? option : "")}
          freeSolo
          options={uniqueLevels}
          renderInput={(params) => <TextField {...params} label="Level" />}
        />

        <Autocomplete
          value={activeImage}
          onChange={(event, newValue) => {
            setActiveImage(newValue);
          }}
          getOptionLabel={(option) => (option ? option : "")}
          freeSolo
          options={uniqueActiveImages}
          renderInput={(params) => (
            <TextField {...params} label="Active Image" />
          )}
        />

        <Autocomplete
          value={inactiveImage}
          onChange={(event, newValue) => {
            setInactiveImage(newValue);
          }}
          getOptionLabel={(option) => (option ? option : "")}
          freeSolo
          options={uniqueInactiveImages}
          renderInput={(params) => (
            <TextField {...params} label="Inactive Image" />
          )}
        />

        <TextField
          label="Coordinates"
          value={coordinates}
          onChange={(e) =>
            setCoordinates(e.target.value.split(",").map(Number))
          }
          disabled
          InputProps={{
            style: {
              color: "grey",
            },
          }}
        />
      </Grid>
    </form>
  );
}

export default AdminPinForm;

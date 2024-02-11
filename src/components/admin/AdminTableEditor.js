import React, { useState, useEffect, useMemo } from "react";
import AdminTableToolbar from "./AdminTableToolbar";
import { ButtonGroup, Select, MenuItem } from "@material-ui/core";
import { Button } from "@mui/material";
import { DataGrid, useGridApiRef } from "@mui/x-data-grid";
import { useSelector, useDispatch } from "react-redux";
import { updateDatabase } from "../../redux/Actions"; // replace with your actual action
import { makeStyles } from "@material-ui/core/styles";
import AdminTableWarnings from "./AdminTableWarnings";

const useStyles = makeStyles((theme) => ({
  header: {
    "& .MuiDataGrid-columnHeaderTitle": {
      fontWeight: "bold",
    },
  },
  content: {
    padding: theme.spacing(3),
    height: "100vh",
    width: "100vw",
  },
}));

const EditableTable = () => {
  const classes = useStyles();
  const [selectedDataset, setSelectedDataset] = useState("pins");
  const pins = useSelector((state) => state.database.pins);
  const levels = useSelector((state) => state.database.levels);
  const menus = useSelector((state) => state.database.menus);
  const dispatch = useDispatch();
  const apiRef = useGridApiRef();

  const datasets = useMemo(
    () => ({ pins, levels, menus }),
    [pins, levels, menus]
  );
  const [rows, setRows] = useState([]);

  useEffect(() => {
    setRows(datasets[selectedDataset] || []);
  }, [selectedDataset, datasets]);

  return (
    <main className={classes.content}>
      <div
        style={{
          display: "flex",
          alignItems: "left",
          gap: "20px",
        }}
      >
        <ButtonGroup
          variant="contained"
          color="primary"
          aria-label="contained primary button group"
        >
          <Button style={{ padding: "3px 16px" }}>COLLECTION:</Button>
          <Button style={{ padding: "3px 16px" }}>
            <Select
              value={selectedDataset}
              onChange={(event) => setSelectedDataset(event.target.value)}
              disableUnderline
              style={{ color: "white" }}
            >
              {["pins", "levels", "menus"].map((text) => (
                <MenuItem key={text} value={text}>
                  {text}
                </MenuItem>
              ))}
            </Select>
          </Button>
        </ButtonGroup>
        <Button
          style={{ padding: "3px 16px" }}
          onClick={() =>
            (window.location.href = "http://localhost:3000/admin/map-editor")
          }
          variant="contained"
          color="primary"
          aria-label="contained primary button group"
        >
          Map Editor
        </Button>
        <Button
          style={{ padding: "3px 16px" }}
          onClick={() => (window.location.href = "http://localhost:3000")}
          variant="contained"
          color="primary"
          aria-label="contained primary button group"
        >
          Public Landing Page
        </Button>
        <AdminTableWarnings pins={pins} levels={levels} menus={menus} />
      </div>
      <div className="mb-3"></div>
      <div style={{ height: "calc(100% - 50px)", width: "100%" }}>
        <DataGrid
          apiRef={apiRef}
          components={{
            Toolbar: (props) => (
              <AdminTableToolbar
                apiRef={apiRef}
                selectedDataset={selectedDataset}
                rows={rows}
                setRows={setRows}
              />
            ),
          }}
          className={classes.dataGrid}
          rows={rows}
          getRowId={(row) => row?._id ?? ""}
          columns={
            rows && rows.length > 0
              ? Object.keys(rows[0]).map((key) => {
                  const maxLength = Math.max(
                    ...rows.map((row) => String(row[key]).length)
                  );
                  const minWidth = 75; 
                  const width = Math.max(minWidth, maxLength * 8);
                  return {
                    field: key,
                    editable: true,
                    headerClassName: classes.header,
                    width: width,
                  };
                })
              : []
          }
          processRowUpdate={(updatedRow, originalRow) => {
            if (updatedRow !== originalRow) {
              // Save the updated field on the server
              return dispatch(
                updateDatabase(selectedDataset, updatedRow._id, updatedRow)
              )
                .then((response) => {
                  console.log("Update response:", response);
                  return updatedRow;
                })
                .catch((error) => {
                  console.error("Update error:", error);
                });
            }
          }}
          onProcessRowUpdateError={(error) => {
            console.error("Error during row update:", error);
          }}
          style={{ height: "100%", width: "100%" }}
          checkboxSelection
        />
      </div>
    </main>
  );
};

export default EditableTable;

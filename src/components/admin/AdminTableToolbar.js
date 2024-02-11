import React, { useState, useCallback } from "react";
import DeleteDialog from './AdminTableDeleteDialog';
import EditDialog from './AdminTableEditDialog';
import {
  IconButton,
  Typography,
} from "@mui/material";
import {
  GridToolbarContainer,
  GridToolbarColumnsButton,
  GridToolbarDensitySelector,
  GridToolbarFilterButton,
} from "@mui/x-data-grid";
import {
  FileUploadOutlined,
  FileDownloadOutlined,
  DeleteOutline,
  EditOutlined,
} from "@mui/icons-material";
import { useDispatch } from "react-redux";
import { updateDatabase, updateDatabaseBulk, deleteDatabase } from "../../redux/Actions"; // replace with your actual action
import Papa from "papaparse";

function AdminTableToolbar({ apiRef, selectedDataset, rows, setRows }) {
  const dispatch = useDispatch();
  const [open, setOpen] = React.useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [editOpen, setEditOpen] = useState(false);
  const [editField, setEditField] = useState("");
  const [editValue, setEditValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleExport = useCallback(() => {
    const csv = Papa.unparse(rows);
    const csvData = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const csvURL = window.URL.createObjectURL(csvData);
    let tempLink = document.createElement("a");

    // Get current date and time
    const date = new Date();
    const dateTimeFormat = new Intl.DateTimeFormat("en", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
    const [
      { value: month },
      ,
      { value: day },
      ,
      { value: year },
      ,
      { value: hour },
      ,
      { value: minute },
      ,
      { value: second },
    ] = dateTimeFormat.formatToParts(date);

    // Format the filename
    const filename = `${selectedDataset}_${year}-${month}-${day}_${hour}-${minute}-${second}.csv`;

    tempLink.href = csvURL;
    tempLink.setAttribute("download", filename);
    tempLink.click();
  }, [rows, selectedDataset]);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setIsLoading(true); // Show the loading message/spinner
      const reader = new FileReader();
      reader.onload = async (evt) => {
        // Parse the CSV data
        const data = Papa.parse(evt.target.result, { header: true }).data;
        setRows(data);

        // Update the data
        try {
          await dispatch(updateDatabaseBulk(selectedDataset, data));
          alert("All rows imported successfully!");
        } catch (error) {
          alert(`Import operation failed: ${error.message}`);
        } finally {
          setIsLoading(false); // Hide the loading message/spinner
        }
      };
      reader.readAsText(file);
    }
  };

  const handleDeleteSelected = () => {
    const selectedRows = apiRef.current.getSelectedRows();
    setSelectedRows(Array.from(selectedRows.values()));
    setOpen(true);
  };

  const handleConfirmDelete = () => {
    // Create an array of IDs
    const idsToDelete = selectedRows.map((item) => String(item._id));

    // Map over idsToDelete and create an array of promises
    const deletePromises = idsToDelete.map((id) =>
      dispatch(deleteDatabase(selectedDataset, id))
    );

    // Use Promise.all to wait for all delete operations to complete
    Promise.all(deletePromises)
      .then(() => {
        alert("All selected rows deleted successfully!");
      })
      .catch((error) => {
        alert(`Operation failed: ${error.message}`);
      });

    setRows(rows.filter((row) => !idsToDelete.includes(row._id)));
    setOpen(false);
  };

  const handleEditSelected = () => {
    const selectedRows = apiRef.current.getSelectedRows();
    setSelectedRows(Array.from(selectedRows.values()));
    setEditOpen(true);
  };

  const handleConfirmEdit = () => {
    // Map over selectedRows and create an array of promises
    const editPromises = selectedRows.map((row) => {
      const updatedRow = { ...row, [editField]: editValue };
      return dispatch(updateDatabase(selectedDataset, row._id, updatedRow));
    });

    // Use Promise.all to wait for all edit operations to complete
    Promise.all(editPromises)
      .then(() => {
        alert("All selected rows edited successfully!");
      })
      .catch((error) => {
        alert(`Operation failed: ${error.message}`);
      });

    setEditOpen(false);
  };

  return (
    <div>
      {isLoading ? <p>Processing...</p> : null}
      <GridToolbarContainer>
        <GridToolbarColumnsButton />
        <GridToolbarFilterButton />
        <GridToolbarDensitySelector />
        <IconButton
          color="primary"
          aria-label="export csv"
          component="label"
          onClick={handleExport}
        >
          <FileDownloadOutlined fontSize="small" />
          <Typography variant="body2">EXPORT</Typography>
        </IconButton>
        <IconButton color="primary" aria-label="upload csv" component="label">
          <FileUploadOutlined fontSize="small" />
          <Typography variant="body2">IMPORT</Typography>
          <input type="file" accept=".csv" onChange={handleFileUpload} hidden />
        </IconButton>
        <IconButton
          color="primary"
          aria-label="edit selected"
          component="label"
          onClick={handleEditSelected}
        >
          <EditOutlined fontSize="small" />
          <Typography variant="body2">EDIT SELECTED</Typography>
        </IconButton>
        <IconButton
          color="primary"
          aria-label="delete selected"
          component="label"
          onClick={handleDeleteSelected}
        >
          <DeleteOutline fontSize="small" />
          <Typography variant="body2">DELETE SELCTED</Typography>
        </IconButton>
        <DeleteDialog
          open={open}
          onClose={() => setOpen(false)}
          selectedRows={selectedRows}
          handleConfirmDelete={handleConfirmDelete}
        />
        <EditDialog
          open={editOpen}
          onClose={() => setEditOpen(false)}
          selectedRows={selectedRows}
          editField={editField}
          setEditField={setEditField}
          editValue={editValue}
          setEditValue={setEditValue}
          handleConfirmEdit={handleConfirmEdit}
        />
      </GridToolbarContainer>
    </div>
  );
}

export default AdminTableToolbar;

// EditDialog.js
import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogContentText, FormControl, InputLabel, Select, MenuItem, TextField, DialogActions, Button } from '@material-ui/core';

const EditDialog = ({ open, onClose, selectedRows, editField, setEditField, editValue, setEditValue, handleConfirmEdit }) => {
    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Edit Selected Rows</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Select the field and enter the value to update for the selected rows.
                </DialogContentText>
                <FormControl fullWidth>
                    <InputLabel id="edit-field-label">Select a field</InputLabel>
                    <Select
                        labelId="edit-field-label"
                        value={editField}
                        onChange={(event) => setEditField(event.target.value)}
                    >
                        {Object.keys(selectedRows[0] || {}).map((field) => (
                            <MenuItem key={field} value={field}>
                                {field}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <TextField
                    margin="dense"
                    label="Value"
                    type="text"
                    fullWidth
                    value={editValue}
                    onChange={(event) => setEditValue(event.target.value)}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button onClick={handleConfirmEdit} color="primary">
                    Confirm
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default EditDialog;
// DeleteDialog.js
import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogContentText, Table, TableHead, TableRow, TableCell, TableBody, DialogActions, Button } from '@material-ui/core';

const DeleteDialog = ({ open, onClose, selectedRows, handleConfirmDelete }) => {
    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Are you sure you want to delete the following rows?
                </DialogContentText>
                <Table>
                    <TableHead>
                        <TableRow>
                            {Object.keys(selectedRows[0] || {}).map((key, index) => (
                                <TableCell key={index}>{key}</TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {selectedRows.map((row, index) => (
                            <TableRow key={index}>
                                {Object.values(row).map((value, i) => (
                                    <TableCell key={i}>{value}</TableCell>
                                ))}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button onClick={handleConfirmDelete} color="secondary">
                    Delete
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default DeleteDialog;
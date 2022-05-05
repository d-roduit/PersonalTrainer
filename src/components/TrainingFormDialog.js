import { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';

function TrainingFormDialog({ title, open, data, customers, onSaveCallback, onCloseCallback }) {
    const [training, setTraining] = useState({});

    const handleCloseDialog = () => {
        onCloseCallback();
    };

    const validateFields = () => {
        if ((typeof training.date === "undefined" || training.date.trim() === "")
            || (typeof training.activity === "undefined" || training.activity.trim() === "")
            || (typeof training.duration === "undefined" || training.duration.trim() === "" || isNaN(training.duration))
            || (typeof training.customer === "undefined" || training.customer.trim() === "")
        ) {
            return false;
        }
        return true;
    }

    const handleSave = () => {
        if (!validateFields()) {
            return;
        }

        onSaveCallback(training);
        onCloseCallback();
    };

    const inputChanged = (event) => {
        setTraining({...training, [event.target.name]: event.target.value});
    }

    useEffect(() => {
        setTraining(data);
    }, [data]);

    return (
        <div>
            <Dialog open={open} onClose={handleCloseDialog}>
                <DialogTitle>{title}</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        type="datetime-local"
                        margin="dense"
                        name="date"
                        value={training.date}
                        onChange={inputChanged}
                        label="Date"
                        fullWidth
                        variant="standard"
                        required
                    />
                    <TextField
                        type="text"
                        margin="dense"
                        name="activity"
                        value={training.activity}
                        onChange={inputChanged}
                        label="Activity"
                        fullWidth
                        variant="standard"
                        required
                    />
                    <TextField
                        type="number"
                        margin="dense"
                        name="duration"
                        value={training.duration}
                        onChange={inputChanged}
                        label="Duration"
                        fullWidth
                        variant="standard"
                        required
                    />
                    <TextField
                        select
                        margin="dense"
                        name="customer"
                        value={training.customer}
                        onChange={inputChanged}
                        label="Customer"
                        fullWidth
                        variant="standard"
                        required
                    >
                        {customers.map((customer) => (
                            <MenuItem key={`${customer.firstname}${customer.lastname}${customer.email}`} value={customer.links[1].href}>
                            {`${customer.firstname} ${customer.lastname}`}
                            </MenuItem>
                        ))}

                    </TextField>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>Cancel</Button>
                    <Button onClick={handleSave}>Save</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default TrainingFormDialog;

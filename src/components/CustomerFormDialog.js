import { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';

function CustomerFormDialog({ title, open, data, onSaveCallback, onCloseCallback }) {
    const [customer, setCustomer] = useState({});

    const handleCloseDialog = () => {
        onCloseCallback();
    };

    const validateFields = () => {
        if ((typeof customer.firstname === "undefined" || customer.firstname.trim() === "")
            || (typeof customer.lastname === "undefined" || customer.lastname.trim() === "")
            || (typeof customer.email === "undefined" || customer.email.trim() === "")
            || (typeof customer.phone === "undefined" || customer.phone.trim() === "")
            || (typeof customer.streetaddress === "undefined" || customer.streetaddress.trim() === "")
            || (typeof customer.postcode === "undefined" || customer.postcode.trim() === "")
            || (typeof customer.city === "undefined" || customer.city.trim() === "")
        ) {
            return false;
        }
        return true;
    }

    const handleSave = () => {
        if (!validateFields()) {
            return;
        }

        onSaveCallback(customer);
        onCloseCallback();
    };

    const inputChanged = (event) => {
        setCustomer({...customer, [event.target.name]: event.target.value});
    }

    useEffect(() => {
        setCustomer(data);
    }, [data]);

    return (
        <div>
            <Dialog open={open} onClose={handleCloseDialog}>
                <DialogTitle>{title}</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        name="firstname"
                        value={customer.firstname}
                        onChange={inputChanged}
                        label="Firstname"
                        fullWidth
                        variant="standard"
                        required
                    />
                    <TextField
                        margin="dense"
                        name="lastname"
                        value={customer.lastname}
                        onChange={inputChanged}
                        label="Lastname"
                        fullWidth
                        variant="standard"
                        required
                    />
                    <TextField
                        margin="dense"
                        name="email"
                        value={customer.email}
                        onChange={inputChanged}
                        label="Email"
                        fullWidth
                        variant="standard"
                        required
                    />
                    <TextField
                        margin="dense"
                        name="phone"
                        value={customer.phone}
                        onChange={inputChanged}
                        label="Phone"
                        fullWidth
                        variant="standard"
                        required
                    />
                    <TextField
                        margin="dense"
                        name="streetaddress"
                        value={customer.streetaddress}
                        onChange={inputChanged}
                        label="Streetaddress"
                        fullWidth
                        variant="standard"
                        required
                    />
                    <TextField
                        margin="dense"
                        name="postcode"
                        value={customer.postcode}
                        onChange={inputChanged}
                        label="Postcode"
                        fullWidth
                        variant="standard"
                        required
                    />
                    <TextField
                        margin="dense"
                        name="city"
                        value={customer.city}
                        onChange={inputChanged}
                        label="City"
                        fullWidth
                        variant="standard"
                        required
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>Cancel</Button>
                    <Button onClick={handleSave}>Save</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default CustomerFormDialog;

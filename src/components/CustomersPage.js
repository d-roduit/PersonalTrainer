import { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import { DataGrid, GridToolbarContainer, GridToolbarExport, GridActionsCellItem } from '@mui/x-data-grid';
import { Snackbar } from '@mui/material';
import MuiAlert from '@mui/material/Alert';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import CustomerFormDialog from './CustomerFormDialog';

function CustomersPage() {

    const customerActionsMessages = {
        deletion: {
            success: "Customer was deleted successfully",
            failed: "Something went wrong while deleting. Deletion aborted.",
        },
        edition: {
            success: "Customer was edited successfully",
            failed: "Something went wrong while editing. Edition aborted.",
        },
        creation: {
            success: "Customer was added successfully",
            failed: "Something went wrong while creating. Creation aborted.",
        }
    };

    const [customerFormDialogState, setCustomerFormDialogState] = useState({
        title: "",
        open: false,
        data: {},
        onSaveCallback: null,
        onCloseCallback: null,
    });
    const [customers, setCustomers] = useState([]);
    const [snackbarState, setSnackbarState] = useState({
        open: false,
        message: "",
        severity: "success"
    });

    const fetchCustomers = () => {
        const getCustomersAPIEndpoint = `${process.env.REACT_APP_API_BASE_URL}/customers`;
        fetch(getCustomersAPIEndpoint)
            .then(response => response.json())
            .then(data => setCustomers(data.content))
            .catch(err => console.error(err));
    }

    const addCustomer = customerData => {
        const addCustomerAPIEndpoint = `${process.env.REACT_APP_API_BASE_URL}/customers`;
        fetch(addCustomerAPIEndpoint, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                firstname: customerData.firstname,
                lastname: customerData.lastname,
                email: customerData.email,
                phone: customerData.phone,
                streetaddress: customerData.streetaddress,
                postcode: customerData.postcode,
                city: customerData.city,
            })
        })
        .then(response => {
            if (!response.ok) {
                setSnackbarState({
                    open: true,
                    message: customerActionsMessages.creation.failed,
                    severity: "error",
                })
                return;
            }
            setSnackbarState({
                open: true,
                message: customerActionsMessages.creation.success,
                severity: "success",
            })
            fetchCustomers();
        })
        .catch(err => console.error(err));
    }

    const deleteCustomer = customerData => {
        if (window.confirm(`Are you sure to delete ${customerData.firstname || ""} ${customerData.lastname || ""} ?`)) {
            const deleteCustomerAPIEndpoint = customerData?.links?.[0]?.href;

            if (typeof deleteCustomerAPIEndpoint === "undefined") {
                setSnackbarState({
                    open: true,
                    message: customerActionsMessages.deletion.failed,
                    severity: "error",
                })
                return;
            }

            fetch(deleteCustomerAPIEndpoint, { method: "DELETE" })
            .then(response => {
                if (!response.ok) {
                    setSnackbarState({
                        open: true,
                        message: customerActionsMessages.deletion.failed,
                        severity: "error",
                    })
                    return;
                }
                setSnackbarState({
                    open: true,
                    message: customerActionsMessages.deletion.success,
                    severity: "success",
                })
                fetchCustomers();
            })
            .catch(err => console.error(err))
        }
    }

    const updateCustomer = (customerData) => {
        const updateCustomerAPIEndpoint = customerData?.links?.[0]?.href;

        if (typeof updateCustomerAPIEndpoint === "undefined") {
            setSnackbarState({
                open: true,
                message: customerActionsMessages.edition.failed,
                severity: "error",
            })
            return;
        }

        fetch(updateCustomerAPIEndpoint, {
            method: "PUT",
            headers: { "Content-Type": "application/json"},
            body: JSON.stringify({
                firstname: customerData.firstname,
                lastname: customerData.lastname,
                email: customerData.email,
                phone: customerData.phone,
                streetaddress: customerData.streetaddress,
                postcode: customerData.postcode,
                city: customerData.city,
            })
        })
        .then(response => {
            if (!response.ok) {
                setSnackbarState({
                    open: true,
                    message: customerActionsMessages.edition.failed,
                    severity: "error",
                })
                return;
            }
            setSnackbarState({
                open: true,
                message: customerActionsMessages.edition.success,
                severity: "success",
            })
            fetchCustomers();
        })
        .catch(err => console.error(err));
    }

    const columns = [
        { field: 'firstname', headerName: 'Firstname', width: 150 },
        { field: 'lastname', headerName: 'Lastname', width: 150 },
        { field: 'email', headerName: 'Email', width: 200 },
        { field: 'phone', headerName: 'Phone', width: 150 },
        { field: 'streetaddress', headerName: 'Address', width: 200 },
        { field: 'postcode', headerName: 'Postcode', width: 150 },
        { field: 'city', headerName: 'City', width: 150 },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 150,
            type: "actions",
            getActions: params => [
                <GridActionsCellItem
                    icon={<EditIcon color="warning" />}
                    label="Edit"
                    onClick={() => setCustomerFormDialogState({
                        title: "Edit Customer",
                        open: true,
                        data: params.row,
                        onSaveCallback: updateCustomer,
                        onCloseCallback: () => setCustomerFormDialogState({
                            ...customerFormDialogState,
                            open: false,
                        })
                    })}
                />,
                <GridActionsCellItem
                    icon={<DeleteIcon color='error' />}
                    label="Delete"
                    onClick={() => deleteCustomer(params.row)}
                />,
            ],
        },
    ];

    useEffect(() => fetchCustomers(), []);

    return (
        <>
            <Button
                variant="outlined"
                startIcon={<AddIcon />}
                style={{marginBottom: 20}}
                onClick={() => setCustomerFormDialogState({
                    title: "Add Customer",
                    open: true,
                    data: {},
                    onSaveCallback: addCustomer,
                    onCloseCallback: () => setCustomerFormDialogState({
                        ...customerFormDialogState,
                        open: false,
                    })
                })}
            >
                Add Customer
            </Button>

            <DataGrid
                rows={customers}
                getRowId={row => row?.links?.[0]?.href || `${row.firstname}${row.lastname}${row.email}`}
                columns={columns}
                pagination
                pageSize={10}
                rowsPerPageOptions={[10]}
                disableSelectionOnClick
                components={{
                    Toolbar: () => (
                        <GridToolbarContainer>
                            <GridToolbarExport
                                csvOptions={{ fileName: "PersonalTrainer_Customers" }}
                                printOptions={{ disableToolbarButton: true }}
                            />
                        </GridToolbarContainer>
                    )
                }}
                sx={{ height: 600, width: '100%' }}
            />

            <Snackbar
                open={snackbarState.open}
                autoHideDuration={3000}
                onClose={() => setSnackbarState({open: false})}
            >
                <MuiAlert
                    severity={snackbarState.severity}
                    sx={{ color: "white", backgroundColor: theme => `${snackbarState.severity}.${theme.palette.mode}` }}
                >
                    {snackbarState.message}
                </MuiAlert>
            </Snackbar>

            <CustomerFormDialog
                title={customerFormDialogState.title}
                open={customerFormDialogState.open}
                data={customerFormDialogState.data}
                onSaveCallback={customerFormDialogState.onSaveCallback}
                onCloseCallback={customerFormDialogState.onCloseCallback}
            />
        </>
    );
}

export default CustomersPage;

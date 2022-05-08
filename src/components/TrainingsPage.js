import { useState, useEffect } from 'react';
import dayjs from 'dayjs'
import Button from '@mui/material/Button';
import { DataGrid, GridToolbarContainer, GridToolbarExport, GridActionsCellItem } from '@mui/x-data-grid';
import { Snackbar } from '@mui/material';
import MuiAlert from '@mui/material/Alert';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import TrainingFormDialog from './TrainingFormDialog';


function TrainingsPage() {

    const trainingActionsMessages = {
        deletion: {
            success: "Training was deleted successfully",
            failed: "Something went wrong while deleting. Deletion aborted.",
        },
        creation: {
            success: "Training was added successfully",
            failed: "Something went wrong while creating. Creation aborted.",
        }
    };

    const [trainingFormDialogState, setTrainingFormDialogState] = useState({
        title: "",
        open: false,
        data: {},
        onSaveCallback: null,
        onCloseCallback: null,
    });
    const [trainings, setTrainings] = useState([]);
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

    const fetchTrainings = () => {
        const getTrainingsAPIEndpoint = process.env.REACT_APP_API_GETTRAININGS_URL;
        fetch(getTrainingsAPIEndpoint)
            .then(response => response.json())
            .then(data => setTrainings(data))
            .catch(err => console.error(err));
    }

    const addTraining = trainingData => {
        const addTrainingAPIEndpoint = `${process.env.REACT_APP_API_BASE_URL}/trainings`;
        fetch(addTrainingAPIEndpoint, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                date: dayjs(trainingData.date).toISOString(),
                activity: trainingData.activity,
                duration: trainingData.duration,
                customer: trainingData.customer,
            })
        })
        .then(response => {
            if (!response.ok) {
                setSnackbarState({
                    open: true,
                    message: trainingActionsMessages.creation.failed,
                    severity: "error",
                })
                return;
            }
            setSnackbarState({
                open: true,
                message: trainingActionsMessages.creation.success,
                severity: "success",
            })
            fetchTrainings();
        })
        .catch(err => console.error(err));
    }

    const deleteTraining = trainingData => {
        if (window.confirm(`Are you sure to delete ${trainingData.activity || ""} for ${trainingData?.customer?.firstname || ""} ${trainingData?.customer?.lastname || ""} ?`)) {
            if (typeof trainingData.id === "undefined") {
                setSnackbarState({
                    open: true,
                    message: trainingActionsMessages.deletion.failed,
                    severity: "error",
                })
                return;
            }

            const deleteTrainingAPIEndpoint = `${process.env.REACT_APP_API_BASE_URL}/trainings/${trainingData.id}`
            fetch(deleteTrainingAPIEndpoint, { method: "DELETE" })
            .then(response => {
                if (!response.ok) {
                    setSnackbarState({
                        open: true,
                        message: trainingActionsMessages.deletion.failed,
                        severity: "error",
                    })
                    return;
                }
                setSnackbarState({
                    open: true,
                    message: trainingActionsMessages.deletion.success,
                    severity: "success",
                })
                fetchTrainings();
            })
            .catch(err => console.error(err))
        }
    }

    const columns = [
        { field: 'activity', headerName: 'Activity', width: 150 },
        {
            field: 'date',
            headerName: 'Date',
            width: 150,
            valueFormatter: params => dayjs(params.value).format('DD.MM.YYYY HH:mm a')
        },
        { field: 'duration', headerName: 'Duration', width: 150 },
        {
            field: 'customer',
            headerName: 'Customer',
            width: 300,
            valueGetter: params => `${params.row?.customer?.firstname || ""} ${params.row?.customer?.lastname || ""}`
        },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 150,
            type: "actions",
            getActions: params => [
                <GridActionsCellItem
                    icon={<DeleteIcon color='error' />}
                    label="Delete"
                    onClick={() => deleteTraining(params.row)}
                />,
            ],
        },
    ];

    useEffect(() => {
        fetchTrainings();
        fetchCustomers();
    }, []);

    return (
        <>
            <Button
                variant="outlined"
                startIcon={<AddIcon />}
                style={{marginBottom: 20}}
                onClick={() => setTrainingFormDialogState({
                    title: "Add Training",
                    open: true,
                    data: {
                        customer: customers?.[0]?.links?.[1]?.href
                    },
                    onSaveCallback: addTraining,
                    onCloseCallback: () => setTrainingFormDialogState({
                        ...trainingFormDialogState,
                        open: false,
                    })
                })}
            >
                Add Training
            </Button>

            <DataGrid
                rows={trainings}
                columns={columns}
                pagination
                pageSize={10}
                rowsPerPageOptions={[10]}
                disableSelectionOnClick
                initialState={{
                    sorting: {
                        sortModel: [{ field: 'date', sort: 'asc' }],
                    },
                }}
                components={{
                    Toolbar: () => (
                        <GridToolbarContainer>
                            <GridToolbarExport
                                csvOptions={{ fileName: "PersonalTrainer_Trainings" }}
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

            <TrainingFormDialog
                title={trainingFormDialogState.title}
                open={trainingFormDialogState.open}
                data={trainingFormDialogState.data}
                customers={customers}
                onSaveCallback={trainingFormDialogState.onSaveCallback}
                onCloseCallback={trainingFormDialogState.onCloseCallback}
            />
        </>
    );
}

export default TrainingsPage;

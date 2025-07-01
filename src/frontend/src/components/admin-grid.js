import {
    Box,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Typography,
    TablePagination,
    TableSortLabel,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
} from '@mui/material';
import {useEffect, useState} from 'react';
import Loader from "components/loader";
import {fetchData} from "util/api";
import {toast} from "react-toastify";
import {extractFormData} from "util/form";

const AdminGrid = ({
   title = 'Grid',
   query,
   queryName,
   initialPage = 1,
   initialPageSize = 10,
   initialSortField = 'id',
   initialSortDirection = 'asc',
   rowsPerPageOptions = [2, 5, 10, 20, 50],
   inputVariableName = 'input',
   innerQuery= null,
   innerQueryInputVariableName= 'innerInput',
   columns = [],
   rowMutator = null,
   columnRenderers = {},
   AddNewItemForm = null,
   addNewItemQuery,
   addNewItemQueryName,
   prepareItemData,
   deleteQuery,
}) => {
    const [data, setData] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [page, setPage] = useState(initialPage);
    const [rowsPerPage, setRowsPerPage] = useState(initialPageSize);
    const [sortField, setSortField] = useState(initialSortField);
    const [sortDirection, setSortDirection] = useState(initialSortDirection);


    const [isAddNewPopupOpen, setIsAddNewPopupOpen] = useState(false);
    const [formValues, setFormValues] = useState({});

    useEffect(() => {
        const fetchApiData = async () => {
            try {
                setIsLoading(true);
                const variables = {
                    [inputVariableName]: {
                        filterGroups: [],
                        pageSize: rowsPerPage,
                        currentPage: page,
                        sort: [
                            {
                                field: sortField,
                                direction: sortDirection.toUpperCase()
                            }
                        ]
                    }
                }
                const { [queryName]: response } = await fetchData(
                    query(inputVariableName, innerQuery),
                    variables,
                    'AdminGrid'
                );
                setData(response);
            } catch ({ category, message }) {
                if (category === 'aborted') return;
                toast.error(message);
            } finally {
                setIsLoading(false);
            }
        }
        fetchApiData();
    }, [
        page,
        rowsPerPage,
        sortField,
        sortDirection
    ]);

    const handleChangePage = (event, newPage) => {
        setPage(newPage + 1);
    };

    const handleChangeRowsPerPage = (event) => {
        const newSize = parseInt(event.target.value, 10);
        setRowsPerPage(newSize);
        setPage(1);
    };

    const handleSort = (property) => {
        const isAsc = sortField === property && sortDirection === 'asc';
        setSortDirection(isAsc ? 'desc' : 'asc');
        setSortField(property);
    };

    if (!data) {
        return <Loader isLoading={true} />;
    }

    const onAddNewPopupOpen = () => {
        setFormValues({});
        setIsAddNewPopupOpen(true);
    }
    const onAddNewPopupClose = () => setIsAddNewPopupOpen(false);

    const onAddNewFormSubmit = async e => {
        e.preventDefault();
        const itemData = prepareItemData(extractFormData(e.target));
        if (itemData.id) {
            itemData.id = parseInt(itemData.id);
        }
        try {
            setIsLoading(true);
            const variables = {
                [inputVariableName]: itemData,
                [innerQueryInputVariableName]: {
                    filterGroups: [],
                    pageSize: rowsPerPage,
                    currentPage: page,
                    sort: [
                        {
                            field: sortField,
                            direction: sortDirection.toUpperCase()
                        }
                    ]
                }
            }
            const { [addNewItemQueryName]: {[queryName]: response} } = await fetchData(
                addNewItemQuery(
                    inputVariableName,
                    innerQuery,
                    innerQueryInputVariableName
                ), variables, 'AdminGridAddItem');
            setData(response);
            setIsAddNewPopupOpen(false);
        } catch ({ category, message }) {
            if (category === 'aborted') return;
            toast.error(message);
        } finally {
            setIsLoading(false);
        }
    }

    const onEdit = row => {
        setFormValues(row);
        setIsAddNewPopupOpen(true);
    }

    const onDelete = async row => {
        try {
            setIsLoading(true);
            const variables = {
                [innerQueryInputVariableName]: {
                    filterGroups: [],
                    pageSize: rowsPerPage,
                    currentPage: 1,
                    sort: [
                        {
                            field: 'id',
                            direction: 'ASC'
                        }
                    ]
                },
                id: row.id
            }
            const {response: {[innerQuery]: response}} = await fetchData(deleteQuery(), variables);
            console.log(response);
            setData(response);
        } catch ({ category, message }) {
            if (category === 'aborted') return;
            toast.error(message);
        } finally {
            setIsLoading(false);
        }
    }

    columns = [...columns, 'actions'];
    if (!columnRenderers['actions']) {
        columnRenderers['actions'] = (column, row, rawRow) => {
            return (
                <TableCell key="actions">
                    <Button
                        size="small"
                        variant="contained"
                        color="primary"
                        onClick={() => onEdit(rawRow)}
                        style={{ marginRight: 8 }}
                    >
                        Edit
                    </Button>
                    <Button
                        size="small"
                        variant="contained"
                        color="error"
                        onClick={() => onDelete(rawRow)}
                    >
                        Delete
                    </Button>
                </TableCell>
            );
        }
    }

    return (
        <Box>
            <Loader isLoading={isLoading} />

            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h4" gutterBottom>
                    { title }
                </Typography>
                <Button variant="contained" color="primary" onClick={onAddNewPopupOpen}>
                    Add New
                </Button>
            </Box>

            <Dialog open={isAddNewPopupOpen} onClose={onAddNewPopupClose} fullWidth maxWidth="sm">
                <DialogTitle>Add New Item</DialogTitle>
                <Box component="form" onSubmit={onAddNewFormSubmit}>
                    <DialogContent dividers>
                        { formValues['id'] && <input type='hidden' name='id' value={formValues['id']} /> }
                        { AddNewItemForm ? <AddNewItemForm formValues={formValues} /> : <span>Override the AddNewItemForm prop</span> }
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={onAddNewPopupClose}>Cancel</Button>
                        <Button type="submit" variant="contained">Submit</Button>
                    </DialogActions>
                </Box>
            </Dialog>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            {
                                columns.map(column => {
                                    return (
                                        <TableCell
                                            key={column}
                                            sortDirection={sortField === column ? sortDirection : false}
                                        >
                                            <TableSortLabel
                                                active={sortField === column}
                                                direction={sortField === column ? sortDirection : 'asc'}
                                                onClick={() => handleSort(column)}
                                            >
                                                { column.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) }
                                            </TableSortLabel>
                                        </TableCell>
                                    )
                                })
                            }
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {
                            data.items.map((row, index) => {
                                const rawRow = {...row};
                                if (typeof rowMutator === 'function') {
                                    row = rowMutator({...row});
                                }
                                return (
                                    <TableRow key={index}>
                                        {
                                            columns.map(column => {
                                                let renderer = columnRenderers[column];
                                                if (!renderer) {
                                                    renderer = (value) => <>{value}</>;
                                                }
                                                return (
                                                    <TableCell key={column}>
                                                        { renderer(row[column], row, rawRow) }
                                                    </TableCell>
                                                )
                                            })
                                        }
                                    </TableRow>
                                )
                            })
                        }
                    </TableBody>
                </Table>
            </TableContainer>

            <TablePagination
                component="div"
                count={data.totalCount}
                page={page - 1}
                onPageChange={handleChangePage}
                rowsPerPage={rowsPerPage}
                rowsPerPageOptions={rowsPerPageOptions}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
        </Box>
    );
}

export default AdminGrid;
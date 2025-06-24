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
    TableSortLabel
} from '@mui/material';
import {useEffect, useState} from 'react';
import Loader from "components/loader";
import {fetchData} from "util/api";
import {toast} from "react-toastify";

const AdminGrid = ({
   title = 'Grid',
   query,
   queryName,
   initialPage = 1,
   initialPageSize = 10,
   initialSortField = 'id',
   initialSortDirection = 'asc',
   rowsPerPageOptions = [2, 5, 10, 20, 50],
   columns = [],
   rowMutator = null,
   columnRenderers = {}
}) => {
    const [data, setData] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [page, setPage] = useState(initialPage);
    const [rowsPerPage, setRowsPerPage] = useState(initialPageSize);
    const [sortField, setSortField] = useState(initialSortField);
    const [sortDirection, setSortDirection] = useState(initialSortDirection);

    useEffect(() => {
        const execute = async () => {
            try {
                setIsLoading(true);
                const variables = {
                    input: {
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
                const { [queryName]: response } = await fetchData(query, variables);
                setData(response);
            } catch ({ message }) {
                toast.error(message);
            } finally {
                setIsLoading(false);
            }
        }
        execute();
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

    return (
        <Box>
            <Loader isLoading={isLoading} />
            <Typography variant="h4" gutterBottom>
                { title }
            </Typography>

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
                                if (typeof rowMutator === 'function') {
                                    row = rowMutator(row);
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
                                                        { renderer(row[column]) }
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
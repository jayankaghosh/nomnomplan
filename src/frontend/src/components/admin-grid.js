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
    TablePagination
} from '@mui/material';
import { useState } from 'react';

const AdminGrid = ({ title = 'Grid' }) => {
    const data = {
        "currentPage": 1,
        "pageSize": 10,
        "totalPages": 31,
        "items": [
            {
                "name": "Chicken",
                "is_veg": "0",
                "qty_unit": "Kgs",
                "created_at": "2025-06-23 08:39:17"
            },
            {
                "name": "Egg",
                "is_veg": "0",
                "qty_unit": "Pieces",
                "created_at": "2025-06-23 08:39:17"
            },
            {
                "name": "Egg",
                "is_veg": "0",
                "qty_unit": "Pieces",
                "created_at": "2025-06-23 08:39:17"
            },
            {
                "name": "Egg",
                "is_veg": "0",
                "qty_unit": "Pieces",
                "created_at": "2025-06-23 08:39:17"
            },
            {
                "name": "Egg",
                "is_veg": "0",
                "qty_unit": "Pieces",
                "created_at": "2025-06-23 08:39:17"
            },
            {
                "name": "Egg",
                "is_veg": "0",
                "qty_unit": "Pieces",
                "created_at": "2025-06-23 08:39:17"
            },
            {
                "name": "Egg",
                "is_veg": "0",
                "qty_unit": "Pieces",
                "created_at": "2025-06-23 08:39:17"
            },
            {
                "name": "Egg",
                "is_veg": "0",
                "qty_unit": "Pieces",
                "created_at": "2025-06-23 08:39:17"
            },
            {
                "name": "Egg",
                "is_veg": "0",
                "qty_unit": "Pieces",
                "created_at": "2025-06-23 08:39:17"
            },
            {
                "name": "Egg",
                "is_veg": "0",
                "qty_unit": "Pieces",
                "created_at": "2025-06-23 08:39:17"
            },
            {
                "name": "Egg",
                "is_veg": "0",
                "qty_unit": "Pieces",
                "created_at": "2025-06-23 08:39:17"
            },
            {
                "name": "Egg",
                "is_veg": "0",
                "qty_unit": "Pieces",
                "created_at": "2025-06-23 08:39:17"
            },
            {
                "name": "Egg",
                "is_veg": "0",
                "qty_unit": "Pieces",
                "created_at": "2025-06-23 08:39:17"
            },
            {
                "name": "Egg",
                "is_veg": "0",
                "qty_unit": "Pieces",
                "created_at": "2025-06-23 08:39:17"
            },
            {
                "name": "Egg",
                "is_veg": "0",
                "qty_unit": "Pieces",
                "created_at": "2025-06-23 08:39:17"
            },
            {
                "name": "Egg",
                "is_veg": "0",
                "qty_unit": "Pieces",
                "created_at": "2025-06-23 08:39:17"
            },
            {
                "name": "Egg",
                "is_veg": "0",
                "qty_unit": "Pieces",
                "created_at": "2025-06-23 08:39:17"
            },
            {
                "name": "Egg",
                "is_veg": "0",
                "qty_unit": "Pieces",
                "created_at": "2025-06-23 08:39:17"
            },
            {
                "name": "Egg",
                "is_veg": "0",
                "qty_unit": "Pieces",
                "created_at": "2025-06-23 08:39:17"
            },
            {
                "name": "Egg",
                "is_veg": "0",
                "qty_unit": "Pieces",
                "created_at": "2025-06-23 08:39:17"
            },
            {
                "name": "Egg",
                "is_veg": "0",
                "qty_unit": "Pieces",
                "created_at": "2025-06-23 08:39:17"
            },
            {
                "name": "Egg",
                "is_veg": "0",
                "qty_unit": "Pieces",
                "created_at": "2025-06-23 08:39:17"
            },
            {
                "name": "Egg",
                "is_veg": "0",
                "qty_unit": "Pieces",
                "created_at": "2025-06-23 08:39:17"
            },
            {
                "name": "Egg",
                "is_veg": "0",
                "qty_unit": "Pieces",
                "created_at": "2025-06-23 08:39:17"
            },
            {
                "name": "Egg",
                "is_veg": "0",
                "qty_unit": "Pieces",
                "created_at": "2025-06-23 08:39:17"
            },
            {
                "name": "Potato",
                "is_veg": "1",
                "qty_unit": "Kgs",
                "created_at": "2025-06-23 08:39:17"
            },
            {
                "name": "Tomato",
                "is_veg": "1",
                "qty_unit": "Kgs",
                "created_at": "2025-06-23 08:39:17"
            }
        ]
    };

    const { currentPage, pageSize, totalPages, items } = data;
    const totalCount = totalPages * pageSize;

    const [page, setPage] = useState(currentPage - 1); // MUI uses 0-based index
    const [rowsPerPage, setRowsPerPage] = useState(pageSize);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
        // 🔁 Optionally call API here with newPage
    };

    const handleChangeRowsPerPage = (event) => {
        const newSize = parseInt(event.target.value, 10);
        setRowsPerPage(newSize);
        setPage(0);
        // 🔁 Optionally call API here with newSize
    };

    return (
        <Box>
            <Typography variant="h4" gutterBottom>
                { title }
            </Typography>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell>Is Veg</TableCell>
                            <TableCell>Unit</TableCell>
                            <TableCell>Created At</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {items.map((row, index) => (
                            <TableRow key={index}>
                                <TableCell>{row.name}</TableCell>
                                <TableCell>{row.is_veg === '1' ? 'Yes' : 'No'}</TableCell>
                                <TableCell>{row.qty_unit}</TableCell>
                                <TableCell>{row.created_at}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <TablePagination
                component="div"
                count={totalCount}
                page={page}
                onPageChange={handleChangePage}
                rowsPerPage={rowsPerPage}
                rowsPerPageOptions={[5, 10, 20, 50]}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
        </Box>
    );
}

export default AdminGrid;
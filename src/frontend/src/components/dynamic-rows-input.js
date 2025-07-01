import React, { useState, useEffect } from 'react';
import {
    Box,
    Button,
    IconButton,
    MenuItem,
    TextField,
    Typography,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AsyncSelect from "components/async-select";

const DynamicRowsInput = ({
  title = '',
  name = 'dynamic_rows_json',
  columns = [],
  initialRows = [{}],
  onChange = () => {},
}) => {
    const [rows, setRows] = useState(initialRows);
    const [jsonData, setJsonData] = useState('');

    useEffect(() => {
        const encoded = JSON.stringify(rows);
        setJsonData(encoded);
        onChange(rows);
    }, [rows]);

    const handleChange = (index, field, value) => {
        const newRows = [...rows];
        newRows[index][field] = value;
        setRows(newRows);
    };

    const handleAdd = () => {
        const newRow = {};
        columns.forEach(col => {
            newRow[col.name] = '';
        });
        setRows([...rows, newRow]);
    };

    const handleDelete = (index) => {
        const newRows = rows.filter((_, i) => i !== index);
        setRows(newRows);
    };

    const renderColumn = (col, row, index) => {
        if (col.type === 'async-select') {
            return (
                <AsyncSelect
                    label={col.label}
                    value={row[col.name]}
                    onChange={(val) => handleChange(index, col.name, val)}
                    fetchOptions={col.fetchOptions}
                />
            );
        }
        return (
            <TextField
                key={col.name}
                label={col.label}
                select={col.type === 'select'}
                type={col.type}
                value={row[col.name] || ''}
                onChange={(e) => handleChange(index, col.name, e.target.value)}
                fullWidth
            >
                {col.type === 'select' &&
                    (col.options || []).map((opt) => (
                        <MenuItem key={opt.value} value={opt.value}>
                            {opt.label}
                        </MenuItem>
                    ))}
            </TextField>
        );
    }

    return (
        <Box>
            {title && (
                <Typography variant="h6" gutterBottom>
                    {title}
                </Typography>
            )}
            {rows.map((row, index) => (
                <Box key={index} display="flex" gap={2} alignItems="center" mb={2} flexWrap="wrap">
                    {columns.map((col) => {
                        return (
                            <Box key={col.name} minWidth={col.minWidth || 200} flex={1}>
                                { renderColumn(col, row, index) }
                            </Box>
                        );
                    })}

                    <IconButton
                        aria-label="delete"
                        onClick={() => handleDelete(index)}
                        disabled={rows.length === 1}
                    >
                        <DeleteIcon />
                    </IconButton>
                </Box>
            ))}

            <Button variant="outlined" onClick={handleAdd}>
                Add Row
            </Button>

            <input type="hidden" name={name} value={jsonData} />
        </Box>
    );
};

export default DynamicRowsInput;
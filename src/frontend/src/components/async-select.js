import React, { useState, useEffect } from 'react';
import { Autocomplete, CircularProgress, TextField } from '@mui/material';
import { useDebounce } from 'util/stdlib';

const AsyncSelect = ({
    label,
    value,
    onChange,
    fetchOptions,
    initialOptions = []
}) => {
    const [inputValue, setInputValue] = useState('');
    const [options, setOptions] = useState(initialOptions);
    const [loading, setLoading] = useState(false);

    const debouncedInput = useDebounce(inputValue, 500);

    const selectedOption = options.find(opt => opt.value === value);

    useEffect(() => {
        if (debouncedInput === '' || debouncedInput.length < 3) return;

        let active = true;
        setLoading(true);

        fetchOptions(debouncedInput).then(results => {
            if (active) {
                setOptions(results);
                setLoading(false);
            }
        });

        return () => {
            active = false;
        };
    }, [debouncedInput]);

    if (selectedOption) {
        return (
            <>
                <TextField
                    label={label}
                    value={selectedOption.label}
                    disabled
                    fullWidth
                />
                <input type="hidden" value={selectedOption.value} />
            </>
        );
    }

    return (
        <Autocomplete
            options={options}
            getOptionLabel={(option) => option.label || ''}
            value={null}
            onChange={(e, newValue) => onChange(newValue?.value || '')}
            inputValue={inputValue}
            onInputChange={(e, newInput) => setInputValue(newInput)}
            loading={loading}
            renderInput={(params) => (
                <TextField
                    {...params}
                    label={label}
                    fullWidth
                    InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                            <>
                                {loading && <CircularProgress color="inherit" size={18} />}
                                {params.InputProps.endAdornment}
                            </>
                        )
                    }}
                />
            )}
        />
    );
};

export default AsyncSelect;
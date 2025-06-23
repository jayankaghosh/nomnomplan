import {Box} from "@mui/material";

const Loader = ({isActive}) => {
    if (!isActive) return null;

    return (
        <Box
            sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                bgcolor: 'rgba(0,0,0,0.4)', // overlay
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 9999
            }}
        >
            <img src={'/loader.gif'} alt="Loading..." style={{ width: 64, height: 64 }} />
        </Box>
    )
}
export default Loader;
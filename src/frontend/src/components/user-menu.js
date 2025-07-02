import {List, ListItem, ListItemText} from "@mui/material";
import {Link, useNavigate} from "react-router-dom";
import {HOME, LOGIN, SCHEDULE} from "pages/routes.config";
import {getURI} from "util/url";
import {setUserToken} from "util/auth";

const AdminMenu = ({ drawerOpen }) => {

    const navigate = useNavigate();

    const doLogout = () => {
        setUserToken(null);
        navigate(LOGIN);
    }

    const menuItems = [
        { label: 'Home', action: HOME },
        { label: 'Schedule', action: SCHEDULE },
        { label: 'Logout', action: doLogout },
    ];

    const currentUrl = getURI();

    return (
        <List>
            {
                menuItems.map(({label, action}, key) => {
                    const additionalProps = {}
                    if (typeof action === 'function') {
                        additionalProps.onClick = (e) => {
                            e.preventDefault();
                            action();
                        }
                    } else {
                        additionalProps.component = Link;
                        additionalProps.to = action;
                    }
                    return (
                        <ListItem
                            button
                            key={key}
                            className={currentUrl === action ? 'selected' : ''}
                            sx={{
                                justifyContent: drawerOpen ? 'initial' : 'center',
                                cursor: 'pointer',
                                color: 'inherit',
                                '&:visited': {
                                    color: 'inherit',
                                },
                                '&.selected': {
                                    backgroundColor: 'primary.main',
                                    color: 'white',
                                    '&:hover': {
                                        backgroundColor: 'primary.dark',
                                    },
                                }
                            }}
                            {...additionalProps}
                        >
                            <ListItemText
                                primary={label}
                                sx={{opacity: drawerOpen ? 1 : 0}}
                            />
                        </ListItem>
                    );
                })
            }
        </List>
    );
}

export default AdminMenu;
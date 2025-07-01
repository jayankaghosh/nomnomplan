import {List, ListItem, ListItemText} from "@mui/material";
import {useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import {ADMIN_DASHBOARD, ADMIN_INGREDIENTS, ADMIN_LOGIN, ADMIN_RECIPES, ADMIN_USERS} from "pages/routes.config";
import {getURI} from "util/url";
import {setAdminToken} from "util/auth";

const AdminMenu = ({ drawerOpen }) => {

    const navigate = useNavigate();

    const doLogout = () => {
        setAdminToken(null);
        navigate(ADMIN_LOGIN);
    }

    const menuItems = [
        { label: 'Dashboard', action: ADMIN_DASHBOARD },
        { label: 'Ingredients', action: ADMIN_INGREDIENTS },
        { label: 'Recipes', action: ADMIN_RECIPES },
        { label: 'Users', action: ADMIN_USERS },
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
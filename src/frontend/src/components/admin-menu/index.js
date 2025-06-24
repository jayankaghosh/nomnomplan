import {List, ListItem, ListItemText} from "@mui/material";
import {useState} from "react";
import {Link} from "react-router-dom";
import {ADMIN_DASHBOARD} from "pages/routes.config";
import {getURI} from "util/url";

const menuItems = [
    { label: 'Dashboard', action: ADMIN_DASHBOARD },
    { label: 'Ingredients', action: '/admin/ingredients' },
    { label: 'Recipes', action: '/admin/recipes' },
    { label: 'Logout', action: () => {  } },
];


const AdminMenu = ({ drawerOpen }) => {
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
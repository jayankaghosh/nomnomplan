import {List, ListItem, ListItemText} from "@mui/material";
import {useState} from "react";
import {ADMIN_DASHBOARD} from "../../pages/routes.config";

const menuItems = [
    { label: 'Dashboard', action: ADMIN_DASHBOARD },
    { label: 'Ingredients', action: '/admin/users' },
    { label: 'Recipes', action: '/admin/settings' },
    { label: 'Logout', action: () => {  } },
];


const AdminMenu = ({ drawerOpen }) => {
    const [selected, setSelected] = useState(ADMIN_DASHBOARD);

    return (
        <List>
            {
                menuItems.map(({label, url}) => {
                    return (
                        <ListItem
                            button
                            key={url}
                            selected={selected === url}
                            onClick={() => setSelected(url)}
                            sx={{justifyContent: drawerOpen ? 'initial' : 'center'}}
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
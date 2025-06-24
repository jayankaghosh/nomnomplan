
import AdminLayout from "layout/admin";
import {useAdminGuard} from "hooks/useAdminGuard";
import AdminGrid from "components/admin-grid";
import {getRecipeListQuery} from "../query/admin";
import dayjs from "dayjs";
import relativeTime from 'dayjs/plugin/relativeTime';
import { List, ListItem, ListItemText } from '@mui/material';

dayjs.extend(relativeTime);

const AdminRecipes = props => {
    useAdminGuard();

    const rowMutator = row => {
        row.created_at = dayjs(row.created_at).fromNow();
        row.updated_at = dayjs(row.updated_at).fromNow();
        return row;
    }

    const ingredientsRenderer = ingredients => {
        return (
            <List dense>
                {ingredients.map((ingredient) => (
                    <ListItem key={ingredient.id} disablePadding>
                        <ListItemText
                            primary={`• ${ingredient.name} - ${ingredient.qty} ${ingredient.qty_unit}`}
                            sx={{ ml: 1 }}
                        />
                    </ListItem>
                ))}
            </List>
        );
    }

    return (
        <AdminLayout>
            <AdminGrid
                title={'Recipe List'}
                query={getRecipeListQuery()}
                queryName={'getRecipes'}
                columns={['id', 'name', 'ingredients', 'created_at', 'updated_at']}
                rowMutator={ rowMutator }
                columnRenderers={{ ingredients: ingredientsRenderer }}
            />
        </AdminLayout>
    );
}

export default AdminRecipes;
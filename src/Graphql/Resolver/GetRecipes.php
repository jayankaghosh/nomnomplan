<?php

namespace JayankaGhosh\NomNomPlan\Graphql\Resolver;

class GetRecipes extends PaginatedList
{

    protected function getTable(): string
    {
        return 'recipe';
    }

    protected function prepareItem(array $item): array
    {
        $table = $this->tableFactory->create(['tableName' => 'recipe_ingredient']);
        $ingredients = $table->select(
            [
                'recipe_ingredient.recipe_id' => $item['id']
            ],
            [
                'ingredient.id',
                'ingredient.name',
                'ingredient.is_veg',
                'ingredient.qty_unit',
                'ingredient.created_at',
                'ingredient.updated_at',
                'recipe_ingredient.ingredient_qty(qty)'
            ],
            [
                '[>]ingredient' => ['ingredient_id' => 'id']
            ]
        );
        $item['ingredients'] = $ingredients;
        return $item;
    }
}
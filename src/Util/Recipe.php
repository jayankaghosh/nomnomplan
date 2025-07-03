<?php

namespace JayankaGhosh\NomNomPlan\Util;

use JayankaGhosh\NomNomPlan\Exception\NotFoundException;
use JayankaGhosh\NomNomPlan\Model\TableFactory;

class Recipe
{

    public function __construct(
        private readonly TableFactory $tableFactory
    )
    {
    }

    public function prepareDataById(int $id): array
    {
        $table = $this->tableFactory->create(['tableName' => 'recipe']);
        $recipe = $table->load('id', $id);
        if (!$recipe) {
            throw new NotFoundException(sprintf('Recipe with ID %s not found', $id));
        }
        return $this->prepareData($recipe);
    }

    public function prepareData(array $recipe): array
    {
        $table = $this->tableFactory->create(['tableName' => 'recipe_ingredient']);
        $ingredients = $table->select(
            [
                'recipe_ingredient.recipe_id' => $recipe['id']
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
        $recipe['ingredients'] = $ingredients;
        return $recipe;
    }
}
<?php

namespace JayankaGhosh\NomNomPlan\Graphql\Resolver;

use GraphQL\Type\Definition\ResolveInfo;
use JayankaGhosh\NomNomPlan\Exception\InternalApplicationException;
use JayankaGhosh\NomNomPlan\Exception\InvalidArgumentException;
use JayankaGhosh\NomNomPlan\Graphql\AdminResolverInterface;
use JayankaGhosh\NomNomPlan\Model\TableFactory;

class AdminInsertRecipe implements AdminResolverInterface
{

    public function __construct(
        private readonly TableFactory $tableFactory
    )
    {
    }

    public function resolve(
        array $args,
        array $context,
        array $root,
        ResolveInfo $info
    ): array
    {
        $recipeTable = $this->tableFactory->create(['tableName' => 'recipe']);
        $ingredientTable = $this->tableFactory->create(['tableName' => 'ingredient']);
        $recipeIngredientTable = $this->tableFactory->create(['tableName' => 'recipe_ingredient']);
        $input = $args['input'];
        $ingredients = $input['ingredients'];
        unset($input['ingredients']);
        foreach ($ingredients as $ingredient) {
            if (!$ingredientTable->load('id', $ingredient['id'])) {
                throw new InvalidArgumentException(sprintf('Ingredient with ID "%s" not found', $ingredient['id']));
            }
        }
        $recipe = $recipeTable->insert($input);
        if (!$recipe) {
            throw new InternalApplicationException('Could not save data');
        }
        foreach ($ingredients as $ingredient) {
            $recipeIngredientTable->insert([
                'recipe_id' => $recipe['id'],
                'ingredient_id' => $ingredient['id'],
                'ingredient_qty' => $ingredient['qty']
            ]);
        }
        return $root;
    }
}
<?php

namespace JayankaGhosh\NomNomPlan\Graphql\Resolver;

use GraphQL\Type\Definition\ResolveInfo;
use JayankaGhosh\NomNomPlan\Exception\CannotProceedException;
use JayankaGhosh\NomNomPlan\Graphql\AdminResolverInterface;
use JayankaGhosh\NomNomPlan\Model\TableFactory;

class AdminDeleteIngredient implements AdminResolverInterface
{

    public function __construct(
        private readonly TableFactory $tableFactory
    )
    {
    }

    public function resolve(array $args, array $context, array $root, ResolveInfo $info): array
    {
        $id = $args['id'];
        $ingredientTable = $this->tableFactory->create(['tableName' => 'ingredient']);
        $recipeIngredientTable = $this->tableFactory->create(['tableName' => 'recipe_ingredient']);
        $recipesCount = $recipeIngredientTable->count(['ingredient_id' => $id]);
        if ($recipesCount) {
            throw new CannotProceedException(sprintf('Cannot delete. %s recipes use this ingredient', $recipesCount));
        }
        $ingredientTable->delete([$id]);
        return [];
    }
}
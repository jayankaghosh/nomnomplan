<?php

namespace JayankaGhosh\NomNomPlan\Graphql\Resolver;

use GraphQL\Type\Definition\ResolveInfo;
use JayankaGhosh\NomNomPlan\Graphql\AdminResolverInterface;
use JayankaGhosh\NomNomPlan\Model\TableFactory;

class AdminDeleteRecipe implements AdminResolverInterface
{

    public function __construct(
        private readonly TableFactory $tableFactory
    )
    {
    }

    public function resolve(array $args, array $context, array $root, ResolveInfo $info): array
    {
        $id = $args['id'];
        $recipeTable = $this->tableFactory->create(['tableName' => 'recipe']);
        $recipeIngredientTable = $this->tableFactory->create(['tableName' => 'recipe_ingredient']);
        $recipeIngredientIds = array_column($recipeIngredientTable->select(['recipe_id' => $id], ['id']), 'id');
        $recipeIngredientTable->delete($recipeIngredientIds);
        $recipeTable->delete([$id]);
        return [];
    }
}
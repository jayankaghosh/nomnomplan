<?php

namespace JayankaGhosh\NomNomPlan\Graphql\Resolver;

use JayankaGhosh\NomNomPlan\Graphql\AdminResolverInterface;

class AdminGetIngredients extends PaginatedList implements AdminResolverInterface
{

    protected function getTable(): string
    {
        return 'ingredient';
    }

    protected function prepareItem(array $item): array
    {
        return $item;
    }
}
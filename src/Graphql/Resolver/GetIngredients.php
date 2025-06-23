<?php

namespace JayankaGhosh\NomNomPlan\Graphql\Resolver;

use JayankaGhosh\NomNomPlan\Graphql\ResolverInterface;

class GetIngredients extends PaginatedList
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
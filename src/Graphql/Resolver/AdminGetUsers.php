<?php

namespace JayankaGhosh\NomNomPlan\Graphql\Resolver;

use JayankaGhosh\NomNomPlan\Graphql\AdminResolverInterface;

class AdminGetUsers extends PaginatedList implements AdminResolverInterface
{

    protected function getTable(): string
    {
        return 'user';
    }

    protected function prepareItem(array $item): array
    {
        return $item;
    }
}
<?php

namespace JayankaGhosh\NomNomPlan\Graphql\Resolver;

use JayankaGhosh\NomNomPlan\Graphql\AdminResolverInterface;
use JayankaGhosh\NomNomPlan\Model\TableFactory;
use JayankaGhosh\NomNomPlan\Util\Recipe;

class AdminGetRecipes extends PaginatedList implements AdminResolverInterface
{

    public function __construct(
        TableFactory $tableFactory,
        private readonly Recipe $recipeUtil,
    )
    {
        parent::__construct($tableFactory);
    }

    protected function getTable(): string
    {
        return 'recipe';
    }

    protected function prepareItem(array $item): array
    {
        return $this->recipeUtil->prepareData($item);
    }
}
<?php

namespace JayankaGhosh\NomNomPlan\Graphql\Resolver;

use GraphQL\Type\Definition\ResolveInfo;
use JayankaGhosh\NomNomPlan\Exception\InvalidArgumentException;
use JayankaGhosh\NomNomPlan\Graphql\AdminResolverInterface;
use JayankaGhosh\NomNomPlan\Model\TableFactory;

class AdminInsertIngredient implements AdminResolverInterface
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
        $table = $this->tableFactory->create(['tableName' => 'ingredient']);
        $input = $args['input'];
        $name = $input['name'];
        if ($table->load('name', $name)) {
            throw new InvalidArgumentException(sprintf('Ingredient with name "%s" already exists', $name));
        }
        $input['is_veg'] = $input['is_veg'] ? 1 : 0;
        $table->insert($input);
        return $root;
    }
}
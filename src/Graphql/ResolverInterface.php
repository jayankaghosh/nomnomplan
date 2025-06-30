<?php

namespace JayankaGhosh\NomNomPlan\Graphql;

use GraphQL\Type\Definition\ResolveInfo;

interface ResolverInterface
{
    public function resolve(
        array $args,
        array $context,
        array $root,
        ResolveInfo $info
    );
}
<?php

namespace JayankaGhosh\NomNomPlan\Graphql;

interface ResolverInterface
{
    public function resolve(
        array $args,
        array $context
    );
}
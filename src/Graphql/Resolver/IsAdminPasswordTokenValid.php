<?php

namespace JayankaGhosh\NomNomPlan\Graphql\Resolver;

use GraphQL\Type\Definition\ResolveInfo;
use JayankaGhosh\NomNomPlan\Graphql\AdminResolverInterface;
use JayankaGhosh\NomNomPlan\Model\TableFactory;

class IsAdminPasswordTokenValid implements AdminResolverInterface
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
        $token = $args['token'] ?? '';
        $table = $this->tableFactory->create(['tableName' => 'admin_user']);
        $isValid = $token && $table->load('email_verification_token', $token);
        return [
            'status' => !!$isValid,
            'message' => $isValid ? 'Is valid' : 'Is not valid'
        ];
    }
}
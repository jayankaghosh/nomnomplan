<?php

namespace JayankaGhosh\NomNomPlan\Graphql\Resolver;

use GraphQL\Type\Definition\ResolveInfo;
use JayankaGhosh\NomNomPlan\Exception\InvalidArgumentException;
use JayankaGhosh\NomNomPlan\Graphql\AdminResolverInterface;
use JayankaGhosh\NomNomPlan\Model\TableFactory;
use JayankaGhosh\NomNomPlan\Util\Encryption;

class AdminInsertOrUpdateUser implements AdminResolverInterface
{
    public function __construct(
        private readonly TableFactory $tableFactory,
        private readonly Encryption $encryption
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
        $table = $this->tableFactory->create(['tableName' => 'user']);
        $input = $args['input'];
        if (!isset($input['id']) && $table->load('email', $input['email'])) {
            throw new InvalidArgumentException(sprintf('User with email "%s" already exists', $input['email']));
        }
        if (isset($input['id']) && !$table->load('id', $input['id'])) {
            throw new InvalidArgumentException(sprintf('Invalid user with ID "%s"', $input['id']));
        }
        if (!isset($input['id']) && !$input['password']) {
            throw new InvalidArgumentException('Password is a required field');
        }
        if ($input['password']) {
            $input['password_hash'] = $this->encryption->hash($input['password']);
        }
        unset($input['password']);
        $table->insert($input);
        return [];
    }
}
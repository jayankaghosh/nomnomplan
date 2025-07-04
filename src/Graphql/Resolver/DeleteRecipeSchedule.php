<?php

namespace JayankaGhosh\NomNomPlan\Graphql\Resolver;

use GraphQL\Type\Definition\ResolveInfo;
use JayankaGhosh\NomNomPlan\Exception\AuthenticationException;
use JayankaGhosh\NomNomPlan\Exception\InvalidArgumentException;
use JayankaGhosh\NomNomPlan\Graphql\ResolverInterface;
use JayankaGhosh\NomNomPlan\Model\TableFactory;

class DeleteRecipeSchedule implements ResolverInterface
{

    public function __construct(
        private readonly TableFactory $tableFactory
    )
    {
    }

    public function resolve(array $args, array $context, array $root, ResolveInfo $info): array
    {
        $loggedInUserId = $context['user']['id'] ?? null;
        if (!$loggedInUserId) {
            throw new AuthenticationException('Access denied');
        }
        $id = $args['id'];
        $userScheduleTable = $this->tableFactory->create(['tableName' => 'user_schedule']);
        $existingRow = $userScheduleTable->select([
            'id' => $id
        ]);
        if (!$existingRow) {
            throw new InvalidArgumentException('Row not found');
        }
        if ($existingRow['user_id'] !== $loggedInUserId) {
            throw new AuthenticationException('Access denied');
        }
        $userScheduleTable->delete([$id]);
        return [];
    }
}
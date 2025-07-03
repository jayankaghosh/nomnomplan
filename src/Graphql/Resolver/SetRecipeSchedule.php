<?php

namespace JayankaGhosh\NomNomPlan\Graphql\Resolver;

use GraphQL\Type\Definition\ResolveInfo;
use JayankaGhosh\NomNomPlan\Exception\AuthenticationException;
use JayankaGhosh\NomNomPlan\Exception\NotFoundException;
use JayankaGhosh\NomNomPlan\Graphql\ResolverInterface;
use JayankaGhosh\NomNomPlan\Model\TableFactory;

class SetRecipeSchedule implements ResolverInterface
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
        $userScheduleTable = $this->tableFactory->create(['tableName' => 'user_schedule']);
        $recipeTable = $this->tableFactory->create(['tableName' => 'recipe']);
        $recipeId = $args['recipe_id'];
        $recipe = $recipeTable->load('id', $recipeId);
        if (!$recipe) {
            throw new NotFoundException(sprintf('Recipe with ID %s not found', $recipeId));
        }
        $numberOfPeople = $args['number_of_people'];
        $date = $args['date'];
        $slot = $args['slot'];


        $existingRow = $userScheduleTable->select([
            'user_id' => $loggedInUserId,
            'date' => $date,
            'slot' => $slot
        ]);

        $data = [
            'recipe_id' => $recipeId,
            'user_id' => $loggedInUserId,
            'date' => $date,
            'slot' => $slot,
            'number_of_people' => $numberOfPeople
        ];

        if ($existingRow) {
            $date['id'] = $existingRow['id'];
        }
        $userScheduleTable->insert($data);
        return [];
    }
}
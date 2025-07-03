<?php

namespace JayankaGhosh\NomNomPlan\Graphql\Resolver;

use GraphQL\Type\Definition\ResolveInfo;
use JayankaGhosh\NomNomPlan\Exception\AuthenticationException;
use JayankaGhosh\NomNomPlan\Graphql\ResolverInterface;
use JayankaGhosh\NomNomPlan\Model\TableFactory;
use JayankaGhosh\NomNomPlan\Util\Recipe;

class GetRecipeSchedule implements ResolverInterface
{

    public function __construct(
        private readonly TableFactory $tableFactory,
        private readonly Recipe $recipeUtil,
    )
    {
    }

    public function resolve(array $args, array $context, array $root, ResolveInfo $info): array
    {
        $loggedInUserId = $context['user']['user_id'] ?? null;
        if (!$loggedInUserId) {
            throw new AuthenticationException('Access denied');
        }
        $userScheduleTable = $this->tableFactory->create(['tableName' => 'user_schedule']);
        $from = $args['from'];
        $to = $args['to'];
        $rows = $userScheduleTable->select([
            'AND' => [
                'user_id' => $loggedInUserId,
                'date[<>]' => [$from, $to]
            ]
        ]);
        $scheduleData = [];
        foreach ($rows as $row) {
            if (!isset($scheduleData[$row['date']])) {
                $scheduleData[$row['date']] = [];
            }
            $data = [
                'id' => $row['id'],
                'slot' => $row['slot'],
                'recipe' => $this->recipeUtil->prepareDataById($row['recipe_id']),
                'number_of_people' => $row['number_of_people'],
                'created_at' => $row['created_at'],
                'updated_at' => $row['updated_at'],
            ];
            $scheduleData[$row['date']][] = $data;
        }
        $schedule = [];
        foreach ($scheduleData as $date => $items) {
            $schedule[] = [
                'date' => $date,
                'slots' => $items
            ];
        }
        return [
            'schedule' => $schedule
        ];
    }
}
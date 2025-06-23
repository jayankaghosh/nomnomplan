<?php

namespace JayankaGhosh\NomNomPlan\Graphql\Resolver;

use JayankaGhosh\NomNomPlan\Graphql\ResolverInterface;
use JayankaGhosh\NomNomPlan\Model\TableFactory;

abstract class PaginatedList implements ResolverInterface
{

    abstract protected function getTable(): string;
    abstract protected function prepareItem(array $item): array;

    public function __construct(
        protected TableFactory $tableFactory
    )
    {
    }

    public function resolve(array $args, array $context)
    {
        $input = $args['input'] ?? [];
        $pageSize = $input['pageSize'] ?? null;
        $currentPage = $input['currentPage'] ?? 1;
        $sorts = $input['sort'] ?? [];
        $filterGroups = $input['filterGroups'] ?? [];
        $whereCondition = [];
        if ($pageSize) {
            $whereCondition['LIMIT'] = [
                $pageSize * ($currentPage - 1),
                $pageSize
            ];
        }
        if ($sorts) {
            $sortConditions = [];
            foreach ($sorts as $sort) {
                $sortConditions[$sort['field']] = $sort['direction'];
            }
            $whereCondition['ORDER'] = $sortConditions;
        }
        foreach ($filterGroups as $key => $filterGroup) {
            $groupType = strtoupper($filterGroup['type'] ?? 'AND');
            $groupKey = $groupType . ' #' . $key;
            $groupConditions = [];
            foreach ($filterGroup['filters'] ?? [] as $filter) {
                $field = $filter['field'];
                $condition = strtoupper($filter['condition'] ?? 'EQ');
                $value = $filter['value'];

                // Map GraphQL condition to Medoo operator
                $opMap = [
                    'EQ' => '',
                    'LT' => '[<]',
                    'LTEQ' => '[<=]',
                    'GT' => '[>]',
                    'GTEQ' => '[>=]',
                    'LIKE' => '[~]',
                    'IN' => '[IN]'
                ];

                $operator = $opMap[$condition] ?? '';
                $key = $field . $operator;
                if ($condition === 'IN') {
                    $value = array_map('trim', explode(',', $value));
                }
                $groupConditions[$key] = $value;
            }
            if (count($groupConditions)) {
                $whereCondition[$groupKey] = $groupConditions;
            }
        }
        $table = $this->tableFactory->create(['tableName' => $this->getTable()]);
        $items = $table->select($whereCondition);
        unset($whereCondition['LIMIT']);
        $totalItems = $table->count($whereCondition);
        foreach ($items as $key => $item) {
            $items[$key] = $this->prepareItem($item);
        }
        return [
            'pageSize' => $pageSize,
            'currentPage' => $currentPage,
            'totalPages' => ceil($totalItems / $pageSize),
            'items' => $items
        ];
    }
}
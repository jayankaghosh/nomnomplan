<?php

namespace JayankaGhosh\NomNomPlan\Model;

use Medoo\Medoo;

class Table
{
    public function __construct(
        private Db $db,
        private string $tableName
    )
    {
    }

    public function getConnection(): \Medoo\Medoo
    {
        return $this->db->getConnection();
    }

    public function select(
        array $where,
        ?array $columns = null,
        ?array $join = null
    ): array
    {
        $args = $this->processSelectArgs($where, $columns, $join);
        return $this->db->getConnection()->select(...$args);
    }

    public function count(
        array $where,
        ?array $columns = null,
        ?array $join = null
    ): int
    {
        $args = $this->processSelectArgs($where, $columns, $join);
        return $this->db->getConnection()->count(...$args);
    }

    public function load($field, $value): ?array
    {
        return $this->db->getConnection()->get($this->tableName, "*", [
            $field => $value
        ]);
    }

    public function insert(array $data)
    {
        return $this->db->getConnection()->insert($this->tableName, $data);
    }

    private function processSelectArgs($where, $columns, $join): array
    {
        $args = [
            $this->tableName,
            $columns ?? '*',
            $where
        ];
        if ($join) {
            array_splice($args, 1, 0, [$join]);
        }
        return $args;
    }

}
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

    public function log(): array
    {
        return $this->getConnection()->log();
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

    public function load($field, $value = null): ?array
    {
        $conditions = [];
        if (is_array($field)) {
            foreach ($field as $key => $value) {
                $conditions[$key] = $value;
            }
        } else {
            $conditions[$field] = $value;
        }
        return $this->db->getConnection()->get($this->tableName, "*", $conditions);
    }

    public function insert(array $data): ?array
    {
        $existingItem = isset($data['id']) ? $this->load('id', $data['id']): null;
        if ($existingItem) {
            $this->db->getConnection()->update($this->tableName, $data, ['id' => $data['id']]);
            $id = $data['id'];
        } else {
            $this->db->getConnection()->insert($this->tableName, $data);
            $id = $this->db->getConnection()->id();
        }
        return $this->load('id', $id);
    }

    public function delete(array $ids): void
    {
        if (count($ids)) {
            $this->db->getConnection()->delete($this->tableName, ['id' => $ids]);
        }
    }

    public function rawDelete(array $where): void
    {
        if (count($where)) {
            $this->db->getConnection()->delete($this->tableName, $where);
        }
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
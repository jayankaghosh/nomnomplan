<?php

namespace JayankaGhosh\NomNomPlan\Model;

use Medoo\Medoo;

class Db
{

    private ?Medoo $connection = null;

    public function getConnection(): Medoo
    {
        if (!$this->connection) {
            $this->connection = new Medoo([
                'type' => 'mysql',
                'host' => $_ENV['DB_HOST'],
                'database' => $_ENV['DB_DATABASE'],
                'username' => $_ENV['DB_USER'],
                'password' => $_ENV['DB_PASSWORD']
            ]);
        }
        return $this->connection;
    }

    public function tableExists(string $table): bool
    {
        $connection = $this->getConnection();
        $result = $connection->query(sprintf('SHOW TABLES FROM `%s` LIKE \'%s\'', $_ENV['DB_DATABASE'], $table))->fetchAll();
        return count($result) > 0;
    }
}
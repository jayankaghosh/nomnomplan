<?php

namespace JayankaGhosh\NomNomPlan\Setup;

use JayankaGhosh\NomNomPlan\Model\Db;
use Medoo\Medoo;
use Om\DependencyInjection\NonInterceptableInterface;

class DbSetup implements NonInterceptableInterface
{
    public function __construct(
        private Db $db
    )
    {

    }

    public function run(): void
    {
        $connection = $this->db->getConnection();
        $this->createIngredientTable($connection);
        $this->createRecipeTable($connection);
        $this->createIngredientRecipeMapTable($connection);
    }

    private function createIngredientTable(Medoo $connection): void
    {
        $connection->create('ingredient', [
            "id" => [
                "INT",
                "NOT NULL",
                "AUTO_INCREMENT",
                "PRIMARY KEY"
            ],
            "name" => [
                "VARCHAR(300)",
                "NOT NULL",
                "UNIQUE"
            ],
            "is_veg" => [
                "TINYINT(1)",
                "NOT NULL",
                "DEFAULT 0"
            ],
            "created_at" => [
                "DATETIME",
                "NOT NULL",
                "DEFAULT CURRENT_TIMESTAMP"
            ],
            "updated_at" => [
                "DATETIME",
                "NOT NULL",
                "DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"
            ]
        ]);
    }

    private function createRecipeTable(Medoo $connection): void
    {
        $connection->create('recipe', [
            "id" => [
                "INT",
                "NOT NULL",
                "AUTO_INCREMENT",
                "PRIMARY KEY"
            ],
            "name" => [
                "VARCHAR(300)",
                "NOT NULL",
                "UNIQUE"
            ],
            "created_at" => [
                "DATETIME",
                "NOT NULL",
                "DEFAULT CURRENT_TIMESTAMP"
            ],
            "updated_at" => [
                "DATETIME",
                "NOT NULL",
                "DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"
            ]
        ]);
    }

    private function createIngredientRecipeMapTable(Medoo $connection): void
    {
        $table = 'recipe_ingredient';
        $tableExists = $this->db->tableExists($table);
        $connection->create($table, [
            "id" => [
                "INT",
                "NOT NULL",
                "AUTO_INCREMENT",
                "PRIMARY KEY"
            ],
            "recipe_id" => [
                "INT",
                "NOT NULL"
            ],
            "ingredient_id" => [
                "INT",
                "NOT NULL"
            ],
            "ingredient_qty" => [
                "DECIMAL(10,2)",
                "NOT NULL",
                "DEFAULT 0.00"
            ],
            "ingredient_qty_unit" => [
                "VARCHAR(50)",
                "NOT NULL"
            ],
            "created_at" => [
                "DATETIME",
                "NOT NULL",
                "DEFAULT CURRENT_TIMESTAMP"
            ],
            "updated_at" => [
                "DATETIME",
                "NOT NULL",
                "DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"
            ]
        ], [
            "ENGINE" => "InnoDB"
        ]);

        if (!$tableExists) {
            $connection->query("
            ALTER TABLE $table
            ADD CONSTRAINT fk_recipe
                FOREIGN KEY (recipe_id) REFERENCES recipe(id)
                ON DELETE RESTRICT,
            ADD CONSTRAINT fk_ingredient
                FOREIGN KEY (ingredient_id) REFERENCES ingredient(id)
                ON DELETE RESTRICT
        ");
        }
    }
}
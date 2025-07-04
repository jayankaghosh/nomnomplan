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
        $this->createUserTable($connection);
        $this->createAdminUserTable($connection);
        $this->createIngredientTable($connection);
        $this->createRecipeTable($connection);
        $this->createIngredientRecipeMapTable($connection);
        $this->createAdminAccessTokenTable($connection);
        $this->createUserAccessTokenTable($connection);
        $this->createUserScheduleTable($connection);
    }

    private function createAdminAccessTokenTable(Medoo $connection): void
    {
        $table = 'admin_token';
        $tableExists = $this->db->tableExists($table);
        $connection->create($table, [
            "id" => [
                "INT",
                "NOT NULL",
                "AUTO_INCREMENT",
                "PRIMARY KEY"
            ],
            "admin_id" => [
                "INT",
                "NOT NULL"
            ],
            "token" => [
                "VARCHAR(100)",
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
        ], [
            "ENGINE" => "InnoDB"
        ]);

        if (!$tableExists) {
            $connection->query("
            ALTER TABLE $table
            ADD CONSTRAINT fk_token_admin_token_admin_id
                FOREIGN KEY (admin_id) REFERENCES admin_user(id)
                ON DELETE CASCADE
        ");
        }
    }

    private function createUserAccessTokenTable(Medoo $connection): void
    {
        $table = 'user_token';
        $tableExists = $this->db->tableExists($table);
        $connection->create($table, [
            "id" => [
                "INT",
                "NOT NULL",
                "AUTO_INCREMENT",
                "PRIMARY KEY"
            ],
            "user_id" => [
                "INT",
                "NOT NULL"
            ],
            "token" => [
                "VARCHAR(100)",
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
        ], [
            "ENGINE" => "InnoDB"
        ]);

        if (!$tableExists) {
            $connection->query("
            ALTER TABLE $table
            ADD CONSTRAINT fk_token_user_token_user_id
                FOREIGN KEY (user_id) REFERENCES user(id)
                ON DELETE CASCADE
        ");
        }
    }

    private function createUserTable(Medoo $connection): void
    {
        $connection->create('user', [
            "id" => [
                "INT",
                "NOT NULL",
                "AUTO_INCREMENT",
                "PRIMARY KEY"
            ],
            "name" => [
                "VARCHAR(300)",
                "NOT NULL"
            ],
            "email" => [
                "VARCHAR(300)",
                "NOT NULL",
                "UNIQUE"
            ],
            "phone" => [
                "VARCHAR(20)",
                "NOT NULL",
                "UNIQUE"
            ],
            "is_blocked" => [
                "TINYINT(1)",
                "NOT NULL",
                "DEFAULT 0"
            ],
            "password_hash" => [
                "VARCHAR(300)",
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
        ]);
    }

    private function createAdminUserTable(Medoo $connection): void
    {
        $connection->create('admin_user', [
            "id" => [
                "INT",
                "NOT NULL",
                "AUTO_INCREMENT",
                "PRIMARY KEY"
            ],
            "name" => [
                "VARCHAR(300)",
                "NOT NULL"
            ],
            "email" => [
                "VARCHAR(300)",
                "NOT NULL",
                "UNIQUE"
            ],
            "password_hash" => [
                "VARCHAR(300)",
                "NOT NULL"
            ],
            "email_verification_token" => [
                "VARCHAR(300)",
                "NOT NULL"
            ],
            "is_email_verified" => [
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
            "qty_unit" => [
                "VARCHAR(50)",
                "NOT NULL"
            ],
            "unit_price" => [
                "DECIMAL(10,2)",
                "NOT NULL"
            ],
            "keywords" => [
                "TEXT",
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
            "keywords" => [
                "TEXT",
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

    private function createUserScheduleTable(Medoo $connection): void
    {
        $table = 'user_schedule';
        $tableExists = $this->db->tableExists($table);

        $connection->create($table, [
            "id" => [
                "INT",
                "NOT NULL",
                "AUTO_INCREMENT",
                "PRIMARY KEY"
            ],
            "user_id" => [
                "INT",
                "NOT NULL"
            ],
            "recipe_id" => [
                "INT",
                "NOT NULL"
            ],
            "number_of_people" => [
                "INT",
                "NOT NULL"
            ],
            "date" => [
                "DATE",
                "NOT NULL"
            ],
            "slot" => [
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
            ADD CONSTRAINT fk_user_schedule_user
                FOREIGN KEY (user_id) REFERENCES user(id)
                ON DELETE CASCADE
                ON UPDATE CASCADE,
            ADD CONSTRAINT fk_user_schedule_recipe
                FOREIGN KEY (recipe_id) REFERENCES recipe(id)
                ON DELETE CASCADE
                ON UPDATE CASCADE
        ");
        }
    }

}
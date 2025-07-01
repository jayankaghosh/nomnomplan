<?php

namespace JayankaGhosh\NomNomPlan\Util;

use JayankaGhosh\NomNomPlan\Exception\ApplicationException;
use JayankaGhosh\NomNomPlan\Model\TableFactory;

class Import
{

    const ENTITY_INGREDIENT = 'ingredient';
    const ENTITY_RECIPE = 'recipe';

    public function __construct(
        private readonly TableFactory $tableFactory
    )
    {
    }

    public function import(
        string $entity,
        string $file,
        ?callable $initFn = null,
        ?callable $updateFn = null,
    ): void
    {
        $rows = $this->processFileData($file);
        $initFn(count($rows));
        if ($entity === self::ENTITY_INGREDIENT) {
            $table = $this->tableFactory->create(['tableName' => 'ingredient']);
            foreach ($rows as $row) {
                if (!isset($row['name'])) {
                    throw new ApplicationException('Name is a required field');
                }
                $row['name'] = strtolower($row['name']);
                $existingRow = $table->load('name', $row['name']);
                if ($existingRow) {
                    $row['id'] = $existingRow['id'];
                }
                $table->insert($row);
                $updateFn($row);
            }
        } else if ($entity === self::ENTITY_RECIPE) {
            $table = $this->tableFactory->create(['tableName' => 'recipe']);
            $ingredientTable = $this->tableFactory->create(['tableName' => 'ingredient']);
            $recipeIngredientTable = $this->tableFactory->create(['tableName' => 'recipe_ingredient']);
            foreach ($rows as $row) {
                if (!isset($row['name'])) {
                    throw new ApplicationException('Name is a required field');
                }
                $row['name'] = strtolower($row['name']);
                $ingredients = $row['ingredients'] ?? null;
                unset($row['ingredients']);
                $existingRow = $table->load('name', $row['name']);
                if ($existingRow) {
                    $row['id'] = $existingRow['id'];
                }
                $recipe = $table->insert($row);
                if ($ingredients) {
                    $validIngredients = [];
                    $ingredients = explode(',', $ingredients);
                    foreach ($ingredients as $ingredient) {
                        list($name, $qty) = explode(':', $ingredient);
                        $name = strtolower($name);
                        $ingredient = $ingredientTable->load('name', $name);
                        if (!$ingredient) {
                            throw new ApplicationException(sprintf('Ingredient %s not found', $name));
                        }
                        $existingRow = $recipeIngredientTable->load([
                            'recipe_id' => $recipe['id'],
                            'ingredient_id' => $ingredient['id']
                        ]);
                        $data = [
                            'recipe_id' => $recipe['id'],
                            'ingredient_id' => $ingredient['id'],
                            'ingredient_qty' => $qty
                        ];
                        if ($existingRow) {
                            $data['id'] = $existingRow['id'];
                        }
                        $validIngredients[] = $recipeIngredientTable->insert($data)['id'];
                    }
                    if (count($validIngredients)) {
                        $invalidRows = array_column($recipeIngredientTable->select([
                            'recipe_id' => $recipe['id'],
                            'id[!]' => $validIngredients
                        ], ['id']), 'id');
                        $recipeIngredientTable->delete($invalidRows);
                    }
                }
                $updateFn($row);
            }
        } else {
            throw new ApplicationException(sprintf('Entity %s not supported', $entity));
        }
    }

    private function processFileData(string $file): array
    {
        $contents = $this->getFileContents($file);
        $type = 'csv';
        $data = null;
        if ($type === 'csv') {
            $lines = explode("\n", trim($contents));
            $header = str_getcsv(array_shift($lines));
            $data = [];

            foreach ($lines as $line) {
                $row = str_getcsv($line);
                $data[] = array_combine($header, $row);
            }
        }
        return $data;
    }

    private function getFileContents(string $filePath): string
    {
        if (filter_var($filePath, FILTER_VALIDATE_URL)) {
            $tempPath = sys_get_temp_dir() . '/' . basename(parse_url($filePath, PHP_URL_PATH));
            file_put_contents($tempPath, file_get_contents($filePath));
            if (!file_exists($tempPath)) {
                throw new ApplicationException('Could not download file');
            }
            $finalPath = realpath($tempPath);
        } elseif (str_starts_with($filePath, '/')) {
            $finalPath = $filePath;
        } else {
            $finalPath = getcwd() . '/' . $filePath;
        }
        if (!file_exists($finalPath)) {
            throw new ApplicationException('File not available');
        }
        $fileContents = file_get_contents($finalPath);
        return (string)$fileContents;
    }
}
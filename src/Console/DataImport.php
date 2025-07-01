<?php

namespace JayankaGhosh\NomNomPlan\Console;

use Algolia\AlgoliaSearch\Api\SearchClient;
use JayankaGhosh\NomNomPlan\Exception\ApplicationException;
use JayankaGhosh\NomNomPlan\Model\TableFactory;
use JayankaGhosh\NomNomPlan\Util\Import;
use Om\DependencyInjection\NonInterceptableInterface;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Helper\ProgressBar;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Input\InputOption;
use Symfony\Component\Console\Output\OutputInterface;

class DataImport extends Command implements NonInterceptableInterface
{
    public function __construct(
        private readonly TableFactory $tableFactory,
        private readonly Import $importUtil,
        ?string $name = null
    )
    {
        parent::__construct($name);
    }

    protected function configure()
    {
        $this->setName('app:data:import')
            ->setDescription('Import data using CSV')
            ->addOption(
                'entity',
                'E',
                InputOption::VALUE_REQUIRED,
                'Entity Type'
            )->addOption(
                'file',
                'F',
                InputOption::VALUE_REQUIRED,
                'Relative path of the file'
            );
    }

    protected function execute(InputInterface $input, OutputInterface $output)
    {
        $entity = $input->getOption('entity');
        $file = $input->getOption('file');
        if (!$entity) {
            throw new ApplicationException('Entity is required');
        }
        if (!$file) {
            throw new ApplicationException('File is required');
        }
        $output->writeln(sprintf('<info>Starting %s import...</info>', $entity));
        $progressBar = new ProgressBar($output, 0);;
        $this->importUtil->import(
            $entity,
            $file,
            function ($total) use ($progressBar, $output) {
                $progressBar->setMaxSteps($total);
                $progressBar->start();
            },
            function ($row) use ($progressBar, $output) {
                $progressBar->advance();
            },
        );
        $progressBar->finish();
        $output->writeln('');
        $output->writeln('<info>Import completed successfully</info>');
        return self::SUCCESS;
    }


    private function prepareRecipe(array $recipe): array
    {
        $table = $this->tableFactory->create(['tableName' => 'recipe_ingredient']);
        $ingredients = $table->select(
            [
                'recipe_ingredient.recipe_id' => $recipe['id']
            ],
            [
                'ingredient.id',
                'ingredient.name',
                'ingredient.is_veg',
                'ingredient.qty_unit',
                'ingredient.created_at',
                'ingredient.updated_at',
                'recipe_ingredient.ingredient_qty(qty)'
            ],
            [
                '[>]ingredient' => ['ingredient_id' => 'id']
            ]
        );
        $recipe['ingredients'] = $ingredients;
        return $recipe;
    }

    private function indexByPage(string $tableName, int $pageSize = 500, ?\Closure $handler = null): void
    {
        $table = $this->tableFactory->create(['tableName' => $tableName]);
        $count = $table->count([]);
        $pages = ceil($count/$pageSize);
        for ($page = 1; $page <= $pages; $page++) {
            $rows = $table->select([
                'LIMIT' => [$pageSize * ($page - 1), $pageSize]
            ]);
            $data = [];
            foreach ($rows as $row) {
                if ($handler) {
                    $row = $handler($row);
                }
                $row['objectID'] = $row['id'];
                $data[] = $row;
            }
            $client = SearchClient::create($_ENV['ALGOLIA_APP_ID'], $_ENV['ALGOLIA_API_KEY']);
            $client->saveObjects(
                $tableName . '_index',
                $data,
            );
        }
    }

}
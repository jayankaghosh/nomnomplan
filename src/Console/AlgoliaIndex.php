<?php

namespace JayankaGhosh\NomNomPlan\Console;

use Algolia\AlgoliaSearch\Api\SearchClient;
use JayankaGhosh\NomNomPlan\Model\TableFactory;
use JayankaGhosh\NomNomPlan\Util\Recipe;
use Om\DependencyInjection\NonInterceptableInterface;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;

class AlgoliaIndex extends Command implements NonInterceptableInterface
{
    public function __construct(
        private readonly TableFactory $tableFactory,
        private readonly Recipe $recipeUtil,
        ?string $name = null
    )
    {
        parent::__construct($name);
    }

    protected function configure()
    {
        $this->setName('algolia:index')
            ->setDescription('Index all records and send to algolia');
    }

    protected function execute(InputInterface $input, OutputInterface $output)
    {
        $output->writeln('<info>Starting indexing...</info>');
        $this->indexByPage('ingredient');
        $this->indexByPage('recipe', 500, $this->prepareRecipe(...));
        $output->writeln('<info>Indexing completed successfully</info>');
        return self::SUCCESS;
    }


    private function prepareRecipe(array $recipe): array
    {
        return $this->recipeUtil->prepareData($recipe);
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
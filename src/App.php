<?php

namespace JayankaGhosh\NomNomPlan;

use JayankaGhosh\NomNomPlan\App\Cli;
use JayankaGhosh\NomNomPlan\App\Graphql;
use JayankaGhosh\NomNomPlan\Exception\ApplicationException;

class App
{

    public function __construct(
        private readonly Graphql $graphql,
        private readonly Cli $cli
    )
    {
    }

    private function loadEnv(): void
    {
        $path = realpath(__DIR__ . '/../.env');
        if (!file_exists($path)) {
            throw new ApplicationException(sprintf('.env file not found in "%s"', $path));
        }
        $dotEnv = new \Symfony\Component\Dotenv\Dotenv();
        $dotEnv->load($path);
    }

    /**
     * @return void
     * @throws ApplicationException
     */
    public function run(): void
    {
        $this->loadEnv();
        if (php_sapi_name() === 'cli') {
            $this->cli->run();
        } else {
            $requestUri = trim($_SERVER['REQUEST_URI'] ?? '', '/');
            if ($requestUri === 'graphql') {
                $this->graphql->run();
            } else {
                throw new ApplicationException('URI Not supported');
            }
        }
    }
}
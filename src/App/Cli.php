<?php

namespace JayankaGhosh\NomNomPlan\App;

use JayankaGhosh\NomNomPlan\Console\AdminUserCreate;
use JayankaGhosh\NomNomPlan\Console\AlgoliaIndex;
use JayankaGhosh\NomNomPlan\Console\DataImport;
use JayankaGhosh\NomNomPlan\Console\Email;
use JayankaGhosh\NomNomPlan\Console\Setup;
use Om\ObjectManager\ObjectManager;
use Symfony\Component\Console\Application;

class Cli implements AppInterface
{

    public function __construct(
        private readonly ObjectManager $objectManager
    )
    {
    }

    public function run(): void
    {
        /** @var \Symfony\Component\Console\Application $application */
        $application = new Application();
        $commands = [
            Setup::class,
            Email::class,
            AdminUserCreate::class,
            AlgoliaIndex::class,
            DataImport::class,
        ];
        foreach ($commands as $command) {
            $application->add($this->objectManager->create($command));
        }
        $application->run();
    }
}
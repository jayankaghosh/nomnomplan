<?php

namespace JayankaGhosh\NomNomPlan\Console;

use Om\DependencyInjection\NonInterceptableInterface;
use Symfony\Component\Console\Command\Command;
use JayankaGhosh\NomNomPlan\Setup\Manager;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;

class Setup extends Command implements NonInterceptableInterface
{
    public function __construct(
        private readonly Manager $setupManager,
        ?string $name = null
    )
    {
        parent::__construct($name);
    }

    protected function configure(): void
    {
        $this->setName('app:setup')
            ->setDescription('Needs to be run the first time to install the application');
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $output->writeln('<info>Starting installation...</info>');
        $this->setupManager->run();
        $output->writeln('<info>Installation complete...</info>');
        return self::SUCCESS;
    }
}
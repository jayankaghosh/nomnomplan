<?php

namespace JayankaGhosh\NomNomPlan\Console;

use JayankaGhosh\NomNomPlan\Exception\ApplicationException;
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

}
<?php

namespace JayankaGhosh\NomNomPlan\Console;

use JayankaGhosh\NomNomPlan\Util\Email as EmailUtil;
use Om\DependencyInjection\NonInterceptableInterface;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Input\InputOption;
use Symfony\Component\Console\Output\OutputInterface;

class Email extends Command implements NonInterceptableInterface
{
    public function __construct(
        private readonly EmailUtil $emailUtil,
        ?string $name = null
    )
    {
        parent::__construct($name);
    }

    protected function configure()
    {
        $this->setName('app:email:test')
            ->setDescription('Command to test email sending capability')
            ->addOption(
                'recipient',
                'R',
                InputOption::VALUE_REQUIRED,
                'Email address of the recipient'
            );
    }

    protected function execute(InputInterface $input, OutputInterface $output)
    {
        $recipient = $input->getOption('recipient');
        if (!$recipient) {
            $output->writeln('<error>Recipient is required</error>');
            return Command::FAILURE;
        }
        $this->emailUtil->send(
            'Test Subject',
            'Test Body',
            [
                'email' => $_ENV['EMAIL_FROM'],
                'name' => $_ENV['EMAIL_FROM_NAME']
            ],
            [
                [
                    'email' => $recipient
                ]
            ]
        );
        $output->writeln('<info>Email sent successfully</info>');
        return self::SUCCESS;
    }
}
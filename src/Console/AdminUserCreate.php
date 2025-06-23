<?php

namespace JayankaGhosh\NomNomPlan\Console;

use JayankaGhosh\NomNomPlan\Exception\DuplicateDataException;
use JayankaGhosh\NomNomPlan\Exception\InternalApplicationException;
use JayankaGhosh\NomNomPlan\Model\TableFactory;
use JayankaGhosh\NomNomPlan\Util\Email;
use JayankaGhosh\NomNomPlan\Util\Template;
use Om\DependencyInjection\NonInterceptableInterface;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Input\InputOption;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Question\Question;

class AdminUserCreate extends Command implements NonInterceptableInterface
{

    public function __construct(
        private readonly TableFactory $tableFactory,
        private readonly Template     $templateUtil,
        private readonly Email   $emailUtil,
        ?string                       $name = null
    )
    {
        parent::__construct($name);
    }

    protected function configure()
    {
        $this
            ->setName('admin:user:create')
            ->setDescription('Creates a new admin user with name and email')
            ->addOption('name', 'N', InputOption::VALUE_OPTIONAL, 'Name of the admin user')
            ->addOption('email', 'E', InputOption::VALUE_OPTIONAL, 'Email of the admin user');
    }

    protected function execute(InputInterface $input, OutputInterface $output)
    {
        $helper = $this->getHelper('question');
        $requiredFields = ['name', 'email'];
        $data = [];
        foreach ($requiredFields as $requiredField) {
            $value = $input->getOption($requiredField);
            while (!$value) {
                $question = new Question(sprintf('Please enter %s: ', $requiredField));
                $value = $helper->ask($input, $output, $question);
            }
            $data[$requiredField] = $value;
        }
        $table = $this->tableFactory->create(['tableName' => 'admin_user']);
        if ($table->load('email', $data['email'])) {
            throw new DuplicateDataException(sprintf('Admin user with email "%s" already exists', $data['email']));
        }
        try {
            $data['email_verification_token'] = md5(bin2hex(random_bytes(32)));
        } catch (\Throwable) {
            throw new InternalApplicationException('Could not generate token');
        }
        $data['is_email_verified'] = 0;
        $data['password_hash'] = '';
        $this->emailUtil->send(
            'Admin account verification',
            $this->templateUtil->render('email/admin_email_verify', $data),
            [
                'email' => $_ENV['EMAIL_FROM'],
                'name' => $_ENV['EMAIL_FROM_NAME']
            ],
            [
                [
                    'email' => $data['email'],
                    'name' => $data['name']
                ]
            ]
        );
        $table->insert($data);
        $output->writeln(
            sprintf(
                '<info>User created successfully. An email has been sent to %s for verification</info>',
                $data['email']
            )
        );
        return self::SUCCESS;
    }
}
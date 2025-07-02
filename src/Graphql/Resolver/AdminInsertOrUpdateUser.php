<?php

namespace JayankaGhosh\NomNomPlan\Graphql\Resolver;

use GraphQL\Type\Definition\ResolveInfo;
use JayankaGhosh\NomNomPlan\Exception\InvalidArgumentException;
use JayankaGhosh\NomNomPlan\Graphql\AdminResolverInterface;
use JayankaGhosh\NomNomPlan\Model\TableFactory;
use JayankaGhosh\NomNomPlan\Util\Email;
use JayankaGhosh\NomNomPlan\Util\Encryption;
use JayankaGhosh\NomNomPlan\Util\Template;

class AdminInsertOrUpdateUser implements AdminResolverInterface
{
    public function __construct(
        private readonly TableFactory $tableFactory,
        private readonly Encryption $encryption,
        private readonly Email $emailUtil,
        private readonly Template $templateUtil,
    )
    {
    }

    public function resolve(
        array $args,
        array $context,
        array $root,
        ResolveInfo $info
    ): array
    {
        $table = $this->tableFactory->create(['tableName' => 'user']);
        $input = $args['input'];
        if (!isset($input['id']) && $table->load('email', $input['email'])) {
            throw new InvalidArgumentException(sprintf('User with email "%s" already exists', $input['email']));
        }
        if (isset($input['id']) && !$table->load('id', $input['id'])) {
            throw new InvalidArgumentException(sprintf('Invalid user with ID "%s"', $input['id']));
        }
        if (!isset($input['id']) && !$input['password']) {
            throw new InvalidArgumentException('Password is a required field');
        }
        $input['is_blocked'] = $input['is_blocked'] ? 1 : 0;
        $password = null;
        if ($input['password']) {
            $password = $input['password'];
            $input['password_hash'] = $this->encryption->hash($input['password']);
        }
        unset($input['password']);
        $user = $table->insert($input);
        if (!isset($input['id'])) {
            $user['password'] = $password;
            $this->emailUtil->send(
                'Welcome to NomNomPlan – Your account details inside',
                $this->templateUtil->render('email/user_register', $user),
                [
                    'email' => $_ENV['EMAIL_FROM'],
                    'name' => $_ENV['EMAIL_FROM_NAME']
                ],
                [
                    [
                        'email' => $input['email'],
                        'name' => $input['name']
                    ]
                ]
            );
        }
        return [];
    }
}
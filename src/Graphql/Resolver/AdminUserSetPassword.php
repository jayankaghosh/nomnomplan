<?php

namespace JayankaGhosh\NomNomPlan\Graphql\Resolver;

use GraphQL\Type\Definition\ResolveInfo;
use JayankaGhosh\NomNomPlan\Graphql\ResolverInterface;
use JayankaGhosh\NomNomPlan\Model\TableFactory;
use JayankaGhosh\NomNomPlan\Util\Encryption;

class AdminUserSetPassword implements ResolverInterface
{

    public function __construct(
        private readonly TableFactory $tableFactory,
        private readonly Encryption $encryption,
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
        $token = $args['token'] ?? '';
        $password = $args['password'] ?? null;
        $table = $this->tableFactory->create(['tableName' => 'admin_user']);
        if ($token) {
            $adminUser = $table->load('email_verification_token', $token);
            if (!$adminUser) {
                return [
                    'status' => false,
                    'message' => 'Admin user not found'
                ];
            }
            if ($adminUser['is_email_verified']) {
                return [
                    'status' => false,
                    'message' => 'Setting password not allowed'
                ];
            }
            if ($password) {
                $adminUser['password_hash'] = $this->encryption->hash($password);
                $adminUser['is_email_verified'] = 1;
                $adminUser['email_verification_token'] = null;
            }
            $table->insert($adminUser);
            return [
                'status' => true,
                'message' => 'Password set successfully'
            ];
        }
        return [
            'status' => false,
            'message' => 'Token not found'
        ];
    }
}
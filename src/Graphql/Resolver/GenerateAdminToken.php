<?php

namespace JayankaGhosh\NomNomPlan\Graphql\Resolver;

use GraphQL\Type\Definition\ResolveInfo;
use JayankaGhosh\NomNomPlan\Exception\AuthenticationException;
use JayankaGhosh\NomNomPlan\Graphql\AdminResolverInterface;
use JayankaGhosh\NomNomPlan\Model\TableFactory;
use JayankaGhosh\NomNomPlan\Util\Encryption;

class GenerateAdminToken implements AdminResolverInterface
{

    public function __construct(
        private readonly TableFactory $tableFactory,
        private readonly Encryption $encryption
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
        $username = $args['username'] ?? null;
        $password = $args['password'] ?? null;
        $adminModel = $this->tableFactory->create(['tableName' => 'admin_user']);
        $adminTokenModel = $this->tableFactory->create(['tableName' => 'admin_token']);
        $admin = $adminModel->load('email', $username);
        if ($admin && $this->encryption->verifyHash($password, $admin['password_hash'])) {
            do {
                $token = $this->encryption->hash(uniqid());
            } while ($adminTokenModel->load('token', $token));
            $adminTokenModel->insert([
                'admin_id' => $admin['id'],
                'token' => $token
            ]);
            return [
                'token' => $token
            ];
        }
        throw new AuthenticationException('Invalid username and/or password');
    }
}
<?php

namespace JayankaGhosh\NomNomPlan\Graphql\Resolver;

use GraphQL\Type\Definition\ResolveInfo;
use JayankaGhosh\NomNomPlan\Exception\AuthorizationException;
use JayankaGhosh\NomNomPlan\Graphql\ResolverInterface;
use JayankaGhosh\NomNomPlan\Model\TableFactory;
use JayankaGhosh\NomNomPlan\Util\Encryption;

class GenerateUserToken implements ResolverInterface
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
        $userModel = $this->tableFactory->create(['tableName' => 'user']);
        $userTokenModel = $this->tableFactory->create(['tableName' => 'user_token']);
        $user = $userModel->load('email', $username);
        if ($user && !$user['is_blocked'] && $this->encryption->verifyHash($password, $user['password_hash'])) {
            do {
                $token = $this->encryption->hash(uniqid());
            } while ($userTokenModel->load('token', $token));
            $userTokenModel->insert([
                'user_id' => $user['id'],
                'token' => $token
            ]);
            return [
                'token' => $token
            ];
        }
        throw new AuthorizationException('Invalid username and/or password');
    }
}
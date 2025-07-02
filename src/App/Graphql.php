<?php

namespace JayankaGhosh\NomNomPlan\App;

use GraphQL\Error\DebugFlag;
use GraphQL\Utils\BuildSchema;
use GraphQL\Language\Parser;
use JayankaGhosh\NomNomPlan\Exception\AuthenticationException;
use JayankaGhosh\NomNomPlan\Graphql\AdminResolverInterface;
use JayankaGhosh\NomNomPlan\Graphql\ResolverInterface;
use JayankaGhosh\NomNomPlan\Model\TableFactory;
use Om\ObjectManager\ObjectManager;

class Graphql implements AppInterface
{

    const SCHEMA_PATH = __DIR__ . '/../Graphql/schema.graphqls';

    public function __construct(
        private readonly TableFactory $tableFactory
    )
    {
    }

    public function run()
    {
        $schemaSDL = \file_get_contents(self::SCHEMA_PATH);
        $schema = BuildSchema::build($schemaSDL);
        $documentNode = Parser::parse($schemaSDL);
        $objectManager = ObjectManager::getInstance();
        $resolvers = [];
        $rootValue = [];
        $appContext = $this->getContext();
        foreach ($documentNode->definitions as $def) {
            if ($def->kind === 'ObjectTypeDefinition' && in_array($def->name->value, ['Query', 'Mutation'])) {
                foreach ($def->fields as $field) {
                    $fieldName = $field->name->value;
                    foreach ($field->directives as $directive) {
                        if ($directive->name->value === 'resolver') {
                            foreach ($directive->arguments as $arg) {
                                if ($arg->name->value === 'class') {
                                    $resolverClass = $arg->value->value;
                                    $resolvers[$fieldName] = $resolverClass;
                                }
                            }
                        }
                    }
                }
            }
        }
        if (count($resolvers)) {
            foreach ($resolvers as $field => $className) {
                $rootValue[$field] = function ($root, $args, $context, $info) use ($className, $field, $appContext) {
                    global $objectManager;
                    /** @var ResolverInterface $resolverClassInstance */
                    $resolverClassInstance = $objectManager->create($className);
                    $this->validateResolver($resolverClassInstance);
                    $response = $resolverClassInstance->resolve($args, [...($context ?? []), ...$appContext], $root, $info);
                    if (!count($response)) {
                        $response = $root;
                    }
                    return $response;
                };
            }
        }

        $input = json_decode(file_get_contents('php://input'), true);
        $result = \GraphQL\GraphQL::executeQuery(
            $schema,
            $input['query'] ?? '',
            $rootValue,
            null,
            $input['variables'] ?? []
        );
        $output = $result->toArray(DebugFlag::INCLUDE_DEBUG_MESSAGE);
        header('Content-Type: application/json');
        echo \json_encode($output);
        exit(0);
    }

    protected function getContext(): array
    {
        $adminTokenTable = $this->tableFactory->create(['tableName' => 'admin_token']);
        $adminToken = getallheaders()['Admin-Token'] ?? null;
        $admin = !$adminTokenTable->load('token', $adminToken);

        $userTokenTable = $this->tableFactory->create(['tableName' => 'user_token']);
        $userToken = getallheaders()['Token'] ?? null;
        $user = !$userTokenTable->load('token', $userToken);

        $context = [
            'user' => $user,
            'admin' => $admin
        ];

        return $context;
    }

    protected function validateResolver(ResolverInterface $resolver): void
    {
        if ($resolver instanceof AdminResolverInterface) {
            $adminTokenTable = $this->tableFactory->create(['tableName' => 'admin_token']);
            $adminToken = getallheaders()['Admin-Token'] ?? null;
            if (!$adminTokenTable->load('token', $adminToken)) {
                throw new AuthenticationException('Authentication error');
            }
        }
    }
}
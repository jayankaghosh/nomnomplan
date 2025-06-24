<?php

namespace JayankaGhosh\NomNomPlan\App;

use GraphQL\Error\DebugFlag;
use GraphQL\Utils\BuildSchema;
use GraphQL\Language\Parser;
use JayankaGhosh\NomNomPlan\Graphql\ResolverInterface;
use Om\ObjectManager\ObjectManager;

class Graphql implements AppInterface
{

    const SCHEMA_PATH = __DIR__ . '/../Graphql/schema.graphqls';

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
                    return $resolverClassInstance->resolve($args, [...($context ?? []), ...$appContext]);
                };
            }
        }

        $input = json_decode(file_get_contents('php://input'), true);
        $result = \GraphQL\GraphQL::executeQuery(
            $schema,
            $input['query'] ?? '',
            $rootValue, null,
            $input['variables'] ?? []
        );
        $output = $result->toArray(DebugFlag::INCLUDE_DEBUG_MESSAGE);
        header('Content-Type: application/json');
        echo \json_encode($output);
        exit(0);
    }

    protected function getContext(): array
    {
        return [];
    }
}
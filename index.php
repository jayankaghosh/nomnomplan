<?php

require_once __DIR__ . '/vendor/autoload.php';

\Symfony\Component\ErrorHandler\ErrorHandler::register();
set_exception_handler(function (\Throwable $e) {
    // Detect CLI vs Web
    if (php_sapi_name() === 'cli') {
        echo sprintf("ERROR\n\n%s\n\nTRACE\n----------\n%s\n", $e->getMessage(), $e->getTraceAsString());
    } else {
        http_response_code(500);
        echo sprintf('<h1>%s</h1><p>%s</p>', $e->getMessage(), $e->getTraceAsString());
    }
});

$generatedDirectoryPath = __DIR__ . '/generated/';
$objectManagerFactory = new \Om\OmFactory(null, $generatedDirectoryPath);
$objectManager = $objectManagerFactory->getInstance();

$app = $objectManager->get(\JayankaGhosh\NomNomPlan\App::class);
$app->run();
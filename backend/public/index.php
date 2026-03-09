<?php

require_once __DIR__ . '/../vendor/autoload.php';

use App\GraphQL\AppSchema;
use App\Helpers\CorsHelper;
use GraphQL\GraphQL;
use GraphQL\Error\DebugFlag;
use Dotenv\Dotenv;

$dotenv = Dotenv::createImmutable(__DIR__ . '/..');
$dotenv->load();

CorsHelper::setHeaders();

try {
    $schema = AppSchema::build();
    $rawInput = file_get_contents('php://input');
    $input = json_decode($rawInput, true);

    $query = $input['query'] ?? '';
    $variables = $input['variables'] ?? null;

    $result = GraphQL::executeQuery($schema, $query, null, null, $variables);
    $output = $result->toArray(DebugFlag::INCLUDE_DEBUG_MESSAGE);
} catch (\Throwable $e) {
    $output = ['errors' => [['message' => $e->getMessage()]]];
}

echo json_encode($output);
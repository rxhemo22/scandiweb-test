<?php

namespace App\GraphQL\Resolvers;

use App\Config\Database;
use App\Models\Category;

class CategoryResolver
{
    public function getAll(): array
    {
        $pdo = Database::getConnection();
        $stmt = $pdo->query('SELECT * FROM categories');
        $rows = $stmt->fetchAll(\PDO::FETCH_ASSOC);

        return array_map(fn($row) => new Category($row), $rows);
    }
}
<?php

namespace App\GraphQL\Resolvers;

use App\Config\Database;
use App\Models\ProductFactory;
use App\Models\AttributeFactory;

class ProductResolver
{
    public function getAll(?string $category = null): array
    {
        $pdo = Database::getConnection();

        if ($category && $category !== 'all') {
            $stmt = $pdo->prepare('
                SELECT p.* FROM products p
                JOIN categories c ON p.category_id = c.id
                WHERE c.name = ?
            ');
            $stmt->execute([$category]);
        } else {
            $stmt = $pdo->query('SELECT * FROM products');
        }

        $rows = $stmt->fetchAll(\PDO::FETCH_ASSOC);
        $products = [];

        foreach ($rows as $row) {
            $row['gallery'] = $this->getGallery($row['id']);
            $row['attributes'] = $this->getAttributes($row['id']);
            $row['prices'] = $this->getPrices($row['id']);
            $products[] = ProductFactory::create($row);
        }

        return $products;
    }

    public function getById(string $id): ?object
    {
        $pdo = Database::getConnection();
        $stmt = $pdo->prepare('SELECT * FROM products WHERE id = ?');
        $stmt->execute([$id]);
        $row = $stmt->fetch(\PDO::FETCH_ASSOC);

        if (!$row) return null;

        $row['gallery'] = $this->getGallery($row['id']);
        $row['attributes'] = $this->getAttributes($row['id']);
        $row['prices'] = $this->getPrices($row['id']);

        return ProductFactory::create($row);
    }

    private function getGallery(string $productId): array
    {
        $pdo = Database::getConnection();
        $stmt = $pdo->prepare('SELECT image_url FROM product_images WHERE product_id = ?');
        $stmt->execute([$productId]);
        return array_column($stmt->fetchAll(\PDO::FETCH_ASSOC), 'image_url');
    }

    private function getAttributes(string $productId): array
    {
        $pdo = Database::getConnection();
        $stmt = $pdo->prepare('
            SELECT a.id, a.name, a.type
            FROM attributes a
            JOIN product_attributes pa ON a.id = pa.attribute_id
            WHERE pa.product_id = ?
        ');
        $stmt->execute([$productId]);
        $attrs = $stmt->fetchAll(\PDO::FETCH_ASSOC);

        foreach ($attrs as &$attr) {
            $stmt2 = $pdo->prepare('SELECT display_value, value FROM attribute_items WHERE attribute_id = ?');
            $stmt2->execute([$attr['id']]);
            $attr['items'] = $stmt2->fetchAll(\PDO::FETCH_ASSOC);
        }

        return array_map(fn($a) => AttributeFactory::create($a), $attrs);
    }

    private function getPrices(string $productId): array
    {
        $pdo = Database::getConnection();
        $stmt = $pdo->prepare('SELECT amount, currency_label, currency_symbol FROM prices WHERE product_id = ?');
        $stmt->execute([$productId]);
        return $stmt->fetchAll(\PDO::FETCH_ASSOC);
    }
}
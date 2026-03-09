<?php

namespace App\GraphQL\Resolvers;

use App\Config\Database;

class OrderResolver
{
    public function placeOrder(array $items): bool
    {
        $pdo = Database::getConnection();

        $pdo->beginTransaction();

        try {
            $stmt = $pdo->prepare('INSERT INTO orders () VALUES ()');
            $stmt->execute();
            $orderId = $pdo->lastInsertId();

            foreach ($items as $item) {
                $stmt = $pdo->prepare('
                    INSERT INTO order_items (order_id, product_id, quantity)
                    VALUES (?, ?, ?)
                ');
                $stmt->execute([$orderId, $item['productId'], $item['quantity']]);
            }

            $pdo->commit();
            return true;
        } catch (\Exception $e) {
            $pdo->rollBack();
            return false;
        }
    }
}
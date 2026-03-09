<?php

namespace App\GraphQL;

use App\GraphQL\Resolvers\CategoryResolver;
use App\GraphQL\Resolvers\ProductResolver;
use App\GraphQL\Resolvers\OrderResolver;
use App\GraphQL\Types\CategoryType;
use App\GraphQL\Types\ProductType;
use App\GraphQL\Types\AttributeType;
use App\GraphQL\Types\AttributeItemType;
use App\GraphQL\Types\PriceType;
use GraphQL\Type\Definition\ObjectType;
use GraphQL\Type\Definition\Type;
use GraphQL\Type\Definition\InputObjectType;

class AppSchema
{
    public static function build(): \GraphQL\Type\Schema
    {
        $categoryType = new CategoryType();
        $attributeItemType = new AttributeItemType();
        $attributeType = new AttributeType($attributeItemType);
        $priceType = new PriceType();
        $productType = new ProductType($attributeType, $priceType);

        $categoryResolver = new CategoryResolver();
        $productResolver = new ProductResolver();
        $orderResolver = new OrderResolver();

        $orderItemInput = new InputObjectType([
            'name' => 'OrderItemInput',
            'fields' => [
                'productId' => Type::nonNull(Type::string()),
                'quantity' => Type::nonNull(Type::int()),
            ],
        ]);

        $queryType = new ObjectType([
            'name' => 'Query',
            'fields' => [
                'categories' => [
                    'type' => Type::listOf($categoryType),
                    'resolve' => fn() => $categoryResolver->getAll(),
                ],
                'products' => [
                    'type' => Type::listOf($productType),
                    'args' => [
                        'category' => Type::string(),
                    ],
                    'resolve' => fn($root, $args) => $productResolver->getAll($args['category'] ?? null),
                ],
                'product' => [
                    'type' => $productType,
                    'args' => [
                        'id' => Type::nonNull(Type::string()),
                    ],
                    'resolve' => fn($root, $args) => $productResolver->getById($args['id']),
                ],
            ],
        ]);

        $mutationType = new ObjectType([
            'name' => 'Mutation',
            'fields' => [
                'placeOrder' => [
                    'type' => Type::boolean(),
                    'args' => [
                        'items' => Type::nonNull(Type::listOf($orderItemInput)),
                    ],
                    'resolve' => fn($root, $args) => $orderResolver->placeOrder($args['items']),
                ],
            ],
        ]);

        return new \GraphQL\Type\Schema([
            'query' => $queryType,
            'mutation' => $mutationType,
        ]);
    }
}
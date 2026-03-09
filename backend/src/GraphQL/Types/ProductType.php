<?php

namespace App\GraphQL\Types;

use GraphQL\Type\Definition\ObjectType;
use GraphQL\Type\Definition\Type;

class ProductType extends ObjectType
{
    public function __construct(AttributeType $attributeType, PriceType $priceType)
    {
        parent::__construct([
            'name' => 'Product',
            'fields' => [
                'id' => [
                    'type' => Type::string(),
                    'resolve' => fn($product) => $product->getId(),
                ],
                'name' => [
                    'type' => Type::string(),
                    'resolve' => fn($product) => $product->getName(),
                ],
                'inStock' => [
                    'type' => Type::boolean(),
                    'resolve' => fn($product) => $product->isInStock(),
                ],
                'description' => [
                    'type' => Type::string(),
                    'resolve' => fn($product) => $product->getDescription(),
                ],
                'brand' => [
                    'type' => Type::string(),
                    'resolve' => fn($product) => $product->getBrand(),
                ],
                'type' => [
                    'type' => Type::string(),
                    'resolve' => fn($product) => $product->getType(),
                ],
                'gallery' => [
                    'type' => Type::listOf(Type::string()),
                    'resolve' => fn($product) => $product->getGallery(),
                ],
                'attributes' => [
                    'type' => Type::listOf($attributeType),
                    'resolve' => fn($product) => $product->getAttributes(),
                ],
                'prices' => [
                    'type' => Type::listOf($priceType),
                    'resolve' => fn($product) => $product->getPrices(),
                ],
            ],
        ]);
    }
}
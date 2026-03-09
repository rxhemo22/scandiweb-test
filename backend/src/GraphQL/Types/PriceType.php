<?php

namespace App\GraphQL\Types;

use GraphQL\Type\Definition\ObjectType;
use GraphQL\Type\Definition\Type;

class PriceType extends ObjectType
{
    public function __construct()
    {
        parent::__construct([
            'name' => 'Price',
            'fields' => [
                'amount' => Type::float(),
                'currencyLabel' => [
                    'type' => Type::string(),
                    'resolve' => fn($price) => $price['currency_label'] ?? '',
                ],
                'currencySymbol' => [
                    'type' => Type::string(),
                    'resolve' => fn($price) => $price['currency_symbol'] ?? '',
                ],
            ],
        ]);
    }
}
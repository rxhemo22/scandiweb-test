<?php

namespace App\Models;

class ProductFactory
{
    public static function create(array $data): AbstractProduct
    {
        if ($data['type'] === 'configurable') {
            return new ConfigurableProduct($data);
        }
        return new SimpleProduct($data);
    }
}
<?php

namespace App\Models;

class AttributeFactory
{
    public static function create(array $data): AbstractAttribute
    {
        if ($data['type'] === 'swatch') {
            return new SwatchAttribute($data);
        }
        return new TextAttribute($data);
    }
}
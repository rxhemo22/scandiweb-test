<?php

namespace App\Models;

class ConfigurableProduct extends AbstractProduct
{
    public function getType(): string
    {
        return 'configurable';
    }
}
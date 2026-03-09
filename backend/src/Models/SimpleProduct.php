<?php

namespace App\Models;

class SimpleProduct extends AbstractProduct
{
    public function getType(): string
    {
        return 'simple';
    }
}
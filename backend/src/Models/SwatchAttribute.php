<?php

namespace App\Models;

class SwatchAttribute extends AbstractAttribute
{
    public function renderType(): string
    {
        return 'swatch';
    }
}
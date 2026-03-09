<?php

namespace App\Models;

class TextAttribute extends AbstractAttribute
{
    public function renderType(): string
    {
        return 'text';
    }
}
<?php

namespace App\Models;

abstract class AbstractAttribute
{
    protected string $id;
    protected string $name;
    protected string $type;
    protected array $items;

    public function __construct(array $data)
    {
        $this->id = $data['id'];
        $this->name = $data['name'];
        $this->type = $data['type'];
        $this->items = $data['items'] ?? [];
    }

    public function getId(): string { return $this->id; }
    public function getName(): string { return $this->name; }
    public function getType(): string { return $this->type; }
    public function getItems(): array { return $this->items; }

    abstract public function renderType(): string;
}
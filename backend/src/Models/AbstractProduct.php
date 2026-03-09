<?php

namespace App\Models;

abstract class AbstractProduct
{
    protected string $id;
    protected string $name;
    protected bool $inStock;
    protected string $description;
    protected string $brand;
    protected array $gallery;
    protected array $attributes;
    protected array $prices;

    public function __construct(array $data)
    {
        $this->id = $data['id'];
        $this->name = $data['name'];
        $this->inStock = (bool)$data['inStock'];
        $this->description = $data['description'] ?? '';
        $this->brand = $data['brand'] ?? '';
        $this->gallery = $data['gallery'] ?? [];
        $this->attributes = $data['attributes'] ?? [];
        $this->prices = $data['prices'] ?? [];
    }

    public function getId(): string { return $this->id; }
    public function getName(): string { return $this->name; }
    public function isInStock(): bool { return $this->inStock; }
    public function getDescription(): string { return $this->description; }
    public function getBrand(): string { return $this->brand; }
    public function getGallery(): array { return $this->gallery; }
    public function getAttributes(): array { return $this->attributes; }
    public function getPrices(): array { return $this->prices; }

    abstract public function getType(): string;
}
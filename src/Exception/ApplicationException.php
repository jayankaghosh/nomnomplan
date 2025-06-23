<?php

namespace JayankaGhosh\NomNomPlan\Exception;

use GraphQL\Error\ClientAware;
use GraphQL\Error\Error;

class ApplicationException extends Error implements ClientAware
{

    const CATEGORY = 'application';

    /**
     * @inheritDoc
     */
    public function isClientSafe(): bool
    {
        return true;
    }

    public function getExtensions(): array
    {
        return [
            'category' => $this->getCategory()
        ];
    }

    public function getCategory(): string
    {
        return static::CATEGORY;
    }
}
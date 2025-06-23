<?php

namespace JayankaGhosh\NomNomPlan\Exception;

use GraphQL\Error\ClientAware;

class ApplicationException extends InternalApplicationException implements ClientAware
{

    const CATEGORY = 'application';

    /**
     * @inheritDoc
     */
    public function isClientSafe(): bool
    {
        return true;
    }

    public function getCategory(): string
    {
        return self::CATEGORY;
    }
}
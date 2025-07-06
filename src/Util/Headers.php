<?php

namespace JayankaGhosh\NomNomPlan\Util;

class Headers
{
    public function getHeader(string $name, bool $isCaseSensitive = false): ?string
    {
        $name = $isCaseSensitive ? $name : strtolower($name);
        $headers = getallheaders();

        foreach ($headers as $key => $value) {
            if ($isCaseSensitive ? $key === $name : strtolower($key) === $name) {
                return $value;
            }
        }

        return null;
    }
}
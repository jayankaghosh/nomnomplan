<?php

namespace JayankaGhosh\NomNomPlan\Util;

class Encryption
{
    public function hash(string $plainText): string
    {
        return password_hash(
            $plainText,
            PASSWORD_BCRYPT,
            ['cost' => 12]
        );
    }

    public function verifyHash(string $plainText, string $hash): bool
    {
        return password_verify($plainText, $hash);
    }
}
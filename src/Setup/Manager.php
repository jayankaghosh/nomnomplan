<?php

namespace JayankaGhosh\NomNomPlan\Setup;

class Manager
{
    public function __construct(
        private DbSetup $dbSetup
    )
    {
    }

    public function run(): void
    {
        $this->dbSetup->run();
    }
}
<?php

namespace JayankaGhosh\NomNomPlan\Util;

class Template
{

    const TEMPLATE_DIR_PATH = __DIR__ . '/../templates/';

    function render(
        string $templatePath,
        array $data = []
    ): string
    {
        return (function () use ($templatePath, $data) {
            $templatePath = self::TEMPLATE_DIR_PATH . trim($templatePath, '/') . '.phtml';
            return (function () {
                $data = func_get_arg(1);
                ob_start();
                include func_get_arg(0);
                return ob_get_clean();
            })($templatePath, $data);
        })();
    }
}
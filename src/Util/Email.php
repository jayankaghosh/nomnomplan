<?php

namespace JayankaGhosh\NomNomPlan\Util;

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;

class Email
{

    const RECIPIENT_TYPE_TO = 'to';
    const RECIPIENT_TYPE_CC = 'cc';
    const RECIPIENT_TYPE_BCC = 'bcc';

    public function send(
        string $subject,
        string $body,
        array $from,
        array $recipients,
        array $attachments = []
    )
    {
        $mail = new PHPMailer(true);
        $mail->SMTPDebug = $_ENV['APP_MODE'] === 'dev' ? SMTP::DEBUG_SERVER : SMTP::DEBUG_OFF;
        $mail->isSMTP();
        $mail->Host = $_ENV['SMTP_HOST'];
        $mail->SMTPAuth = true;
        $mail->Username = $_ENV['SMTP_USERNAME'];
        $mail->Password = $_ENV['SMTP_PASSWORD'];
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;
        $mail->Port = 465;

        if (isset($from['email'])) {
            $mail->setFrom($from['email'], $from['name'] ?? '');
        }
        foreach ($recipients as $recipient) {
            $type = $recipient['type'] ?? self::RECIPIENT_TYPE_TO;
            $email = $recipient['email'] ?? '';
            $name = $recipient['name'] ?? '';
            if ($email) {
                if ($type === self::RECIPIENT_TYPE_TO) {
                    $mail->addAddress($email, $name);
                } else if ($type === self::RECIPIENT_TYPE_CC) {
                    $mail->addCC($email, $name);
                } else if ($type === self::RECIPIENT_TYPE_BCC) {
                    $mail->addBCC($email, $name);
                }
            }
        }

        foreach ($attachments as $attachment) {
            $path = $attachment['path'] ?? '';
            $name = $attachment['name'] ?? null;
            if (file_exists($path)) {
                if (!$name) {
                    $name = pathinfo($path, PATHINFO_FILENAME);
                }
                $mail->addAttachment($path, $name);
            }
        }
        //Content
        $mail->isHTML(true);
        $mail->Subject = $subject;
        $mail->Body = $body;
        $mail->AltBody = strip_tags($body);

        $mail->send();
    }
}
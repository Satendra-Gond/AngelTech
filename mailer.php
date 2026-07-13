<?php

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;
use PHPMailer\PHPMailer\SMTP;

require __DIR__ . '/PHPMailer/src/Exception.php';
require __DIR__ . '/PHPMailer/src/PHPMailer.php';
require __DIR__ . '/PHPMailer/src/SMTP.php';

function sendEmail($to, $from, $to_name = null, $subject, $body, $attachment = null, $cc = array(), $bcc = array(), $reply = null, $reply_name = null,$another_email, $another_name) {
    $mail = new PHPMailer(true);

    try {
        // Server settings
        $mail->SMTPDebug = false;
        $mail->isSMTP();
        $mail->Host       = 'mail.startbit.co';
        $mail->SMTPAuth   = true;
        $mail->Username   = 'noreply@startbit.co';
        $mail->Password   = 'SB_Pwd_2024';
        $mail->SMTPSecure = 'tls';
        $mail->Port       = 587;

        // Recipients
        $mail->setFrom($from);
        $mail->addAddress($to, $to_name);
        // Check if the second recipient is provided
        if (!empty($another_email)) {
            $mail->addAddress($another_email, $another_name); // Second recipient
        }
        // Add CC recipients
        foreach ($cc as $ccRecipient) {
            $mail->addCC($ccRecipient);
        }

        // Add BCC recipients
        foreach ($bcc as $bccRecipient) {
            $mail->addBCC($bccRecipient);
        }


        if ($reply !== null) {
            $mail->addReplyTo($reply, $reply_name);
        }

        // Attachments
        // foreach ($attachments as $attachment) {
        //     if (isset($attachment['path'])) {
        //         $mail->addAttachment($attachment['path'], isset($attachment['name']) ? $attachment['name'] : '');
        //     }
        // }
        
        // Attachment
        if ($attachment !== null && isset($attachment['path'])) {
            $mail->addAttachment($attachment['path'], isset($attachment['name']) ? $attachment['name'] : '');
        }

        // Content
        $mail->isHTML(true);
        $mail->Subject = $subject;
        $mail->Body    = $body;

        // Send email
      $mail_send = $mail->send();
      if($mail_send){
          return true;
      }else{
           return false;
      }
    } catch (Exception $e) {
        echo "Message could not be sent. Mailer Error: {$mail->ErrorInfo}";
    }
}
 // Example usage
// $to = 'provider.vivacity@gmail.com';
// $from = 'noreply@startbit.co';
// $from_name="Start Bit";
// $subject = 'Here is the subject';
// $body = 'This is the HTML message body <b>in bold!</b>';
// $to_name ='Viva team';
// $cc = ['vivatestteam@gmail.com'];
// // $bcc = ['bcc1@example.com', 'bcc2@example.com'];
// // $reply="info@example.com";
// // $reply_name="Information";
// $vvvv = sendEmail($to, $from, null, $from_name, $subject, $body, array(), $cc, array(), null, null);
// print_r($vvvv);

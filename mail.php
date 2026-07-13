<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;
use PHPMailer\PHPMailer\SMTP;

require __DIR__ . '/PHPMailer/PHPMailer/src/Exception.php';
require __DIR__ . '/PHPMailer/PHPMailer/src/PHPMailer.php';
require __DIR__ . '/PHPMailer/PHPMailer/src/SMTP.php';





$from_name = "Support Team";
$from_address = "noreply@startbit.co";
$to_name = "startbit";
$to_address = "";//
$startTime = "12/28/2023 19:00:00";
$endTime = "12/28/2023 19:30:00";
$subject = "Reminder for event";
$description = "Reminder for event";
$location = "JAIPUR - INDIA";
$domain = 'startbit.co';

// Create Email Headers
//$mime_boundary = "----Meeting Booking----" . md5(time());

// $headers = "From: " . $from_name . " <" . $from_address . ">\n";
// $headers .= "Reply-To: " . $from_name . " <" . $from_address . ">\n";
// $headers .= "MIME-Version: 1.0\n";
// $headers .= "Content-Type: multipart/alternative; boundary=\"$mime_boundary\"\n";
// $headers .= "Content-class: urn:content-classes:calendarmessage\n";

// Create Email Body (HTML)
// $message = "--$mime_boundary\r\n";
// $message .= "Content-Type: text/html; charset=UTF-8\n";
// $message .= "Content-Transfer-Encoding: 8bit\n\n";
$message .= '<html>';
$message .= '<body>';
$message .= '<h2><b>Meeting Time</b></h2>';
$message .= '<b>Start Time: '.$startTime.' IST</b><br/>';
$message .= '<b>End Time: '.$endTime.' IST</b>';
$message .= '</body>';
$message .= '</html>';
// $message .= "--$mime_boundary\r\n";

// Event setting
$ical = 'BEGIN:VCALENDAR' . "\r\n" .
    'PRODID:-//Microsoft Corporation//Outlook 10.0 MIMEDIR//EN' . "\r\n" .
    'VERSION:2.0' . "\r\n" .
    'METHOD:REQUEST' . "\r\n" .
    'BEGIN:VTIMEZONE' . "\r\n" .
    'TZID:Asia/Kolkata' . "\r\n" .
    'BEGIN:STANDARD' . "\r\n" .
    'DTSTART:20091101T020000' . "\r\n" .
    'RRULE:FREQ=YEARLY;INTERVAL=1;BYDAY=1SU;BYMONTH=11' . "\r\n" .
    'TZOFFSETFROM:+0530' . "\r\n" .
    'TZOFFSETTO:+0530' . "\r\n" .
    'TZNAME:IST' . "\r\n" .
    'END:STANDARD' . "\r\n" .
    'END:VTIMEZONE' . "\r\n" .
    'BEGIN:VEVENT' . "\r\n" .
    'ORGANIZER;CN="' . $from_name . '":MAILTO:' . $from_address . "\r\n" .
    'ATTENDEE;CN="' . $to_name . '";ROLE=REQ-PARTICIPANT;RSVP=TRUE:MAILTO:' . $to_address . "\r\n" .
    'LAST-MODIFIED:' . date("Ymd\TGis") . "\r\n" .
    'UID:' . date("Ymd\TGis", strtotime($startTime)) . rand() . "@" . $domain . "\r\n" .
    'DTSTAMP:' . date("Ymd\TGis") . "\r\n" .
    'DTSTART;TZID=Asia/Kolkata:' . date("Ymd\THis", strtotime($startTime)) . "\r\n" .
    'DTEND;TZID=Asia/Kolkata:' . date("Ymd\THis", strtotime($endTime)) . "\r\n" .
    'TRANSP:OPAQUE' . "\r\n" .
    'SEQUENCE:1' . "\r\n" .
    'SUMMARY:' . $subject . "\r\n" .
    'LOCATION:' . $location . "\r\n" .
    'CLASS:PUBLIC' . "\r\n" .
    'PRIORITY:5' . "\r\n" .
    'BEGIN:VALARM' . "\r\n" .
    'TRIGGER:-PT15M' . "\r\n" .
    'ACTION:DISPLAY' . "\r\n" .
    'DESCRIPTION:Reminder' . "\r\n" .
    'END:VALARM' . "\r\n" .
    'END:VEVENT' . "\r\n" .
    'END:VCALENDAR' . "\r\n";
// $message .= 'Content-Type: text/calendar;name="meeting.ics";method=REQUEST' . "\n";
// $message .= "Content-Transfer-Encoding: 8bit\n\n";
// $message .= $ical;

sendEmail($to_address, $from_address, $to_name, $subject, $message,$ical);

function sendEmail($to, $from, $to_name = null, $subject, $body,$ical) {
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
        // if (!empty($another_email)) {
        //     $mail->addAddress($another_email, $another_name); // Second recipient
        // }
        // Add CC recipients
        // foreach ($cc as $ccRecipient) {
        //     $mail->addCC($ccRecipient);
        // }

        // Add BCC recipients
        // foreach ($bcc as $bccRecipient) {
        //     $mail->addBCC($bccRecipient);
        // }


        // if ($reply !== null) {
        //     $mail->addReplyTo($reply, $reply_name);
        // }

        // Custom headers
        // $mail->addCustomHeader('From', $to_name . ' <' . $from . '>');
        // $mail->addCustomHeader('Reply-To', $to_name . ' <' . $from . '>');
        // $mail->addCustomHeader('MIME-Version', '1.0');
        // $mail->addCustomHeader('Content-Type', 'multipart/alternative; boundary="' . $mime_boundary . '"');
        // $mail->addCustomHeader('Content-class', 'urn:content-classes:calendarmessage');

        // Attachments
        // foreach ($attachments as $attachment) {
        //     if (isset($attachment['path'])) {
        //         $mail->addAttachment($attachment['path'], isset($attachment['name']) ? $attachment['name'] : '');
        //     }
        // }
        
        // Attachment
        // if ($attachment !== null && isset($attachment['path'])) {
        //     $mail->addAttachment($attachment['path'], isset($attachment['name']) ? $attachment['name'] : '');
        // }

        // Content
        $mail->isHTML(true);
        $mail->Subject = $subject;
        $mail->Body    = $body;
        $ical = utf8_encode($ical);
        $mail->addStringAttachment($ical, 'meetings.ics', 'base64', 'text/calendar; charset=UTF-8');
        //print_r($body);

        // Send email
      $mail_send = $mail->send();
      if($mail_send){
      	echo "strings";
          return true;
      }else{
           return false;
      }
    } catch (Exception $e) {
        echo "Message could not be sent. Mailer Error: {$mail->ErrorInfo}";
    }
}
?>

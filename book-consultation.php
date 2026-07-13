<?php

require 'mailer.php';



$user_name     = trim($_POST['name'] ?? '');

$user_email    = trim($_POST['email'] ?? '');

$user_mobile   = trim($_POST['phone'] ?? '');

$user_company  = trim($_POST['company'] ?? '');

$user_message  = trim($_POST['message'] ?? '');

$secret = "6Le1zT0tAAAAAPdGdbXkJa1poKbGHuiSbpSVl_A1";

if (empty($_POST['g-recaptcha-response'])) {

    die("Please complete the CAPTCHA.");

}



$response = $_POST['g-recaptcha-response'];



$verify = file_get_contents(

    "https://www.google.com/recaptcha/api/siteverify?secret={$secret}&response={$response}"

);



$result = json_decode($verify);



if (!$result || !$result->success) {

    die("Captcha verification failed.");

}



$user_ip = $_SERVER['REMOTE_ADDR'] ?? '';

$referral_website = $_SERVER['HTTP_REFERER'] ?? '';



$admin_subject = "New Contact request on Startbit website (Contact Form)";



$admin_message = "

<html>

<head>

<title>New Contact Request on Angeltech</title>

</head>

<body>

<p>Hello Admin,</p>



<p>A new consultation request has been submitted on <strong>https://startbitsolutions.com/angeltech</strong>.</p>



<p><strong>Full Name:</strong> {$user_name}</p>

<p><strong>Business Email:</strong> {$user_email}</p>

<p><strong>Phone Number:</strong> {$user_mobile}</p>

<p><strong>Company Name:</strong> {$user_company}</p>

<p><strong>Requirement:</strong> {$user_message}</p>

<p><strong>IP Address:</strong> {$user_ip}</p>

<p><strong>Referral Website:</strong> {$referral_website}</p>



</body>

</html>

";



// For User Email

$user_subject = "Message acknowledged by Team Angeltech";



$message_user = '<html><body>';

$message_user .= '<div style="border-color: #666;border: 1px solid #c5c5c5;padding:5px;">';

$message_user .= '<h3 style="background: #eee;text-align: center;font-size: 15px;font-weight: bold;padding:15px; margin: 0 auto 15px;">Thanks for contacting Angeltech Team</h3>';

$message_user .= '<div style="margin-left:20px;"><div><div style="width:70%;">Dear '.$user_name.',</div>';

$message_user .= '<div style="margin-top:5px;">Greetings from Team Angeltech!</div></div><br/><br/>';

$message_user .= '<div>Thank you for reaching out to us through our contact form. We appreciate your interest and the time you\'ve taken to get in touch with us.<br/></div>';

$message_user .= '<div style="margin-top:15px;">Your message has been received and assure you that we will carefully review the details you provided. Our team of experts will diligently work on addressing your concerns and questions ASAP.<br/></div>';

$message_user .= '<div style="margin-top:15px;">Thank you once again for contacting us. We look forward to connecting with you further and providing the best possible solution to your query.<br/><br/></div>';

$message_user .= '<div style="margin-top:15px;margin-bottom:15px;">Best Regards,<br>';

$message_user .= '<span>Team Angeltech</span><br/>';

// $message_user .= '<span>+91-9314431546</span><br>';

$message_user .= '<span><a href="https://www.angeltechlogistics.com/" style="color: black; text-decoration: none;" target="_blank">https://www.angeltechlogistics.com/</a></span><br/>';

$message_user .= '<span>An ISO 9001 certified company</span></div>';

$message_user .= '</div></body></html>';



// validation



if($user_name == null && $user_name ==''){

    echo 'Please enter your name.';

    return false;

 } else if($user_email == null && $user_email == ''){

    echo 'Please enter your email.';

    return false;

 } else if($user_mobile == null && $user_mobile == ''){

    echo 'Please enter your mobile.';

    return false;

 }else if($user_company == null && $user_company == ''){

    echo 'Please enter your company name.';

    return false;

 } else if( $user_message == null && $user_message =='' ){

    echo 'Please enter message.';

    return false;

 } else {



// admin mail details

$admin_to= "shilpa@startbitsolutions.com";

$admin_to_name = "Startbit Business";

$from = "noreply@startbit.co";

$subject = $admin_subject;

$body = $admin_message;

$admin_bcc = ['shilpa@startbitsolutions.com', 'harshkukreja@startbitsolutions.com','manishasoni@startbitsolutions.com'];

$admin_reply=$user_email;

$admin_reply_name=$user_name;

$another_email = "startbititsolutions@gmail.com";

$another_name = "Team Angeltech";

sendEmail($admin_to, $from, $admin_to_name, $admin_subject, $admin_message, null, array(), $admin_bcc, $admin_reply, $admin_reply_name,$another_email, $another_name);



// mail($admin_email, $admin_subject, $admin_message,$admin_headers);



// user mail details

$user_reply= "business@startbitsolutions.com";

$user_reply_name = "Team Angeltech";

// if(mail($user_email,$user_subject,$message_user,$headers_user)){

if(sendEmail($user_email, $from, null, $user_subject, $message_user, null, array(), array(), $user_reply, $user_reply_name,null,null)){

    echo 'We have received your email, thanks!';

    

} else {

    echo 'Failed! Email not sent. Try again.';

    

}

}

?>


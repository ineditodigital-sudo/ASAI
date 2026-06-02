<?php
header('Content-Type: application/json; charset=utf-8');

// Define destinations
$to_email = 'ventas@asaiint.com'; // Official company email
$subject = 'Nueva Solicitud de Cotizacion - ASAI Internacional';

// Check if request is POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode([
        'status' => 'error',
        'message' => 'Método de solicitud no permitido.'
    ]);
    exit;
}

// 1. Anti-spam Honeypot Check
// If this field contains any value, it was filled by a bot!
if (!empty($_POST['website_url'])) {
    echo json_encode([
        'status' => 'success', // Fake success to trick the spam bot
        'message' => 'Su mensaje se ha procesado exitosamente.'
    ]);
    exit;
}

// 2. Extract and Sanitize Inputs
$name = isset($_POST['name']) ? strip_tags(trim($_POST['name'])) : '';
$company = isset($_POST['company']) ? strip_tags(trim($_POST['company'])) : 'No especificada';
$phone = isset($_POST['phone']) ? strip_tags(trim($_POST['phone'])) : '';
$email = isset($_POST['email']) ? filter_var(trim($_POST['email']), FILTER_SANITIZE_EMAIL) : '';
$location = isset($_POST['location']) ? strip_tags(trim($_POST['location'])) : '';
$message = isset($_POST['message']) ? htmlspecialchars(trim($_POST['message'])) : '';

// 3. Validation
if (empty($name) || empty($phone) || empty($email) || empty($location) || empty($message)) {
    echo json_encode([
        'status' => 'error',
        'message' => 'Por favor, completa todos los campos requeridos (*).'
    ]);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode([
        'status' => 'error',
        'message' => 'La dirección de correo electrónico proporcionada no es válida.'
    ]);
    exit;
}

// 4. Compose Email Body
$email_content = "
<html>
<head>
  <title>Nueva Cotización Recibida - ASAI Internacional</title>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px; }
    .header { background-color: #002f6c; color: #ffffff; padding: 15px 20px; text-align: center; border-radius: 6px 6px 0 0; }
    .header h2 { margin: 0; font-size: 20px; }
    .field-label { font-weight: bold; color: #0f172a; margin-top: 15px; }
    .field-value { background-color: #f8fafc; padding: 10px 15px; border-radius: 4px; border: 1px solid #f1f5f9; margin-bottom: 10px; }
    .footer { text-align: center; font-size: 11px; color: #64748b; margin-top: 30px; border-top: 1px solid #e2e8f0; padding-top: 15px; }
  </style>
</head>
<body>
  <div class='container'>
    <div class='header'>
      <h2>Nueva Solicitud de Cotización</h2>
    </div>
    
    <div class='field-label'>Nombre Completo:</div>
    <div class='field-value'>$name</div>
    
    <div class='field-label'>Empresa:</div>
    <div class='field-value'>$company</div>
    
    <div class='field-label'>Teléfono / WhatsApp:</div>
    <div class='field-value'>$phone</div>
    
    <div class='field-label'>Correo Electrónico:</div>
    <div class='field-value'><a href='mailto:$email'>$email</a></div>
    
    <div class='field-label'>Ciudad y Estado:</div>
    <div class='field-value'>$location</div>
    
    <div class='field-label'>Mensaje / Especificaciones Técnicas:</div>
    <div class='field-value' style='white-space: pre-line;'>$message</div>
    
    <div class='footer'>
      Este correo fue enviado de forma automática desde el formulario de contacto oficial en asaiint.com.<br>
      ASAI Internacional &copy; 2026
    </div>
  </div>
</body>
</html>
";

// 5. Compose Email Headers
$headers = "MIME-Version: 1.0" . "\r\n";
$headers .= "Content-type:text/html;charset=UTF-8" . "\r\n";
$headers .= "From: ASAI Internacional Web <[email protected]>" . "\r\n";
$headers .= "Reply-To: $name <$email>" . "\r\n";

// 6. Send Email
if (mail($to_email, $subject, $email_content, $headers)) {
    echo json_encode([
        'status' => 'success',
        'message' => 'Tu cotización ha sido enviada correctamente al correo oficial. Uno de nuestros ejecutivos técnicos se pondrá en contacto contigo en menos de 1 hora.'
    ]);
} else {
    echo json_encode([
        'status' => 'error',
        'message' => 'El servidor no pudo procesar el envío de correo. Por favor, comunícate directamente vía WhatsApp al 449 813 4627.'
    ]);
}
?>

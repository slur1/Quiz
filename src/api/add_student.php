<?php
include 'db_connection.php';
$input = json_decode(file_get_contents("php://input"), true);

if (
    empty($input['firstName']) ||
    empty($input['lastName']) ||
    empty($input['email']) ||
    empty($input['gender']) ||
    empty($input['section'])
) {
    echo json_encode([
        "status" => "error",
        "message" => "All fields are required."
    ]);
    exit;
}

$firstName = trim($input['firstName']);
$lastName  = trim($input['lastName']);
$email     = trim($input['email']);
$gender    = trim($input['gender']);
$section   = trim($input['section']);

try {
    // Check if email already exists
    $checkQuery = $conn->prepare("SELECT student_id FROM tbl_students WHERE email = ?");
    $checkQuery->execute([$email]);

    if ($checkQuery->rowCount() > 0) {
        echo json_encode([
            "status" => "error",
            "message" => "Email already exists."
        ]);
        exit;
    }

    // Insert new student
    $stmt = $conn->prepare("
        INSERT INTO tbl_students (firstname, lastname, email, gender, section_id)
        VALUES (?, ?, ?, ?, ?)
    ");

    $stmt->execute([$firstName, $lastName, $email, $gender, $section]);

    echo json_encode([
        "status" => "success",
        "message" => "Student added successfully."
    ]);

} catch (Exception $e) {
    echo json_encode([
        "status" => "error",
        "message" => "Database error: " . $e->getMessage()
    ]);
}

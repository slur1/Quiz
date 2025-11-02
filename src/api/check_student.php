<?php
include "db_connection.php";

try {
    $data = json_decode(file_get_contents("php://input"), true);

    if (!isset($data["firstName"], $data["lastName"], $data["email"], $data["section"])) {
        echo json_encode(["status" => "error", "message" => "Missing required fields."]);
        exit;
    }

    $firstName = trim($data["firstName"]);
    $lastName = trim($data["lastName"]);
    $email = trim($data["email"]);
    $section = trim($data["section"]);

    // 1. Check if all match (shortcut instead of 3 separate queries)
    $stmt = $conn->prepare("SELECT * FROM tbl_students 
                            WHERE firstname = :firstname 
                              AND lastname = :lastname 
                              AND email = :email 
                              AND section_id = :section");
    $stmt->bindParam(":firstname", $firstName);
    $stmt->bindParam(":lastname", $lastName);
    $stmt->bindParam(":email", $email);
    $stmt->bindParam(":section", $section);
    $stmt->execute();

    $student = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$student) {
        // More specific validation steps
        $stmt = $conn->prepare("SELECT * FROM tbl_students WHERE firstname = :firstname AND lastname = :lastname");
        $stmt->bindParam(":firstname", $firstName);
        $stmt->bindParam(":lastname", $lastName);
        $stmt->execute();

        if ($stmt->rowCount() === 0) {
            echo json_encode(["status" => "error", "field" => "name", "message" => "Invalid first or last name."]);
            exit;
        }

        $stmt = $conn->prepare("SELECT * FROM tbl_students WHERE firstname = :firstname AND lastname = :lastname AND email = :email");
        $stmt->bindParam(":firstname", $firstName);
        $stmt->bindParam(":lastname", $lastName);
        $stmt->bindParam(":email", $email);
        $stmt->execute();

        if ($stmt->rowCount() === 0) {
            echo json_encode(["status" => "error", "field" => "email", "message" => "Email does not match the student record."]);
            exit;
        }

        echo json_encode(["status" => "error", "field" => "section", "message" => "Incorrect section."]);
        exit;
    }

    // ✅ Everything matches — return student_id too
    echo json_encode([
        "status" => "success",
        "student_id" => $student["student_id"]
    ]);

} catch (PDOException $e) {
    echo json_encode(["status" => "error", "message" => "Database error: " . $e->getMessage()]);
}
?>

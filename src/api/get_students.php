<?php
include "db_connection.php";  

$response = ["status" => "error", "message" => "", "data" => []];

try {
    $stmt = $conn->query("SELECT stud.*, sec.section_name 
    FROM tbl_students stud
    JOIN tbl_sections sec ON stud.section_id = sec.section_id 
    ORDER BY stud.gender DESC, stud.lastname ASC
    ");
    $students = $stmt->fetchAll(PDO::FETCH_ASSOC);

    if ($students && count($students) > 0) {
        $response["status"] = "success";
        $response["data"] = $students;
    } else {
        $response["message"] = "No students found.";
    }
} catch (PDOException $e) {
    $response["message"] = "Database error: " . $e->getMessage();
}

echo json_encode($response);
?>

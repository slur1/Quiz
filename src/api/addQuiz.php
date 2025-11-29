<?php
include 'db_connection.php';

$data = json_decode(file_get_contents("php://input"), true);

$quizNumber = $data["quizNumber"];
$quizTitle = $data["quizTitle"];
$quizDescription = $data["quizDescription"];
$subject_id = $data["subject"];

try {
    $stmt = $conn->prepare("INSERT INTO tbl_quizzes (quiz_no, title, description, subject_id) 
                           VALUES (?, ?, ?, ?)");
    $stmt->execute([$quizNumber, $quizTitle, $quizDescription, $subject_id]);

    echo json_encode(["status" => "success", "message" => "Quiz added successfully"]);
} catch (Exception $e) {
    echo json_encode(["status" => "error", "message" => $e->getMessage()]);
}

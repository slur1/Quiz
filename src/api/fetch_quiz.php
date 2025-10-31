<?php
include "db_connection.php";

try {
    if (!isset($_GET['quiz_id'])) {
        echo json_encode(["status" => "error", "message" => "Missing quiz_id"]);
        exit;
    }
    $quiz_id = intval($_GET['quiz_id']);

    $stmt = $conn->prepare("SELECT * FROM tbl_quizzes WHERE quiz_id = ?");
    $stmt->execute([$quiz_id]);
    $quiz = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($quiz) {
        echo json_encode(["status" => "success", "data" => $quiz]);
    } else {
        echo json_encode(["status" => "error", "message" => "Quiz not found"]);
    }
} catch (PDOException $e) {
    echo json_encode(["status" => "error", "message" => $e->getMessage()]);
}
?>

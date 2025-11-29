<?php
include "db_connection.php";

try {
    $stmt = $conn->prepare("SELECT quiz_id, quiz_no, title, description, subject_id FROM tbl_quizzes ORDER BY quiz_id ASC");
    $stmt->execute();

    $quizzes = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode(["status" => "success", "data" => $quizzes]);
} catch (PDOException $e) {
    echo json_encode(["status" => "error", "message" => $e->getMessage()]);
}
?>

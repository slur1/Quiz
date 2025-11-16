<?php
include "db_connection.php";

$response = ["status" => "error", "message" => ""];

try {
    $stmt = $conn->prepare("SELECT DISTINCT quiz_id FROM tbl_questions");
    $stmt->execute();

    $quiz_ids = $stmt->fetchAll(PDO::FETCH_COLUMN);

    $response['status'] = 'success';
    $response['data'] = $quiz_ids ? $quiz_ids : [];
} 
catch (PDOException $e) {
    $response['status'] = 'error';
    $response['message'] = 'Database error: ' . $e->getMessage();
}

echo json_encode($response);
$conn = null;
?>

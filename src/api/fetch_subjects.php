<?php
include 'db_connection.php';

try {
    $stmt = $conn->prepare("SELECT subject_id, subject_name FROM tbl_subjects ORDER BY subject_name ASC");
    $stmt->execute();

    $subjects = $stmt->fetchAll(PDO::FETCH_ASSOC);

    if ($subjects) {
        echo json_encode(["status" => "success", "data" => $subjects]);
    } else {
        echo json_encode(["status" => "error", "message" => "No subjects found"]);
    }
} catch (PDOException $e) {
    echo json_encode(["status" => "error", "message" => $e->getMessage()]);
}
?>

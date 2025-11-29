<?php
include 'db_connection.php';

$quiz_id = isset($_GET['quiz_id']) ? intval($_GET['quiz_id']) : 0;
$student_id = isset($_GET['student_id']) ? intval($_GET['student_id']) : 0;

if ($quiz_id <= 0 || $student_id <= 0) {
    echo json_encode(["error" => "Invalid quiz or student ID"]);
    exit;
}

try {
    $stmt = $conn->prepare("
        SELECT s.firstname, s.lastname, q.total_score, q.answers
        FROM tbl_quiz_results q
        JOIN tbl_students s ON q.student_id = s.student_id
        WHERE q.quiz_id = ? AND q.student_id = ?
        LIMIT 1
    ");
    $stmt->execute([$quiz_id, $student_id]);
    $student = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$student) {
        echo json_encode(null);
        exit;
    }

    $student['answers'] = json_decode($student['answers'] ?? '[]', true);

    echo json_encode($student);

} catch (PDOException $e) {
    echo json_encode(["error" => $e->getMessage()]);
    exit;
}

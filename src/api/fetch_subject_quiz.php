<?php
include 'db_connection.php';

try {
    $quiz_id = isset($_GET['quiz_id']) ? intval($_GET['quiz_id']) : 0;

    $sql = ("SELECT DISTINCT q.title, q.quiz_no, sub.subject_name
    FROM tbl_quiz_results res
    JOIN tbl_quizzes q ON res.quiz_id = q.quiz_id
    LEFT JOIN tbl_students s ON res.student_id = s.student_id
    JOIN tbl_sections sec ON s.section_id = sec.section_id
    JOIN tbl_subjects sub ON sec.subject_id = sub.subject_id
    WHERE res.quiz_id = :quiz_id");

    $stmt = $conn->prepare($sql);
    $stmt->bindParam(':quiz_id', $quiz_id, PDO::PARAM_INT);
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

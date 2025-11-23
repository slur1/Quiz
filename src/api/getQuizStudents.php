<?php
include 'db_connection.php';

try {
    $quiz_id = isset($_GET['quiz_id']) ? intval($_GET['quiz_id']) : 0;

    $sql = "SELECT res.*, s.firstname, s.lastname, sec.section_name 
            FROM tbl_quiz_results res
            JOIN tbl_students s ON res.student_id = s.student_id
            JOIN tbl_sections sec ON s.section_id = sec.section_id
            WHERE res.quiz_id = :quiz_id";

    $stmt = $conn->prepare($sql);
    $stmt->bindParam(':quiz_id', $quiz_id, PDO::PARAM_INT);
    $stmt->execute();

    $students = $stmt->fetchAll();

    echo json_encode($students);

} catch (PDOException $e) {
    echo json_encode([]);
}

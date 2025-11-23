<?php
header("Content-Type: application/json");
include "db_connection.php";  

$response = ["status" => "error", "data" => []];

$TABLE = "vw_quiz_summary"; 

try {

    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $query = "
        SELECT 
            quiz_id,
            subject_id,
            quiz_no,
            title,
            subject_name,
            section_name,
            section_takers,
            total_takers_all_sections
        FROM $TABLE
        ORDER BY subject_name, quiz_no, section_name
    ";

    $stmt = $conn->prepare($query);
    $stmt->execute();

    $quizSummary = [];

    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {

        $quiz_id = $row["quiz_id"];

        if (!isset($quizSummary[$quiz_id])) {
            $quizSummary[$quiz_id] = [
                "quiz_id" => (int)$row["quiz_id"],
                "quiz_no" => (int)$row["quiz_no"],
                "subject_id" => (int)$row["subject_id"],
                "title" => $row["title"],
                "subject" => $row["subject_name"],
                "total_takers" => (int)$row["total_takers_all_sections"],
                "sections" => []
            ];
        }

        $quizSummary[$quiz_id]["sections"][] = [
            "section_name" => $row["section_name"],
            "takers" => (int)$row["section_takers"]
        ];
    }

    $response["status"] = "success";
    $response["data"] = array_values($quizSummary);

} catch (PDOException $e) {
    $response["status"] = "error";
    $response["message"] = $e->getMessage();
}

echo json_encode($response);
?>

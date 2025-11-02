<?php
include 'db_connection.php'; // make sure this file returns a PDO instance as $conn


try {
    // Decode JSON data from frontend
    $data = json_decode(file_get_contents("php://input"), true);

    if (!$data) {
        throw new Exception("No data received.");
    }

    $student_id = $data['student_id'] ?? null;
    $quiz_id = $data['quiz_id'] ?? null;
    $answers = json_encode($data['answers'] ?? []);
    $total_score = $data['total_score'] ?? 0;
    $total_possible = $data['total_possible'] ?? 0;

    // Validate required fields
    if (!$student_id || !$quiz_id) {
        throw new Exception("Missing required fields: student_id or quiz_id.");
    }

    // Prepare SQL
    $sql = "INSERT INTO tbl_quiz_results 
            (student_id, quiz_id, answers, total_score, total_possible, date_submitted)
            VALUES (:student_id, :quiz_id, :answers, :total_score, :total_possible, NOW())";

    $stmt = $conn->prepare($sql);

    $stmt->bindParam(':student_id', $student_id, PDO::PARAM_INT);
    $stmt->bindParam(':quiz_id', $quiz_id, PDO::PARAM_INT);
    $stmt->bindParam(':answers', $answers, PDO::PARAM_STR);
    $stmt->bindParam(':total_score', $total_score, PDO::PARAM_INT);
    $stmt->bindParam(':total_possible', $total_possible, PDO::PARAM_INT);

    $stmt->execute();

    echo json_encode([
        "status" => "success",
        "message" => "Quiz result saved successfully."
    ]);

} catch (Exception $e) {
    echo json_encode([
        "status" => "error",
        "message" => $e->getMessage()
    ]);
}
?>

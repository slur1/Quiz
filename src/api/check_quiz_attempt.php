<?php
include "db_connection.php"; 

$input = json_decode(file_get_contents("php://input"), true);
$student_id = $input['student_id'] ?? null;
$quiz_id = $input['quiz_id'] ?? null;

$response = [];

if (empty($student_id) || empty($quiz_id)) {
  $response['status'] = 'error';
  $response['message'] = 'Missing parameters.';
  echo json_encode($response);
  exit;
}

try {
  $stmt = $conn->prepare("SELECT * FROM tbl_quiz_results WHERE student_id = :student_id AND quiz_id = :quiz_id");
  $stmt->bindParam(':student_id', $student_id, PDO::PARAM_INT);
  $stmt->bindParam(':quiz_id', $quiz_id, PDO::PARAM_INT);
  $stmt->execute();

  if ($stmt->rowCount() > 0) {
    $response['status'] = 'already_taken';
    $response['message'] = 'You have already taken this quiz.';
  } else {
    $response['status'] = 'not_taken';
    $response['message'] = 'You can take the quiz.';
  }

} catch (PDOException $e) {
  $response['status'] = 'error';
  $response['message'] = 'Database error: ' . $e->getMessage();
}

echo json_encode($response);
?>

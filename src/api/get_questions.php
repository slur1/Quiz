<?php
include "db_connection.php";

header("Content-Type: application/json");

if (!isset($_GET["quiz_id"])) {
  echo json_encode(["status" => "error", "message" => "Missing quiz_id"]);
  exit;
}

$quiz_id = $_GET["quiz_id"];

try {
  $stmt = $conn->prepare("SELECT * FROM tbl_questions WHERE quiz_id = :quiz_id");
  $stmt->execute(["quiz_id" => $quiz_id]);
  $questions = $stmt->fetchAll(PDO::FETCH_ASSOC);

  echo json_encode([
    "status" => "success",
    "data" => $questions
  ]);

} catch (PDOException $e) {
  echo json_encode([
    "status" => "error",
    "message" => $e->getMessage()
  ]);
}
?>

<?php
include "db_connection.php";

$input = json_decode(file_get_contents("php://input"), true);

if (!$input || !isset($input["quiz_no"]) || !isset($input["subject_name"]) || !isset($input["questions"])) {
    echo json_encode(["status" => "error", "message" => "Invalid input data"]);
    exit;
}

$quiz_no = $input["quiz_no"];
$subject_name = $input["subject_name"];
$questions = $input["questions"];

try {
    $conn->beginTransaction();

    $query = "INSERT INTO tbl_questions (
        quiz_no, subject_name, question_type, question_text,
        choice_a, choice_b, choice_c, choice_d, correct_answer, time_limit
    ) VALUES (
        :quiz_no, :subject_name, :question_type, :question_text,
        :choice_a, :choice_b, :choice_c, :choice_d, :correct_answer, :time_limit
    )";

    $stmt = $conn->prepare($query);

    foreach ($questions as $q) {
        $type = $q["questionType"];
        $text = $q["questionText"];
        $correct = $q["correctAnswer"];

        // Default NULLs for all possible fields
        $choiceA = $choiceB = $choiceC = $choiceD = null;

        if ($type === "multiple") {
            $choiceA = $q["choices"][0] ?? null;
            $choiceB = $q["choices"][1] ?? null;
            $choiceC = $q["choices"][2] ?? null;
            $choiceD = $q["choices"][3] ?? null;
        } elseif ($type === "enumeration") {
            // Combine enumeration answers into one string (e.g., comma-separated)
            $correct = implode(", ", $q["enumerationAnswers"]);
        }

        $stmt->execute([
            ":quiz_no" => $quiz_no,
            ":subject_name" => $subject_name,
            ":question_type" => $type,
            ":question_text" => $text,
            ":choice_a" => $choiceA,
            ":choice_b" => $choiceB,
            ":choice_c" => $choiceC,
            ":choice_d" => $choiceD,
            ":correct_answer" => $correct
            ":time_limit" => $q["timeLimit"],
        ]);
    }

    $conn->commit();
    echo json_encode(["status" => "success", "message" => "Questions inserted successfully"]);

} catch (PDOException $e) {
    $conn->rollBack();
    echo json_encode(["status" => "error", "message" => $e->getMessage()]);
}
?>

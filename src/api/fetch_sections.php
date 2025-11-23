<?php
include 'db_connection.php';

try {
    $subject_id = isset($_GET['subject_id']) ? intval($_GET['subject_id']) : 0;

    if ($subject_id) {
        $stmt = $conn->prepare("
            SELECT sec.section_id, sec.subject_id, sec.section_name, sub.subject_name
            FROM tbl_sections sec
            JOIN tbl_subjects sub ON sec.subject_id = sub.subject_id
            WHERE sub.subject_id = :subject_id
            ORDER BY sec.section_name ASC
        ");
        $stmt->execute(['subject_id' => $subject_id]);
    } else {
        $stmt = $conn->query("
            SELECT sec.section_id, sec.subject_id, sec.section_name, sub.subject_name
            FROM tbl_sections sec
            JOIN tbl_subjects sub ON sec.subject_id = sub.subject_id
            ORDER BY sec.subject_id ASC
        ");
    }

    $sections = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        "status" => "success",
        "data" => array_map(function($row) {
            return [
                "id" => $row['section_id'],
                "name" => $row['section_name'],
                "subject_id" => $row['subject_id'],
                "subject_name" => $row['subject_name']
            ];
        }, $sections)
    ]);

} catch (PDOException $e) {
    echo json_encode([
        "status" => "error",
        "message" => "Database error: " . $e->getMessage()
    ]);
    exit;
}
?>

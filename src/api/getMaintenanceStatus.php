<?php
include 'db_connection.php';

try {
    $stmt = $conn->prepare("SELECT maintenance FROM settings WHERE id = 1 LIMIT 1");
    $stmt->execute();
    $row = $stmt->fetch(PDO::FETCH_ASSOC);
        echo json_encode(["maintenance" => (bool)$row['maintenance']]);
} catch (PDOException $e) {
    echo json_encode(["error" => "Database error: " . $e->getMessage()]);
}

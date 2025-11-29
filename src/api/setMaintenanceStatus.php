<?php
include 'db_connection.php';

try {
    $data = json_decode(file_get_contents("php://input"), true);
    if (!isset($data['maintenance'])) {
        throw new Exception("Maintenance value not provided");
    }

    $maintenance = $data['maintenance'] ? 1 : 0;

    $stmt = $conn->prepare("UPDATE settings SET maintenance = :maintenance WHERE id = 1");
    $stmt->execute(['maintenance' => $maintenance]);

    echo json_encode(['success' => true, 'maintenance' => (bool)$maintenance]);
} catch (Exception $e) {
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}

<?php
    echo "<h1>NourProject Stack ON!</h1>";
    echo "<h2>PHP Version: " . phpversion() . "</h2>";
    // Cek apakah ekstensi MySQL (mysqli) sudah aktif
    if (extension_loaded('mysqli')) {
        echo "<p style='color: green;'>✅ MySQLi Extension Active.</p>";
    } else {
        echo "<p style='color: red;'>❌ MySQLi Extension NOT Active.</p>";
    }
?>

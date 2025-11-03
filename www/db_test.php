<?php
/**
 * NourProject Database Connection Test
 * Verifikasi koneksi MySQL dan ekstensi PHP
 */

header('Content-Type: text/html; charset=utf-8');
?>
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>NourProject - Database Test</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
        }
        .container { 
            background: white; 
            border-radius: 20px; 
            padding: 40px; 
            max-width: 800px; 
            width: 100%;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
        }
        h1 { 
            color: #667eea; 
            margin-bottom: 30px; 
            text-align: center;
            font-size: 2.5em;
        }
        .test-item { 
            background: #f8f9fa; 
            padding: 20px; 
            margin: 15px 0; 
            border-radius: 10px;
            border-left: 5px solid #ddd;
        }
        .test-item.success { border-left-color: #28a745; }
        .test-item.error { border-left-color: #dc3545; }
        .status { 
            font-weight: bold; 
            font-size: 1.2em; 
            margin-bottom: 10px;
        }
        .status.success { color: #28a745; }
        .status.error { color: #dc3545; }
        .info { color: #666; font-size: 0.95em; margin-top: 8px; }
        .code { 
            background: #2d3748; 
            color: #48bb78; 
            padding: 15px; 
            border-radius: 8px; 
            font-family: 'Courier New', monospace; 
            margin-top: 10px;
            overflow-x: auto;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🚀 NourProject Test Suite</h1>
        
        <?php
        // Test 1: PHP Version
        echo '<div class="test-item success">';
        echo '<div class="status success">✅ PHP Version</div>';
        echo '<div class="info">Version: <strong>' . phpversion() . '</strong></div>';
        echo '</div>';
        
        // Test 2: MySQLi Extension
        $mysqli_loaded = extension_loaded('mysqli');
        echo '<div class="test-item ' . ($mysqli_loaded ? 'success' : 'error') . '">';
        echo '<div class="status ' . ($mysqli_loaded ? 'success' : 'error') . '">';
        echo $mysqli_loaded ? '✅ MySQLi Extension' : '❌ MySQLi Extension';
        echo '</div>';
        echo '<div class="info">Status: <strong>' . ($mysqli_loaded ? 'Active' : 'Not Active') . '</strong></div>';
        echo '</div>';
        
        // Test 3: PDO Extension
        $pdo_loaded = extension_loaded('pdo_mysql');
        echo '<div class="test-item ' . ($pdo_loaded ? 'success' : 'error') . '">';
        echo '<div class="status ' . ($pdo_loaded ? 'success' : 'error') . '">';
        echo $pdo_loaded ? '✅ PDO MySQL Extension' : '❌ PDO MySQL Extension';
        echo '</div>';
        echo '<div class="info">Status: <strong>' . ($pdo_loaded ? 'Active' : 'Not Active') . '</strong></div>';
        echo '</div>';
        
        // Test 4: Database Connection
        $db_host = getenv('DATABASE_HOST') ?: 'db';
        $db_name = getenv('DATABASE_NAME') ?: 'nour_db';
        $db_user = getenv('DATABASE_USER') ?: 'root';
        $db_pass = getenv('DATABASE_PASSWORD') ?: '041201';
        
        try {
            $conn = new mysqli($db_host, $db_user, $db_pass, $db_name);
            
            if ($conn->connect_error) {
                throw new Exception($conn->connect_error);
            }
            
            echo '<div class="test-item success">';
            echo '<div class="status success">✅ Database Connection</div>';
            echo '<div class="info">Host: <strong>' . $db_host . '</strong></div>';
            echo '<div class="info">Database: <strong>' . $db_name . '</strong></div>';
            echo '<div class="info">Server Version: <strong>' . $conn->server_info . '</strong></div>';
            echo '</div>';
            
            $conn->close();
        } catch (Exception $e) {
            echo '<div class="test-item error">';
            echo '<div class="status error">❌ Database Connection</div>';
            echo '<div class="info">Error: <strong>' . $e->getMessage() . '</strong></div>';
            echo '</div>';
        }
        
        // Test 5: Other Extensions
        $extensions = ['gd', 'zip', 'intl', 'opcache', 'mbstring', 'curl', 'json'];
        $ext_status = [];
        foreach ($extensions as $ext) {
            $ext_status[$ext] = extension_loaded($ext);
        }
        
        echo '<div class="test-item success">';
        echo '<div class="status success">📦 Additional Extensions</div>';
        foreach ($ext_status as $ext => $loaded) {
            $icon = $loaded ? '✅' : '❌';
            echo '<div class="info">' . $icon . ' <strong>' . $ext . '</strong>: ' . ($loaded ? 'Active' : 'Not Active') . '</div>';
        }
        echo '</div>';
        ?>
        
        <div class="test-item success">
            <div class="status success">🎉 NourProject Ready!</div>
            <div class="info">Sistem lebih powerful dari Laragon & XAMPP!</div>
            <div class="info" style="margin-top: 15px;">
                <strong>Quick Links:</strong><br>
                • <a href="http://localhost:8080" target="_blank">Home</a><br>
                • <a href="http://localhost:8081" target="_blank">phpMyAdmin</a>
            </div>
        </div>
    </div>
</body>
</html>
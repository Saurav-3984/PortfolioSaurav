<?php
// Initialize variables
$name = $email = "";
$errors = [];
$success = "";

// When form is submitted
if ($_SERVER["REQUEST_METHOD"] == "POST") {

    // 1. Get form inputs
    $name = trim($_POST["name"]);
    $email = trim($_POST["email"]);
    $password = $_POST["password"];
    $confirm_password = $_POST["confirm_password"];

    // 2. VALIDATION
    if (empty($name)) {
        $errors['name'] = "Name is required";
    }

    if (empty($email)) {
        $errors['email'] = "Email is required";
    } elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $errors['email'] = "Invalid email format";
    }

    if (empty($password)) {
        $errors['password'] = "Password is required";
    } elseif (strlen($password) < 6) {
        $errors['password'] = "Password must be at least 6 characters";
    } elseif (!preg_match('/[@#$%^&*()]/', $password)) {
        $errors['password'] = "Password must contain at least one special character (@,#,$,%)";
    }

    if ($password !== $confirm_password) {
        $errors['confirm_password'] = "Passwords do not match";
    }

    // 3. If no errors → Save user
    if (empty($errors)) {

        $file = "users.json";

        // Create file if it doesn't exist
        if (!file_exists($file)) {
            file_put_contents($file, json_encode([]));
        }

        // Read existing data
        $existingData = json_decode(file_get_contents($file), true);

        if ($existingData === null) {
            $existingData = [];
        }

        // 4. HASH password
        $hashed_password = password_hash($password, PASSWORD_DEFAULT);

        // 5. Create user array
        $newUser = [
            "name" => $name,
            "email" => $email,
            "password" => $hashed_password
        ];

        // 6. Add new user
        $existingData[] = $newUser;

        // 7. Write back to JSON
        if (file_put_contents($file, json_encode($existingData, JSON_PRETTY_PRINT))) {
            $success = "Registration successful!";
            $name = $email = ""; // Clear input
        } else {
            $errors['json'] = "Failed to write to JSON file.";
        }
    }
}
?>

<!DOCTYPE html>
<html>
<head>
    <title>User Registration</title>
    <style>
        body { font-family: Arial; width: 400px; margin: auto; padding-top: 40px; }
        .error { color: red; font-size: 14px; }
        .success { color: green; font-size: 16px; margin-bottom: 15px; }
        .input-box { margin-bottom: 12px; }
        label { display: block; margin-bottom: 5px; }
        input { width: 100%; padding: 8px; border: 1px solid #999; border-radius: 4px; }
        button { background: #0088ff; color: #fff; padding: 10px 15px; border: none; border-radius: 4px; cursor: pointer; }
        button:hover { background: #006ad1; }
    </style>
</head>
<body>

<h2>User Registration Form</h2>

<?php if ($success): ?>
    <div class="success"><?= $success ?></div>
<?php endif; ?>

<form action="" method="POST">

    <div class="input-box">
        <label>Name:</label>
        <input type="text" name="name" value="<?= htmlspecialchars($name) ?>">
        <div class="error"><?= $errors['name'] ?? "" ?></div>
    </div>

    <div class="input-box">
        <label>Email:</label>
        <input type="email" name="email" value="<?= htmlspecialchars($email) ?>">
        <div class="error"><?= $errors['email'] ?? "" ?></div>
    </div>

    <div class="input-box">
        <label>Password:</label>
        <input type="password" name="password">
        <div class="error"><?= $errors['password'] ?? "" ?></div>
    </div>

    <div class="input-box">
        <label>Confirm Password:</label>
        <input type="password" name="confirm_password">
        <div class="error"><?= $errors['confirm_password'] ?? "" ?></div>
    </div>

    <button type="submit">Register</button>

</form>

</body>
</html>

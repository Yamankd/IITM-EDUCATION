# IITM Education - Comprehensive Testing Script
# PowerShell Testing Suite

Write-Host "==================================" -ForegroundColor Cyan
Write-Host "IITM Education - Testing Suite" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan
Write-Host ""

$baseUrl = "http://localhost:5000/api"
$testResults = @()

function Test-Endpoint {
    param(
        [string]$Name,
        [string]$Url,
        [string]$Method = "GET",
        [object]$Body = $null
    )
    
    Write-Host "Testing: $Name" -ForegroundColor Yellow
    
    try {
        $params = @{
            Uri = $Url
            Method = $Method
            UseBasicParsing = $true
        }
        
        if ($Body) {
            $params.Body = ($Body | ConvertTo-Json)
            $params.ContentType = "application/json"
        }
        
        $response = Invoke-WebRequest @params
        
        if ($response.StatusCode -eq 200 -or $response.StatusCode -eq 201) {
            Write-Host "  ✓ PASS - Status: $($response.StatusCode)" -ForegroundColor Green
            $script:testResults += [PSCustomObject]@{
                Test = $Name
                Status = "PASS"
                StatusCode = $response.StatusCode
            }
            return $true
        } else {
            Write-Host "  ✗ FAIL - Status: $($response.StatusCode)" -ForegroundColor Red
            $script:testResults += [PSCustomObject]@{
                Test = $Name
                Status = "FAIL"
                StatusCode = $response.StatusCode
            }
            return $false
        }
    }
    catch {
        Write-Host "  ✗ ERROR - $($_.Exception.Message)" -ForegroundColor Red
        $script:testResults += [PSCustomObject]@{
            Test = $Name
            Status = "ERROR"
            StatusCode = "N/A"
        }
        return $false
    }
}

Write-Host "`n[1] BACKEND API TESTS" -ForegroundColor Magenta
Write-Host "=====================`n" -ForegroundColor Magenta

# Test 1: Server Health
Write-Host "1.1 Server Connectivity" -ForegroundColor Cyan
Test-Endpoint -Name "Server Health Check" -Url "$baseUrl/courses"

# Test 2: Course Endpoints
Write-Host "`n1.2 Course Endpoints" -ForegroundColor Cyan
Test-Endpoint -Name "Get All Courses" -Url "$baseUrl/courses"

# Test 3: Student Endpoints
Write-Host "`n1.3 Student Endpoints" -ForegroundColor Cyan
Test-Endpoint -Name "Get All Students (requires auth)" -Url "$baseUrl/students"

# Test 4: Exam Endpoints
Write-Host "`n1.4 Exam Endpoints" -ForegroundColor Cyan
Test-Endpoint -Name "Get All Exams (requires auth)" -Url "$baseUrl/exams"

# Test 5: Lead Endpoints
Write-Host "`n1.5 Lead Endpoints" -ForegroundColor Cyan
Test-Endpoint -Name "Get All Leads (requires auth)" -Url "$baseUrl/leads"

# Test 6: Instructor Endpoints
Write-Host "`n1.6 Instructor Endpoints" -ForegroundColor Cyan
Test-Endpoint -Name "Get All Instructors" -Url "$baseUrl/instructors"

Write-Host "`n`n[2] FRONTEND TESTS" -ForegroundColor Magenta
Write-Host "==================`n" -ForegroundColor Magenta

# Test Frontend Server
Write-Host "2.1 Frontend Server" -ForegroundColor Cyan
try {
    $frontendResponse = Invoke-WebRequest -Uri "http://localhost:5173" -Method GET -UseBasicParsing
    if ($frontendResponse.StatusCode -eq 200) {
        Write-Host "  ✓ PASS - Frontend server is running" -ForegroundColor Green
        $script:testResults += [PSCustomObject]@{
            Test = "Frontend Server"
            Status = "PASS"
            StatusCode = 200
        }
    }
}
catch {
    Write-Host "  ✗ FAIL - Frontend server not accessible" -ForegroundColor Red
    $script:testResults += [PSCustomObject]@{
        Test = "Frontend Server"
        Status = "FAIL"
        StatusCode = "N/A"
    }
}

Write-Host "`n`n[3] DATABASE TESTS" -ForegroundColor Magenta
Write-Host "==================`n" -ForegroundColor Magenta

Write-Host "3.1 Database Connection" -ForegroundColor Cyan
Write-Host "  ℹ Check server console for MongoDB connection status" -ForegroundColor Yellow

Write-Host "`n`n[4] SUMMARY" -ForegroundColor Magenta
Write-Host "==========`n" -ForegroundColor Magenta

$passCount = ($testResults | Where-Object { $_.Status -eq "PASS" }).Count
$failCount = ($testResults | Where-Object { $_.Status -eq "FAIL" }).Count
$errorCount = ($testResults | Where-Object { $_.Status -eq "ERROR" }).Count
$totalTests = $testResults.Count

Write-Host "Total Tests: $totalTests" -ForegroundColor White
Write-Host "Passed: $passCount" -ForegroundColor Green
Write-Host "Failed: $failCount" -ForegroundColor Red
Write-Host "Errors: $errorCount" -ForegroundColor Yellow

$passRate = if ($totalTests -gt 0) { [math]::Round(($passCount / $totalTests) * 100, 2) } else { 0 }
Write-Host "`nPass Rate: $passRate%" -ForegroundColor $(if ($passRate -ge 80) { "Green" } elseif ($passRate -ge 50) { "Yellow" } else { "Red" })

Write-Host "`n`nDetailed Results:" -ForegroundColor Cyan
$testResults | Format-Table -AutoSize

Write-Host "`n==================================" -ForegroundColor Cyan
Write-Host "Testing Complete!" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan

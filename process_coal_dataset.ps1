$excelFile = 'c:\Users\ronty\Downloads\archive\Indian Coal Mines Dataset_January 2021-1.xlsx'
$outputFile = 'c:\Users\ronty\SIH26\src\data\realMinesData.json'

# Open Excel
$excel = New-Object -ComObject Excel.Application
$excel.Visible = $false
$workbook = $excel.Workbooks.Open($excelFile)
$worksheet = $workbook.ActiveSheet

$rows = $worksheet.UsedRange.Rows.Count
$cols = $worksheet.UsedRange.Columns.Count

Write-Host "Reading dataset: $rows rows, $cols columns"

# Extract headers
$headers = @()
for ($i = 1; $i -le $cols; $i++) {
    $headers += $worksheet.Cells(1, $i).Value2
}

Write-Host "Headers: $($headers -join ', ')"

# Function to get mine type
function Get-MineType {
    param($typeStr)
    if ($typeStr -like "*UG*") { return "UNDERGROUND" }
    elseif ($typeStr -like "*MIXED*") { return "MIXED" }
    else { return "OPENCAST" }
}

# Function to get subsidiary
function Get-Subsidiary {
    param($ownerName)
    if ($ownerName -like "*ECL*" -or $ownerName -like "*Eastern*") { return "ECL" }
    elseif ($ownerName -like "*BCCL*" -or $ownerName -like "*Bharat*") { return "BCCL" }
    elseif ($ownerName -like "*CCL*" -or $ownerName -like "*Central*") { return "CCL" }
    elseif ($ownerName -like "*WCL*" -or $ownerName -like "*Western*") { return "WCL" }
    elseif ($ownerName -like "*SECL*" -or $ownerName -like "*South*") { return "SECL" }
    elseif ($ownerName -like "*MCL*" -or $ownerName -like "*Mahanadi*") { return "MCL" }
    elseif ($ownerName -like "*NCL*" -or $ownerName -like "*North*") { return "NCL" }
    else { return "CIL_HQ" }
}

# Extract data
$mines = @()
$stateCount = @{}

for ($r = 2; $r -le [Math]::Min($rows, 500); $r++) {
    $mineId = $worksheet.Cells($r, 1).Value2
    $state = $worksheet.Cells($r, 2).Value2
    $district = $worksheet.Cells($r, 3).Value2
    $mineName = $worksheet.Cells($r, 4).Value2
    $production = $worksheet.Cells($r, 5).Value2
    $ownerName = $worksheet.Cells($r, 6).Value2
    $coalType = $worksheet.Cells($r, 8).Value2
    $ownership = $worksheet.Cells($r, 9).Value2
    $mineType = $worksheet.Cells($r, 10).Value2
    $latitude = $worksheet.Cells($r, 11).Value2
    $longitude = $worksheet.Cells($r, 12).Value2
    $source = $worksheet.Cells($r, 13).Value2
    $accuracy = $worksheet.Cells($r, 14).Value2
    
    # Skip empty rows
    if ([string]::IsNullOrWhiteSpace($mineName)) { continue }
    
    # Count states
    if ($stateCount.ContainsKey($state)) {
        $stateCount[$state] += 1
    } else {
        $stateCount[$state] = 1
    }
    
    $prod = if ([string]::IsNullOrWhiteSpace($production) -or $production -eq 0) { 0 } else { $production }
    $lat = if ([string]::IsNullOrWhiteSpace($latitude)) { 0 } else { [float]$latitude }
    $lng = if ([string]::IsNullOrWhiteSpace($longitude)) { 0 } else { [float]$longitude }
    
    $mine = @{
        id = "real-mine-$('{0:0000}' -f $r)"
        name = [string]$mineName
        code = "$mineId"
        subsidiary = Get-Subsidiary -ownerName $ownerName
        state = [string]$state
        district = [string]$district
        type = Get-MineType -typeStr $mineType
        coordinates = @{
            lat = $lat
            lng = $lng
        }
        productionCapacityMTPA = $prod * 1.2
        currentProductionMT = $prod
        coalType = if ([string]::IsNullOrWhiteSpace($coalType)) { "Coal" } else { [string]$coalType }
        ownership = if ([string]::IsNullOrWhiteSpace($ownership)) { "Unknown" } else { [string]$ownership }
        source = if ([string]::IsNullOrWhiteSpace($source)) { "Dataset" } else { [string]$source }
        accuracy = if ([string]::IsNullOrWhiteSpace($accuracy)) { "Approximate" } else { [string]$accuracy }
    }
    
    $mines += $mine
}

$excel.Quit()
[System.Runtime.InteropServices.Marshal]::ReleaseComObject($excel)

Write-Host "Processed $($mines.Count) mines"
Write-Host "States found: $($stateCount.Count)"

# Create metadata
$metadata = @{
    source = "Indian Coal Mines Dataset - January 2021"
    totalMines = $mines.Count
    minesByState = $stateCount
    dataCollectionDate = "January 2021"
    lastUpdated = (Get-Date).ToString("o")
}

# Create output object
$output = @{
    metadata = $metadata
    mines = $mines
}

# Convert to JSON and save
$json = $output | ConvertTo-Json -Depth 10
$json | Out-File -FilePath $outputFile -Encoding UTF8

Write-Host "`n✓ JSON file saved to: $outputFile"
Write-Host "✓ Total records: $($mines.Count)"
Write-Host "✓ File size: $(Get-Item $outputFile).Length bytes"
Write-Host "Sample data (first 3 mines):"
$mines | Select-Object -First 3 | Format-Table name, state, district, type, currentProductionMT

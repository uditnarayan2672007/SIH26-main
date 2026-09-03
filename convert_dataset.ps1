$excelFile = 'c:\Users\ronty\Downloads\archive\Indian Coal Mines Dataset_January 2021-1.xlsx'
$outputFile = 'c:\Users\ronty\SIH26\src\data\realMinesData.json'

$excel = New-Object -ComObject Excel.Application
$excel.Visible = $false
$workbook = $excel.Workbooks.Open($excelFile)
$worksheet = $workbook.ActiveSheet

$rows = $worksheet.UsedRange.Rows.Count
$cols = $worksheet.UsedRange.Columns.Count

Write-Host "Reading dataset: $rows rows"

function Get-MineType {
    param($typeStr)
    if ($typeStr -like "*UG*") { return "UNDERGROUND" }
    elseif ($typeStr -like "*MIXED*") { return "MIXED" }
    else { return "OPENCAST" }
}

function Get-Subsidiary {
    param($ownerName)
    if ($ownerName -like "*ECL*") { return "ECL" }
    elseif ($ownerName -like "*BCCL*") { return "BCCL" }
    elseif ($ownerName -like "*CCL*") { return "CCL" }
    elseif ($ownerName -like "*WCL*") { return "WCL" }
    elseif ($ownerName -like "*SECL*") { return "SECL" }
    elseif ($ownerName -like "*MCL*") { return "MCL" }
    elseif ($ownerName -like "*NCL*") { return "NCL" }
    else { return "CIL_HQ" }
}

$mines = @()
$stateCount = @{}

for ($r = 2; $r -le [Math]::Min($rows, 500); $r++) {
    $mineName = $worksheet.Cells($r, 4).Value2
    if ([string]::IsNullOrWhiteSpace($mineName)) { continue }
    
    $mineId = $worksheet.Cells($r, 1).Value2
    $state = $worksheet.Cells($r, 2).Value2
    $district = $worksheet.Cells($r, 3).Value2
    $production = $worksheet.Cells($r, 5).Value2
    $ownerName = $worksheet.Cells($r, 6).Value2
    $coalType = $worksheet.Cells($r, 8).Value2
    $ownership = $worksheet.Cells($r, 9).Value2
    $mineType = $worksheet.Cells($r, 10).Value2
    $latitude = $worksheet.Cells($r, 11).Value2
    $longitude = $worksheet.Cells($r, 12).Value2
    
    if ($stateCount.ContainsKey($state)) {
        $stateCount[$state] += 1
    } else {
        $stateCount[$state] = 1
    }
    
    $prod = if ($production -eq 0 -or [string]::IsNullOrWhiteSpace($production)) { 0 } else { $production }
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
        productionCapacityMTPA = [double]($prod * 1.2)
        currentProductionMT = [double]$prod
        coalType = if ([string]::IsNullOrWhiteSpace($coalType)) { "Coal" } else { [string]$coalType }
        ownership = if ([string]::IsNullOrWhiteSpace($ownership)) { "Unknown" } else { [string]$ownership }
    }
    
    $mines += $mine
}

$excel.Quit()
[System.Runtime.InteropServices.Marshal]::ReleaseComObject($excel)

Write-Host "Processed $($mines.Count) mines from $($stateCount.Count) states"

$metadata = @{
    source = "Indian Coal Mines Dataset - January 2021"
    totalMines = $mines.Count
    minesByState = $stateCount
    lastUpdated = (Get-Date).ToString("o")
}

$output = @{
    metadata = $metadata
    mines = $mines
}

$json = $output | ConvertTo-Json -Depth 10
$json | Out-File -FilePath $outputFile -Encoding UTF8 -Force

Write-Host "JSON file saved to: $outputFile"
Write-Host "Total records: $($mines.Count)"

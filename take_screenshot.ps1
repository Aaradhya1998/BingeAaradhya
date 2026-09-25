param(
    [string]$Url = "http://localhost:3000",
    [string]$OutputFile = "C:\Users\lenovo\.gemini\antigravity-ide\brain\7df9e2ed-1909-4590-9867-720434ccc60e\preview.png",
    [int]$Width = 1280,
    [int]$Height = 900
)

$edgePath = "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
$tempShot = "C:\Users\lenovo\AppData\Local\Temp\edge_screen.png"
$userDir = "C:\Users\lenovo\AppData\Local\Temp\edge_profile_" + (Get-Random)

if (Test-Path $tempShot) {
    Remove-Item $tempShot -Force -ErrorAction SilentlyContinue
}

$args = @(
    "--headless=new",
    "--no-sandbox",
    "--disable-gpu",
    "--user-data-dir=$userDir",
    "--window-size=$Width,$Height",
    "--screenshot=$tempShot",
    $Url
)

$proc = Start-Process -FilePath $edgePath -ArgumentList $args -PassThru
$exited = $proc.WaitForExit(12000)

if (-not $exited) {
    try { Stop-Process -Id $proc.Id -Force -ErrorAction SilentlyContinue } catch {}
}

Start-Sleep -Milliseconds 500

if (Test-Path $tempShot) {
    Copy-Item $tempShot $OutputFile -Force
    Write-Host "Screenshot saved to $OutputFile"
    exit 0
} else {
    Write-Host "Failed to generate screenshot"
    exit 1
}

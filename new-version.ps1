# Создать новую версию: .\new-version.ps1 "описание изменений"
param([string]$msg)

if (-not $msg) {
  Write-Host "Укажи описание: .\new-version.ps1 `"что сделано`""
  exit 1
}

# Последний тег
$last = git tag --list 'v*' | Select-Object -Last 1
if (-not $last) { $last = "v0.0.0.0" }

# Разобрать номер
$parts = $last -replace 'v','' -split '\.'
$newVer = "v{0}.{1}.{2}.{3}" -f $parts[0], $parts[1], $parts[2], ([int]$parts[3] + 1)

git add -A
git commit -m $msg
git tag $newVer

# Копировать в stable
$src = Split-Path -Parent (Resolve-Path ".\")
$stable = $src + " stable"
if (Test-Path $stable) {
  Remove-Item "$stable\*" -Recurse -Force -ErrorAction SilentlyContinue
  Copy-Item "$src\*" $stable -Recurse -Force
  $stableGit = Join-Path $stable ".git"
  if (Test-Path $stableGit) { Remove-Item $stableGit -Recurse -Force }
}

Write-Host "  $newVer — $msg"
Write-Host "Стабильная копия обновлена."

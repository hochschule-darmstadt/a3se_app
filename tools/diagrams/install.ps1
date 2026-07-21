[CmdletBinding()]
param()

$ErrorActionPreference = 'Stop'
$repoRoot = (Resolve-Path (Join-Path $PSScriptRoot '../..')).Path
$versions = Get-Content -Raw (Join-Path $PSScriptRoot 'versions.json') | ConvertFrom-Json
$toolDir = Join-Path $repoRoot '.diagram-tools'
$plantUmlJar = Join-Path $toolDir 'plantuml.jar'

if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
    throw 'Node.js 22 is required. Install it, then run this script again.'
}
if (-not ((node --version) -match '^v22\.')) {
    throw "Node.js 22 is required; found $(node --version)."
}
if (-not (Get-Command java -ErrorAction SilentlyContinue)) {
    throw 'Java 17 or newer is required for PlantUML.'
}

Push-Location $repoRoot
try {
    npm ci
    if ($LASTEXITCODE -ne 0) { throw 'npm ci failed.' }
    New-Item -ItemType Directory -Force $toolDir | Out-Null
    if (-not (Test-Path $plantUmlJar)) {
        Invoke-WebRequest -Uri $versions.plantuml.url -OutFile $plantUmlJar
    }
    $actualHash = (Get-FileHash -Algorithm SHA256 $plantUmlJar).Hash.ToLowerInvariant()
    if ($actualHash -ne $versions.plantuml.sha256) {
        Remove-Item -LiteralPath $plantUmlJar -Force
        throw "PlantUML checksum mismatch: $actualHash"
    }
    if (Get-Command docker -ErrorAction SilentlyContinue) {
        docker pull $versions.structurizrImage
        if ($LASTEXITCODE -ne 0) { throw 'Unable to pull the pinned Structurizr image.' }
    } else {
        Write-Warning 'Docker is unavailable; Structurizr rendering will not work.'
    }
    npm run diagrams:doctor
    if ($LASTEXITCODE -ne 0) { throw 'Diagram toolchain health check failed.' }
} finally {
    Pop-Location
}

# Udyam Manch - Netlify Production Zip Builder
Write-Host "Packaging Udyam Manch for Netlify Deploy..." -ForegroundColor Cyan

$dist = "dist"
$zip = "udyammanch-netlify.zip"

if (Test-Path $dist) { Remove-Item -Recurse -Force $dist }
if (Test-Path $zip) { Remove-Item -Force $zip }

New-Item -ItemType Directory -Path $dist | Out-Null
New-Item -ItemType Directory -Path "$dist\assets" | Out-Null
New-Item -ItemType Directory -Path "$dist\founders" | Out-Null

Copy-Item index.html $dist\
Copy-Item -Recurse assets\* "$dist\assets\"
Copy-Item -Recurse founders\* "$dist\founders\"

# Write _redirects strictly as UTF-8 without BOM (Netlify requires NO BOM)
$redirectsContent = @"
/founders/kishan-panchal-farming-solutions-india/   /founders/kishan-panchal-farming-solutions-india/index.html   200
/founders/kishan-panchal-farming-solutions-india    /founders/kishan-panchal-farming-solutions-india/index.html   200
/stories/kishan-panchal-farming-solutions-india/    /founders/kishan-panchal-farming-solutions-india/index.html   200
/stories/kishan-panchal-farming-solutions-india     /founders/kishan-panchal-farming-solutions-india/index.html   200
/*                                                  /index.html                                                   200
"@

$headersContent = @"
/*
  X-Frame-Options: SAMEORIGIN
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin

/assets/*
  Cache-Control: public, max-age=31536000, immutable
"@

$utf8NoBom = New-Object System.Text.UTF8Encoding($false)
[System.IO.File]::WriteAllText("$dist\_redirects", $redirectsContent, $utf8NoBom)
[System.IO.File]::WriteAllText("$dist\_headers", $headersContent, $utf8NoBom)

# Compress dist contents directly to the root of the zip archive
Compress-Archive -Path "$dist\*" -DestinationPath $zip -Force

$fileSizeMb = [math]::Round((Get-Item $zip).Length / 1MB, 2)
Write-Host "Successfully generated $zip ($fileSizeMb MB)" -ForegroundColor Green
Write-Host "Ready for drag & drop deployment at: https://app.netlify.com/drop" -ForegroundColor Yellow

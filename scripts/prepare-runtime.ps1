$ErrorActionPreference = 'Stop'
$projectRoot = Split-Path $PSScriptRoot -Parent
Push-Location $projectRoot
try {
    New-Item -ItemType Directory -Force '.cache/tools', '.cache/runtime-inputs' | Out-Null
    $java = if ($env:JAVA_HOME) { Join-Path $env:JAVA_HOME 'bin/java.exe' } else { (Get-Command java).Source }
    if (-not (Test-Path '.cache/tools/apktool.jar')) {
        Invoke-WebRequest 'https://github.com/iBotPeaches/Apktool/releases/download/v3.0.3/apktool_3.0.3.jar' -OutFile '.cache/tools/apktool.jar'
    }
    $dexTool = '.cache/tools/dex2jar/dex-tools-v2.4/d2j-dex2jar.bat'
    if (-not (Test-Path $dexTool)) {
        Invoke-WebRequest 'https://github.com/pxb1988/dex2jar/releases/download/v2.4/dex-tools-v2.4.zip' -OutFile '.cache/tools/dex2jar.zip'
        Expand-Archive '.cache/tools/dex2jar.zip' '.cache/tools/dex2jar' -Force
    }
    if (-not (Test-Path '.cache/runtime-inputs/classes.jar')) {
        Add-Type -AssemblyName System.IO.Compression.FileSystem
        $archive = [System.IO.Compression.ZipFile]::OpenRead((Join-Path $projectRoot 'app-arm64-v8a-release.apk'))
        try {
            [System.IO.Compression.ZipFileExtensions]::ExtractToFile($archive.GetEntry('classes.dex'), (Join-Path $projectRoot '.cache/runtime-inputs/classes.dex'), $true)
        } finally { $archive.Dispose() }
        & $dexTool -f -o '.cache/runtime-inputs/classes.jar' '.cache/runtime-inputs/classes.dex'
        if ($LASTEXITCODE -ne 0) { throw '兼容运行库准备失败。' }
    }
    if (-not (Test-Path '.cache/runtime-inputs/resources/res/values/public.xml')) {
        & $java -jar '.cache/tools/apktool.jar' d -s -o '.cache/runtime-inputs/resources' 'app-arm64-v8a-release.apk'
        if ($LASTEXITCODE -ne 0) { throw '资源准备失败。' }
    }
    & node scripts/prepare-runtime.cjs
    if ($LASTEXITCODE -ne 0) { throw '运行库打包失败。' }
    & "$PSScriptRoot/prepare-resources.ps1"
} finally { Pop-Location }

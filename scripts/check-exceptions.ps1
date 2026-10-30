$ErrorActionPreference = 'Stop'
$projectRoot = Split-Path $PSScriptRoot -Parent
$runtime = Join-Path $projectRoot '.recovery/runtime/legacy-runtime.jar'
$classes = Join-Path $projectRoot '.recovery/validation/exception-classes'
New-Item -ItemType Directory -Force $classes | Out-Null
& javac -encoding UTF-8 -cp $runtime -d $classes "$projectRoot/android/app/src/main/java/d/e/m/z0/a.java" "$PSScriptRoot/validation/ExceptionFormatterCheck.java"
if ($LASTEXITCODE -ne 0) { throw '异常格式检查编译失败。' }
& java '-Dfile.encoding=UTF-8' -cp "$classes;$runtime" ExceptionFormatterCheck
if ($LASTEXITCODE -ne 0) { throw '异常格式检查失败。' }

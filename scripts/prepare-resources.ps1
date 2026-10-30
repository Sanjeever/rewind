$ErrorActionPreference = 'Stop'
$projectRoot = Split-Path $PSScriptRoot -Parent
$source = Join-Path $projectRoot '.recovery/decompiled/resources/res'
$destination = Join-Path $projectRoot '.recovery/runtime/res'
if (-not (Test-Path -LiteralPath (Join-Path $source 'values/public.xml'))) {
    throw '缺少资源输入，请先按 README 准备本地运行库。'
}
$expected = [System.IO.Path]::GetFullPath((Join-Path $projectRoot '.recovery/runtime/res'))
if ([System.IO.Path]::GetFullPath($destination) -ne $expected) { throw '资源输出目录不匹配。' }
if (Test-Path -LiteralPath $destination) { Remove-Item -LiteralPath $destination -Recurse -Force }
Copy-Item -LiteralPath $source -Destination $destination -Recurse
$renames = @{}
foreach ($file in Get-ChildItem -LiteralPath $destination -Recurse -File -Filter '$*.xml') {
    $oldName = $file.BaseName
    $newName = 'generated_' + $oldName.Substring(1)
    $renames[$oldName] = $newName
    Rename-Item -LiteralPath $file.FullName -NewName ($newName + '.xml')
}
$changed = 0
foreach ($file in Get-ChildItem -LiteralPath $destination -Recurse -File -Filter '*.xml') {
    $document = [System.Xml.XmlDocument]::new()
    $document.PreserveWhitespace = $true
    $document.Load($file.FullName)
    $modified = $false
    foreach ($attribute in $document.SelectNodes('//@*')) {
        $value = $attribute.Value
        foreach ($oldName in $renames.Keys) {
            $value = $value.Replace(('@drawable/' + $oldName), ('@drawable/' + $renames[$oldName]))
            if ($attribute.OwnerElement.LocalName -eq 'public' -and $attribute.Name -eq 'name' -and $value -eq $oldName) { $value = $renames[$oldName] }
        }
        if ($value -ne $attribute.Value) { $attribute.Value = $value; $modified = $true }
    }
    if ($modified) { $document.Save($file.FullName); $changed++ }
}
$ownedRoot = Join-Path $projectRoot 'android/app/src/main/res'
$ownedValues = @{}
foreach ($file in Get-ChildItem -LiteralPath $ownedRoot -Recurse -File) {
    $relative = [System.IO.Path]::GetRelativePath($ownedRoot,$file.FullName)
    if ($file.Directory.Name -like 'values*') {
        [xml]$ownedXml = Get-Content -LiteralPath $file.FullName -Raw
        foreach ($node in $ownedXml.SelectNodes('/resources/*[@name]')) {
            $key = $file.Directory.Name + '|' + $node.LocalName + '|' + $node.GetAttribute('name')
            $ownedValues[$key] = $true
        }
    } else {
        $duplicate = Join-Path $destination $relative
        if (Test-Path -LiteralPath $duplicate) { Remove-Item -LiteralPath $duplicate }
    }
}
foreach ($file in Get-ChildItem -LiteralPath $destination -Recurse -File -Filter '*.xml' | Where-Object { $_.Directory.Name -like 'values*' }) {
    $document = [System.Xml.XmlDocument]::new()
    $document.PreserveWhitespace = $true
    $document.Load($file.FullName)
    $modified = $false
    foreach ($node in @($document.SelectNodes('/resources/*[@name]'))) {
        $key = $file.Directory.Name + '|' + $node.LocalName + '|' + $node.GetAttribute('name')
        if ($node.LocalName -ne 'public' -and $ownedValues.ContainsKey($key)) {
            $node.ParentNode.RemoveChild($node) | Out-Null
            $modified = $true
        }
    }
    if ($modified) { $document.Save($file.FullName) }
}
Write-Output "已规范化 $($renames.Count) 个资源名称，更新 $changed 份 XML，并排除源码目录已维护的应用资源。"

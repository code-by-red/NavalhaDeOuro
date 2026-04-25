# Simple HTTP Server for PowerShell
$port = 8090
$directory = Get-Location

function Get-MimeType {
    param([string]$Path)
    $extension = [System.IO.Path]::GetExtension($Path).ToLower()
    switch ($extension) {
        ".html" { return "text/html" }
        ".css" { return "text/css" }
        ".js" { return "application/javascript" }
        ".json" { return "application/json" }
        ".png" { return "image/png" }
        ".jpg" { return "image/jpeg" }
        ".gif" { return "image/gif" }
        ".svg" { return "image/svg+xml" }
        default { return "application/octet-stream" }
    }
}

$httpListener = New-Object System.Net.HttpListener
$httpListener.Prefixes.Add("http://localhost:$port/")
$httpListener.Start()

Write-Host "Servidor iniciado em http://localhost:$port"
Write-Host "Servindo arquivos de: $directory"
Write-Host "Pressione Ctrl+C para parar"

try {
    while ($httpListener.IsListening) {
        $context = $httpListener.GetContext()
        $request = $context.Request
        $response = $context.Response
        
        $url = $request.Url.LocalPath
        $filePath = Join-Path $directory ($url.Substring(1))
        
        if ([string]::IsNullOrEmpty($url) -or $url -eq "/") {
            $filePath = Join-Path $directory "index.html"
        }
        
        if (Test-Path $filePath -PathType Leaf) {
            $content = [System.IO.File]::ReadAllBytes($filePath)
            $response.ContentType = Get-MimeType -Path $filePath
            $response.ContentLength64 = $content.Length
            $response.OutputStream.Write($content, 0, $content.Length)
        } else {
            $response.StatusCode = 404
            $response.StatusDescription = "Not Found"
            $content = [System.Text.Encoding]::UTF8.GetBytes("<h1>404 - Not Found</h1>")
            $response.ContentType = "text/html"
            $response.ContentLength64 = $content.Length
            $response.OutputStream.Write($content, 0, $content.Length)
        }
        
        $response.Close()
    }
}
finally {
    $httpListener.Stop()
    Write-Host "Servidor parado"
}

Add-Type -AssemblyName System.Drawing
function Resize-ToJpeg($src, $dst, $w) {
  $i = [System.Drawing.Image]::FromFile((Resolve-Path $src))
  $h = [int]($i.Height * $w / $i.Width)
  $b = New-Object System.Drawing.Bitmap($w, $h)
  $g = [System.Drawing.Graphics]::FromImage($b)
  $g.InterpolationMode = 'HighQualityBicubic'
  $g.DrawImage($i, 0, 0, $w, $h)
  $c = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq 'image/jpeg' }
  $p = New-Object System.Drawing.Imaging.EncoderParameters(1)
  $p.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter([System.Drawing.Imaging.Encoder]::Quality, 86L)
  $b.Save((Join-Path (Get-Location) $dst), $c, $p)
  $g.Dispose(); $b.Dispose(); $i.Dispose()
}
Resize-ToJpeg 'public/art/worlds-src.png' 'public/art/worlds.jpg' 1500
Resize-ToJpeg 'public/art/studio-src.png' 'public/art/studio.jpg' 1200
Resize-ToJpeg 'public/art/hq-src.png' 'public/art/hq.jpg' 1200

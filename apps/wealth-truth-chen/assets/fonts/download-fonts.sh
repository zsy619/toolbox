#!/bin/bash

# 字体文件URL列表
font_urls=(
  "https://fonts.gstatic.com/s/inter/v20/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuLyfMZg.ttf"
  "https://fonts.gstatic.com/s/inter/v20/UcCO3FwrK3iLTeHuS_nVMrMxCp50qjIw2boKoduKmMEVuLyfMZg.ttf"
  "https://fonts.gstatic.com/s/inter/v20/UcCO3FwrK3iLTeHuS_nVMrMxCp50ojIw2boKoduKmMEVuLyfMZg.ttf"
  "https://fonts.gstatic.com/s/inter/v20/UcCO3FwrK3iLTeHuS_nVMrMxCp50ujIw2boKoduKmMEVuLyfMZg.ttf"
  "https://fonts.gstatic.com/s/inter/v20/UcCO3FwrK3iLTeHuS_nVMrMxCp50ijIw2boKoduKmMEVuLyfMZg.ttf"
  "https://fonts.gstatic.com/s/inter/v20/UcCO3FwrK3iLTeHuS_nVMrMxCp506jIw2boKoduKmMEVuLyfMZg.ttf"
  "https://fonts.gstatic.com/s/inter/v20/UcCO3FwrK3iLTeHuS_nVMrMxCp50yjIw2boKoduKmMEVuLyfMZg.ttf"
)

# 下载字体文件
for url in "${font_urls[@]}"; do
  filename=$(basename "$url")
  echo "Downloading $filename..."
  curl -L -o "$filename" "$url"
done

echo "Fonts downloaded successfully!"

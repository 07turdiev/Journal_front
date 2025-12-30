#!/bin/bash
# Rasmlarni base64 ga aylantirish skripti

echo "Rasmlarni base64 ga aylantiryapman..."

# bg.png ni base64 ga aylantirish
base64 -i public/sertificate/assets/bg.png > /tmp/bg_base64.txt
echo "✓ bg.png base64 ga aylantirildi"

# logo.svg ni base64 ga aylantirish  
base64 -i public/sertificate/assets/logo.svg > /tmp/logo_base64.txt
echo "✓ logo.svg base64 ga aylantirildi"

echo ""
echo "Base64 stringlar tayyor!"
echo "Fayllar:"
echo "  - /tmp/bg_base64.txt"
echo "  - /tmp/logo_base64.txt"
echo ""
echo "Endi bu stringlarni template.ejs fayliga qo'shing:"
echo "  - bg.png uchun: data:image/png;base64,<BASE64_STRING>"
echo "  - logo.svg uchun: data:image/svg+xml;base64,<BASE64_STRING>"



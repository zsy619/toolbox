#!/bin/bash

# JavaScript代码标准化脚本
# 将ES6语法转换为ES5兼容语法

echo "🔧 开始JavaScript代码标准化..."

# 查找所有HTML文件
find . -name "*.html" -not -path "./assets/*" | while read file; do
    echo "处理文件: $file"
    
    # 1. 将const转换为var
    sed -i '' 's/\bconst\b/var/g' "$file"
    
    # 2. 将let转换为var  
    sed -i '' 's/\blet\b/var/g' "$file"
    
    # 3. 将箭头函数转换为普通函数（简单情况）
    # 处理 forEach(item => {
    sed -i '' 's/forEach(\([a-zA-Z_][a-zA-Z0-9_]*\) => {/forEach(function(\1) {/g' "$file"
    
    # 处理 map(item => {
    sed -i '' 's/map(\([a-zA-Z_][a-zA-Z0-9_]*\) => {/map(function(\1) {/g' "$file"
    
    # 处理 filter(item => {
    sed -i '' 's/filter(\([a-zA-Z_][a-zA-Z0-9_]*\) => {/filter(function(\1) {/g' "$file"
    
    # 处理 addEventListener('click', () => {
    sed -i '' "s/addEventListener('\\([^']*\\)', () => {/addEventListener('\\1', function() {/g" "$file"
    
    # 处理 addEventListener("click", () => {
    sed -i '' 's/addEventListener("\([^"]*\)", () => {/addEventListener("\1", function() {/g' "$file"
    
    # 4. 处理模板字符串（基础情况）
    # 这个比较复杂，暂时跳过复杂的模板字符串转换
    
    echo "✓ $file 处理完成"
done

echo "🎉 JavaScript代码标准化完成!"
echo ""
echo "📊 统计信息:"
echo "处理的文件数量: $(find . -name "*.html" -not -path "./assets/*" | wc -l)"
echo ""
echo "🔍 验证结果:"
remaining_const=$(find . -name "*.html" -not -path "./assets/*" -exec grep -l "const " {} \; 2>/dev/null | wc -l)
remaining_let=$(find . -name "*.html" -not -path "./assets/*" -exec grep -l "let " {} \; 2>/dev/null | wc -l)
remaining_arrow=$(find . -name "*.html" -not -path "./assets/*" -exec grep -l " => " {} \; 2>/dev/null | wc -l)

echo "剩余const使用: $remaining_const 个文件"
echo "剩余let使用: $remaining_let 个文件" 
echo "剩余箭头函数: $remaining_arrow 个文件"

if [ "$remaining_const" -eq 0 ] && [ "$remaining_let" -eq 0 ]; then
    echo "✅ ES6变量声明已全部转换完成!"
else
    echo "⚠️  仍有文件需要手动处理"
fi
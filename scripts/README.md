# 脚本工具集

本目录包含项目的各类脚本工具。

## 脚本列表

| 文件 | 功能说明 |
|------|----------|
| aicodewith.sh | AI代码辅助脚本 |
| any_router.sh | 路由脚本 |
| cleanup_backups.py | 清理备份文件 |
| css_js_separator.py | CSS/JS分离工具 |
| game_validator.py | 游戏验证脚本 |
| normalize-js.sh | JS标准化脚本 |
| generate-index-pages.sh | 生成目录索引页面(Bash版) |
| generate-index-pages.py | 生成目录索引页面(Python版) |

---

## 目录索引页面生成器

### 功能特性

1. **自动适应任意深度的目录结构**
   - 自动计算目录深度
   - 动态生成相对路径
   - 支持无限层级嵌套

2. **动态生成相对路径引用**
   - 自动计算资源文件引用深度
   - 智能生成CSS/JS路径
   - 确保不同层级都能正确加载

3. **保持页面样式和功能的一致性**
   - 统一的页面设计风格
   - 响应式布局,适配移动端
   - 使用LayUI框架保持一致性

4. **正确处理特殊字符和空格的文件名**
   - 使用URL编码处理文件名
   - 支持中文文件名
   - 正确显示特殊字符

5. **提供清晰的目录导航界面**
   - 目录和文件分类显示
   - 文件类型图标区分
   - 实时搜索功能
   - 面包屑导航

### 使用方法

#### Bash版本 (macOS/Linux)

```bash
cd /Volumes/E/JYW/工具箱
./scripts/generate-index-pages.sh
```

#### Python版本 (跨平台)

```bash
cd /Volumes/E/JYW/工具箱
python3 scripts/generate-index-pages.py
# 或
./scripts/generate-index-pages.py
```

### 生成的页面特点

#### 1. 搜索功能
- 实时搜索文件和目录
- 支持模糊匹配
- 即时过滤显示

#### 2. 文件类型图标
- HTML文件: 📄 蓝色
- JS文件: 📄 黄色
- CSS文件: 📄 紫色
- 图片文件: 📄 粉色
- Markdown文件: 📄 绿色
- 其他文件: 📄 灰色

#### 3. 目录卡片样式
- 渐变色背景
- 鼠标悬停效果
- 文件大小显示

#### 4. 响应式设计
- 自适应网格布局
- 移动端优化
- 平板和手机适配

### 配置选项

脚本中的可配置项:

```bash
# 排除的目录
EXCLUDE_DIRS=(
    ".git"
    ".vscode"
    "node_modules"
    "__pycache__"
    "archive"
)

# 排除的文件
EXCLUDE_FILES=(
    ".DS_Store"
    ".gitignore"
    "*.swp"
)
```

### 生成示例

生成的index.html会自动显示:

```
📁 apps/
  ├── 📁 lottery/
  ├── 📁 ai-tools/
  ├── 📄 live240.html
  └── 📄 README.md

📁 docs/
  ├── 📄 README.md
  └── 📄 project-guide.md
```

### 注意事项

1. **覆盖现有index.html**
   - 脚本会覆盖同名文件
   - 建议先备份重要的index.html

2. **资源路径依赖**
   - 需要存在 `assets/css/` 和 `assets/js/`
   - 确保LayUI和FontAwesome文件存在

3. **执行权限**
   - Bash脚本需要执行权限: `chmod +x generate-index-pages.sh`
   - Python脚本需要Python 3.6+

### 故障排查

#### 问题1: CSS/JS加载失败
**原因**: 资源路径计算错误
**解决**: 检查assets目录是否存在,路径是否正确

#### 问题2: 文件名乱码
**原因**: 编码问题
**解决**: 使用Python版本,支持UTF-8编码

#### 问题3: 无法打开文件
**原因**: 特殊字符未编码
**解决**: 脚本已使用URL编码,确保浏览器兼容

---

## 其他脚本使用

### Shell脚本
```bash
./scriptname.sh
```

### Python脚本
```bash
python scriptname.py
# 或
python3 scriptname.py
```

## 注意事项

- 确保有执行权限: `chmod +x *.sh`
- Python需要Python 3.x环境
- 运行前建议备份重要文件

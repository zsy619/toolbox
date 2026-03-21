#!/bin/bash

# 生成目录索引页面脚本
# 用途: 在根目录外的所有子目录中自动生成index.html导航页面

set -e

# 配置
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
ROOT_DIR="$PROJECT_ROOT"

# 排除的目录
EXCLUDE_DIRS=(
    ".git"
    ".vscode"
    "node_modules"
    ".idea"
    "__pycache__"
    "*.git"
    "archive"
)

# 排除的文件
EXCLUDE_FILES=(
    ".DS_Store"
    ".gitignore"
    "*.swp"
    "*.swo"
    "*.bak"
    "*.tmp"
)

# 文件类型图标映射
declare -A FILE_ICONS=(
    ["html"]="fa-file-code"
    ["htm"]="fa-file-code"
    ["js"]="fa-file-code"
    ["css"]="fa-file-code"
    ["json"]="fa-file-code"
    ["md"]="fa-file-alt"
    ["txt"]="fa-file-alt"
    ["pdf"]="fa-file-pdf"
    ["zip"]="fa-file-archive"
    ["png"]="fa-file-image"
    ["jpg"]="fa-file-image"
    ["jpeg"]="fa-file-image"
    ["gif"]="fa-file-image"
    ["svg"]="fa-file-image"
    ["mp4"]="fa-file-video"
    ["mp3"]="fa-file-audio"
    ["sh"]="fa-terminal"
    ["py"]="fa-file-code"
)

# 颜色定义
declare -A FILE_COLORS=(
    ["html"]="blue"
    ["htm"]="blue"
    ["js"]="yellow"
    ["css"]="purple"
    ["json"]="orange"
    ["md"]="green"
    ["txt"]="gray"
    ["pdf"]="red"
    ["zip"]="gray"
    ["png"]="pink"
    ["jpg"]="pink"
    ["jpeg"]="pink"
    ["gif"]="pink"
    ["svg"]="pink"
    ["mp4"]="red"
    ["mp3"]="cyan"
    ["sh"]="green"
    ["py"]="yellow"
)

# 检查目录是否在排除列表中
is_excluded_dir() {
    local dir_name=$(basename "$1")
    for exclude in "${EXCLUDE_DIRS[@]}"; do
        if [[ "$dir_name" == $exclude ]]; then
            return 0
        fi
    done
    return 1
}

# 检查文件是否在排除列表中
is_excluded_file() {
    local file_name=$(basename "$1")
    for exclude in "${EXCLUDE_FILES[@]}"; do
        if [[ "$file_name" == $exclude ]]; then
            return 0
        fi
    done
    return 1
}

# 获取相对路径
get_relative_path() {
    local from="$1"
    local to="$2"
    local common_part="$from"
    local back=""

    while [[ "${to#$common_part}" == "${to}" ]]; do
        common_part="$(dirname "$common_part")"
        if [[ -z "$common_part" || "$common_part" == "." ]]; then
            common_part=""
            break
        fi
        back="../$back"
    done

    if [[ -z "$common_part" ]]; then
        echo "$to"
    else
        local forward="${to#$common_part/}"
        echo "${back}${forward}"
    fi
}

# 计算资源引用深度
calculate_asset_depth() {
    local current_dir="$1"
    local depth=0

    while [[ "$current_dir" != "$ROOT_DIR" ]]; do
        current_dir="$(dirname "$current_dir")"
        ((depth++))
    done

    # 生成相对路径
    local relative_path=""
    for ((i=0; i<depth; i++)); do
        relative_path="../$relative_path"
    done

    echo "${relative_path}"
}

# 生成HTML内容
generate_index_html() {
    local dir_path="$1"
    local dir_name=$(basename "$dir_path")
    local parent_path=$(dirname "$dir_path")
    local asset_depth=$(calculate_asset_depth "$dir_path")

    # 构建资源路径
    local css_path="${asset_depth}assets/css/layui.min.css"
    local font_path="${asset_depth}assets/css/fontawesome.min.css"
    local js_path="${asset_depth}assets/js/layui.min.js"
    local style_path="${asset_depth}assets/css/style.css"

    cat <<EOF
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="${dir_name} 目录索引">
    <title>目录索引 - ${dir_name}</title>
    <link rel="icon" type="image/png" href="${asset_depth}assets/images/dev-tools-og.png">
    <link rel="stylesheet" href="${css_path}">
    <link rel="stylesheet" href="${font_path}">
    <link rel="stylesheet" href="${style_path}">
    <style>
        .index-container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
        }

        .index-header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 30px;
            border-radius: 10px;
            margin-bottom: 30px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }

        .index-header h1 {
            margin: 0;
            font-size: 28px;
        }

        .index-header .breadcrumb {
            margin-top: 10px;
            font-size: 14px;
            opacity: 0.9;
        }

        .breadcrumb a {
            color: white;
            text-decoration: none;
        }

        .breadcrumb a:hover {
            text-decoration: underline;
        }

        .section-title {
            font-size: 18px;
            font-weight: bold;
            margin: 30px 0 15px 0;
            padding-bottom: 10px;
            border-bottom: 2px solid #e0e0e0;
            display: flex;
            align-items: center;
            gap: 10px;
        }

        .item-list {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
            gap: 15px;
            margin-top: 15px;
        }

        .item-card {
            background: white;
            border: 1px solid #e0e0e0;
            border-radius: 8px;
            padding: 15px;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            gap: 12px;
            text-decoration: none;
            color: inherit;
        }

        .item-card:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            border-color: #667eea;
        }

        .item-icon {
            width: 40px;
            height: 40px;
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 20px;
            flex-shrink: 0;
        }

        .item-info {
            flex: 1;
            min-width: 0;
        }

        .item-name {
            font-weight: 500;
            font-size: 15px;
            margin-bottom: 3px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }

        .item-meta {
            font-size: 12px;
            color: #999;
        }

        .back-link {
            display: inline-block;
            margin-bottom: 20px;
            padding: 8px 16px;
            background: #f5f5f5;
            border-radius: 5px;
            text-decoration: none;
            color: #333;
            font-size: 14px;
        }

        .back-link:hover {
            background: #e0e0e0;
        }

        /* 目录卡片样式 */
        .dir-card .item-icon {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
        }

        /* 文件卡片颜色 */
        .file-blue .item-icon { background: #3498db; color: white; }
        .file-yellow .item-icon { background: #f39c12; color: white; }
        .file-purple .item-icon { background: #9b59b6; color: white; }
        .file-orange .item-icon { background: #e67e22; color: white; }
        .file-green .item-icon { background: #2ecc71; color: white; }
        .file-gray .item-icon { background: #95a5a6; color: white; }
        .file-red .item-icon { background: #e74c3c; color: white; }
        .file-pink .item-icon { background: #e91e63; color: white; }
        .file-cyan .item-icon { background: #00bcd4; color: white; }

        /* 响应式 */
        @media (max-width: 768px) {
            .item-list {
                grid-template-columns: 1fr;
            }

            .index-header h1 {
                font-size: 22px;
            }
        }

        /* 搜索框 */
        .search-box {
            margin-bottom: 20px;
        }

        .search-box input {
            width: 100%;
            padding: 12px 15px;
            border: 1px solid #e0e0e0;
            border-radius: 8px;
            font-size: 14px;
            box-sizing: border-box;
        }

        .search-box input:focus {
            outline: none;
            border-color: #667eea;
            box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }
    </style>
</head>
<body>
    <div class="index-container">
        <div class="index-header">
            <h1><i class="fas fa-folder-open"></i> ${dir_name}</h1>
            <div class="breadcrumb">
                <i class="fas fa-home"></i> <a href="${asset_path}">首页</a>
            </div>
        </div>

        <div class="search-box">
            <input type="text" placeholder="🔍 搜索文件和目录..." id="searchInput">
        </div>

        $(if [[ "$dir_path" != "$ROOT_DIR" ]]; then
            echo "<a href=\"../\" class=\"back-link\"><i class=\"fas fa-arrow-left\"></i> 返回上级目录</a>"
        fi)

        <div class="section">
            <div class="section-title">
                <i class="fas fa-folder" style="color: #667eea;"></i>
                <span>子目录</span>
            </div>
            <div class="item-list" id="dirList">
EOF

    # 列出子目录
    local dirs_found=0
    for item in "$dir_path"/*; do
        if [[ -d "$item" ]] && ! is_excluded_dir "$item"; then
            dirs_found=1
            local name=$(basename "$item")
            cat <<EOF
                <a href="${name}/" class="item-card dir-card">
                    <div class="item-icon">
                        <i class="fas fa-folder"></i>
                    </div>
                    <div class="item-info">
                        <div class="item-name">${name}</div>
                        <div class="item-meta">目录</div>
                    </div>
                </a>
EOF
        fi
    done

    if [[ $dirs_found -eq 0 ]]; then
        echo "                <p style=\"color: #999; padding: 20px;\">暂无子目录</p>"
    fi

    cat <<EOF
            </div>
        </div>

        <div class="section">
            <div class="section-title">
                <i class="fas fa-file" style="color: #667eea;"></i>
                <span>文件</span>
            </div>
            <div class="item-list" id="fileList">
EOF

    # 列出文件
    local files_found=0
    for item in "$dir_path"/*; do
        if [[ -f "$item" ]] && ! is_excluded_file "$item"; then
            files_found=1
            local name=$(basename "$item")
            local ext="${name##*.}"
            local icon="${FILE_ICONS[$ext]:-fa-file}"
            local color="${FILE_COLORS[$ext]:-gray}"
            local size=$(du -h "$item" | cut -f1)

            cat <<EOF
                <a href="${name}" class="item-card file-${color}">
                    <div class="item-icon">
                        <i class="fas ${icon}"></i>
                    </div>
                    <div class="item-info">
                        <div class="item-name">${name}</div>
                        <div class="item-meta">${size}</div>
                    </div>
                </a>
EOF
        fi
    done

    if [[ $files_found -eq 0 ]]; then
        echo "                <p style=\"color: #999; padding: 20px;\">暂无文件</p>"
    fi

    cat <<EOF
            </div>
        </div>

        <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #e0e0e0; text-align: center; color: #999; font-size: 13px;">
            <p>自动生成的目录索引页面</p>
            <p>最后更新: $(date '+%Y-%m-%d %H:%M:%S')</p>
        </div>
    </div>

    <script src="${js_path}"></script>
    <script>
        layui.use(['element'], function() {
            // 搜索功能
            document.getElementById('searchInput').addEventListener('input', function() {
                const searchTerm = this.value.toLowerCase();
                const cards = document.querySelectorAll('.item-card');

                cards.forEach(card => {
                    const name = card.querySelector('.item-name').textContent.toLowerCase();
                    if (name.includes(searchTerm)) {
                        card.style.display = 'flex';
                    } else {
                        card.style.display = 'none';
                    }
                });
            });
        });
    </script>
</body>
</html>
EOF
}

# 递归生成索引页面
generate_index_recursive() {
    local dir="$1"

    # 跳过根目录
    if [[ "$dir" == "$ROOT_DIR" ]]; then
        return
    fi

    # 跳过排除目录
    if is_excluded_dir "$dir"; then
        return
    fi

    echo "正在处理: $dir"

    # 生成索引页面
    generate_index_html "$dir" > "$dir/index.html"

    # 递归处理子目录
    for item in "$dir"/*; do
        if [[ -d "$item" ]]; then
            generate_index_recursive "$item"
        fi
    done
}

# 主函数
main() {
    echo "==================================="
    echo "  目录索引页面生成器"
    echo "==================================="
    echo ""
    echo "项目根目录: $ROOT_DIR"
    echo ""

    # 确认执行
    read -p "是否继续生成索引页面? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "已取消"
        exit 0
    fi

    # 递归生成索引页面
    echo "开始生成索引页面..."
    echo ""

    local count=0
    for dir in "$ROOT_DIR"/*; do
        if [[ -d "$dir" ]]; then
            generate_index_recursive "$dir"
            ((count++))
        fi
    done

    echo ""
    echo "==================================="
    echo "  生成完成!"
    echo "==================================="
    echo ""
    echo "已处理的目录数: $count"
    echo ""
    echo "查看生成的索引页面:"
    echo "  - $ROOT_DIR/apps/"
    echo "  - $ROOT_DIR/docs/"
    echo "  - $ROOT_DIR/scripts/"
    echo "  - ..."
    echo ""
}

# 执行主函数
main

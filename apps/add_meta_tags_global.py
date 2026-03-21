
import os
import re

# Root directory for scanning
root_scan_dir = "/Volumes/E/JYW/工具箱/apps"

# Directories to process
target_dirs = [
    "courses",
    "games",
    "image-processing",
    "life",
    "lottery",
    "multimedia",
    "real3d",
    "utilities", 
    "yitang"
]

# Common image path (relative to the file, needs adjustment based on depth)
# We will use absolute path or root-relative path if possible, but for static HTML, relative is safer.
# Standard structure is apps/<category>/<file>.html
# Assets is at apps/../assets
# So from apps/<category>/file.html to assets is ../../assets
og_image_path = "https://tools.yy24365.com/assets/images/dev-tools-og.png"

# Default descriptions if none found (fallback)
default_description = "一个实用的在线工具，帮助您提高效率。"

def get_file_title(content, filename):
    match = re.search(r'<title>(.*?)</title>', content, re.IGNORECASE)
    if match:
        return match.group(1).strip()
    return filename.replace('.html', '')

def get_file_description(content, filename):
    # Try to find existing description meta
    match = re.search(r'<meta\s+name="description"\s+content="(.*?)"', content, re.IGNORECASE)
    if match:
        return match.group(1).strip()
    return default_description

def process_file(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Skip files that already have our specific og:image to avoid re-processing or duplicates
    # A simple way to check is if 'dev-tools-og.png' is already in the file
    # But we might want to update tags if they are old. 
    # Let's perform a clean update/insert.
    
    filename = os.path.basename(file_path)
    title = get_file_title(content, filename)
    description = get_file_description(content, filename)
    
    # Calculate relative path to assets
    # Assuming depth is 2 (apps/category/file.html) -> ../../assets
    # If depth is 1 (apps/file.html) -> ../assets
    # If depth is 3 (apps/category/subdir/file.html) -> ../../../assets
    
    rel_path = os.path.relpath(root_scan_dir, os.path.dirname(file_path))
    # root_scan_dir is .../apps
    # assets is .../assets (sibling of apps)
    # so from apps, it is ../assets
    # from apps/category, rel_path to apps is ..
    # so we want rel_path_to_assets = rel_path_to_apps + "/../assets"
    
    # Actually os.path.relpath(start, current) gives path from current to start.
    # We want path from file_dir to assets_dir
    assets_dir = os.path.abspath(os.path.join(root_scan_dir, "../assets"))
    image_rel_path = os.path.relpath(assets_dir, os.path.dirname(file_path))
    image_path = os.path.join(image_rel_path, "images/dev-tools-og.png")

    meta_tags = f"""
    <!-- 微信/OpenGraph 卡片信息 -->
    <meta property="og:title" content="{title}">
    <meta property="og:description" content="{description}">
    <meta property="og:url" content="./{filename}">
    <meta property="og:type" content="article">
    <meta property="og:image" content="{image_path}">

    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="{title}">
    <meta name="twitter:description" content="{description}">
    <meta name="twitter:image" content="{image_path}">

    <meta itemprop="name" content="{title}">
    <meta itemprop="description" content="{description}">
    <meta itemprop="image" content="{image_path}">
    """
    
    # 1. Remove old meta blocks
    lines = content.split('\n')
    new_lines = []
    for line in lines:
        if any(x in line for x in ['property="og:', 'name="twitter:', 'itemprop="', '微信/OpenGraph']):
            continue
        new_lines.append(line)
    content = '\n'.join(new_lines)

    # 2. Insert new meta
    if '</head>' in content:
        content = content.replace('</head>', f'{meta_tags}\n</head>')
    
    # 3. Inject WeChat Hack
    # Logic: First removed old hack if present, then inject new one at start of body
    
    # Standardize image path for the hack
    wechat_hack_html = f'\n    <!-- Wechat Share Image Hack -->\n    <div style="display:none; visibility:hidden;">\n        <img src="{image_path}" alt="wechat-share-icon" width="400" height="400">\n    </div>'
    
    # Remove old hack (regex for flexibility)
    content = re.sub(r'<!-- Wechat Share Image Hack -->.*?</div>\s*</div>', '', content, flags=re.DOTALL) 
    # Also remove the simple one line version if it exists
    content = re.sub(r'<div style="display:none; visibility:hidden;"><img src=".*?dev-tools-og.png".*?></div>', '', content)

    # Inject new hack
    body_pattern = re.compile(r'(<body[^>]*>)', re.IGNORECASE)
    if body_pattern.search(content):
        content = body_pattern.sub(r'\1' + wechat_hack_html, content, count=1)
        print(f"Processed {filename}")
    
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)

def main():
    for dirname in target_dirs:
        dir_path = os.path.join(root_scan_dir, dirname)
        if not os.path.exists(dir_path):
            continue
            
        print(f"Scanning {dirname}...")
        for root, dirs, files in os.walk(dir_path):
            for file in files:
                if file.endswith(".html"):
                    process_file(os.path.join(root, file))

    # Also process root apps index.html
    process_file(os.path.join(root_scan_dir, "index.html"))

if __name__ == "__main__":
    main()

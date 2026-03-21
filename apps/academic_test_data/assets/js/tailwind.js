// Tailwind CSS 配置文件
// 从 CDN 引入的简化版本
window.tailwind = {
  config: {
    theme: {
      extend: {
        colors: {
          primary: '#667eea',
          secondary: '#764ba2'
        }
      }
    }
  }
};

// 引入 Tailwind CSS
const script = document.createElement('script');
script.src = 'https://cdn.tailwindcss.com';
script.defer = true;
document.head.appendChild(script);
# 📋 JavaScript 代码规范与最佳实践

## 🎯 兼容性标准

### ✅ **支持的语法**
- **变量声明**: 使用 `var`（避免 `const` 和 `let`）
- **函数**: 使用传统函数声明（避免箭头函数）
- **循环**: 使用传统 `for` 循环
- **对象**: 使用ES5对象语法

### ❌ **避免的ES6语法**
```javascript
// ❌ 避免使用
const name = 'test';
let count = 0;
arr.forEach(item => console.log(item));
const fn = () => {};

// ✅ 推荐使用
var name = 'test';
var count = 0;
arr.forEach(function(item) { console.log(item); });
function fn() {}
```

## 🔧 代码优化规则

### 1️⃣ **变量声明**
```javascript
// ✅ 统一使用var
var element = document.getElementById('myId');
var results = [];
var isActive = false;

// ✅ 变量声明提升到函数顶部
function myFunction() {
    var i, len, result, data;
    
    for (i = 0, len = array.length; i < len; i++) {
        // 处理逻辑
    }
}
```

### 2️⃣ **事件处理**
```javascript
// ✅ 使用传统函数
document.getElementById('btn').addEventListener('click', function() {
    console.log('按钮被点击');
});

// ✅ 绑定上下文
var self = this;
element.addEventListener('click', function() {
    self.handleClick();
});
```

### 3️⃣ **数组操作**
```javascript
// ✅ 传统forEach
arr.forEach(function(item, index) {
    console.log(index, item);
});

// ✅ 传统map
var newArr = arr.map(function(item) {
    return item * 2;
});

// ✅ 传统filter
var filtered = arr.filter(function(item) {
    return item > 10;
});
```

### 4️⃣ **DOM操作优化**
```javascript
// ✅ 缓存DOM元素
var container = document.getElementById('container');
var buttons = container.querySelectorAll('.btn');

// ✅ 批量DOM操作
var fragment = document.createDocumentFragment();
for (var i = 0; i < data.length; i++) {
    var element = document.createElement('div');
    element.textContent = data[i];
    fragment.appendChild(element);
}
container.appendChild(fragment);
```

## 🚀 性能优化

### 📊 **内存管理**
```javascript
// ✅ 及时清理事件监听器
function cleanup() {
    element.removeEventListener('click', handleClick);
    element = null;
}

// ✅ 避免内存泄漏
var cache = {};
function clearCache() {
    cache = {};
}
```

### ⚡ **执行效率**
```javascript
// ✅ 减少DOM查询
var element = document.getElementById('myElement');
for (var i = 0; i < 100; i++) {
    element.style.left = i + 'px'; // 缓存DOM引用
}

// ✅ 使用事件委托
document.getElementById('container').addEventListener('click', function(e) {
    if (e.target.classList.contains('btn')) {
        handleButtonClick(e.target);
    }
});
```

## 🛡️ 错误处理

### 🔍 **输入验证**
```javascript
function processInput(value) {
    // ✅ 类型检查
    if (typeof value !== 'string') {
        console.error('Expected string, got ' + typeof value);
        return false;
    }
    
    // ✅ 边界检查
    if (value.length === 0) {
        console.warn('Empty input provided');
        return false;
    }
    
    return true;
}
```

### 🚨 **异常处理**
```javascript
function safeOperation() {
    try {
        // 可能出错的操作
        var result = riskyFunction();
        return result;
    } catch (error) {
        console.error('操作失败:', error.message);
        return null;
    }
}
```

## 📚 最佳实践总结

### ✅ **推荐做法**
1. **一致性**: 整个项目使用相同的代码风格
2. **可读性**: 变量和函数使用有意义的命名
3. **模块化**: 将功能拆分为独立的函数
4. **注释**: 为复杂逻辑添加必要注释
5. **测试**: 在多个浏览器中测试功能

### ❌ **避免事项**
1. **全局变量污染**: 避免创建不必要的全局变量
2. **内联事件**: 避免在HTML中写内联JavaScript
3. **字符串拼接**: 大量DOM操作时避免字符串拼接
4. **同步阻塞**: 避免长时间运行的同步操作
5. **硬编码**: 避免在代码中硬编码配置值

## 🔧 自动化工具

### 📝 **代码规范化脚本**
项目提供了 `normalize-js.sh` 脚本，可以自动转换ES6语法：

```bash
# 运行标准化脚本
./normalize-js.sh

# 检查转换结果
grep -r "const\|let" . --include="*.html"
```

### 🧪 **测试检查清单**
- [ ] 在IE11中测试基本功能
- [ ] 检查控制台是否有语法错误
- [ ] 验证所有事件监听器正常工作
- [ ] 确认异步操作正确处理
- [ ] 测试错误边界情况

---

*最后更新: 2025年1月*
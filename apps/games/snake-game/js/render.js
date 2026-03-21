class GameRenderer {
    constructor() {
        this.initializeRenderer();
    }
    
    initializeRenderer() {
        console.log('渲染引擎已初始化');
    }
    
    addParticleEffect(x, y, color = '#48bb78') {
        const canvas = document.getElementById('gameCanvas');
        const ctx = canvas.getContext('2d');
        
        for (let i = 0; i < 5; i++) {
            setTimeout(() => {
                ctx.fillStyle = color;
                ctx.globalAlpha = 0.7 - (i * 0.1);
                
                const offsetX = (Math.random() - 0.5) * 10;
                const offsetY = (Math.random() - 0.5) * 10;
                
                ctx.fillRect(x + offsetX, y + offsetY, 4, 4);
                ctx.globalAlpha = 1.0;
            }, i * 50);
        }
    }
}

const renderer = new GameRenderer();
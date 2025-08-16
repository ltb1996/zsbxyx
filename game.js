// 游戏状态管理
class GameManager {
    constructor() {
        this.images = [];
        this.currentIndex = 0;
        this.isRunning = false;
        this.intervalId = null;
        this.switchSpeed = 50; // 切换速度（毫秒）
        
        this.init();
    }
    
    // 初始化游戏
    init() {
        this.loadImages();
        this.setupEventListeners();
        // 页面加载完成后显示第一张图片
        if (this.images.length > 0) {
            this.currentIndex = 0;
            this.updateDisplay();
        }
    }
    
    // 加载图片数据
    loadImages() {
        // 获取所有图片文件名（已按A-Z排序）
        const imageFiles = [
            '王标.jpg','于洋.jpg', '刘博文.jpg', '刘天博.jpg', '刘新宇.jpg', '刘腾飞.jpg', '刘芬.jpg',
            '孟想.jpg', '孟晓.jpg', '宁顺.jpg', '宋丹.jpg', '宋毓洋.jpg', '尹茂林.jpg',
            '张芮南.jpg', '徐婧.jpg', '曹小杰.jpg', '曾迟.jpg', '朱思博.jpg', '李世鹏.jpg',
            '李修伟.jpg', '李果.jpg', '李雅楠.jpg', '柴德华.jpg', '标哥.jpg', '汪蒙.jpg',
            '滕艳秋.jpg', '滕颖慧.jpg', '熊炜.jpg', '王喜鸿.jpg', '王宇.jpg', 
            '王睿.jpg', '王霞.jpg', '程都.jpg', '稽达.jpg', '肖慧.jpg', '肖芳芳.jpg',
            '董佩佩.jpg', '蔡严杰.jpg', '许文东.jpg', '许文怡.jpg', '谢畅.jpg', '陈嘉莉.jpg',
            '陈敏.jpg', '陈欣烨.jpg', '陈茜茜.jpg', '鞠岳坤.jpg', '高小迪.jpg', '高校长.jpg',
            '魏威.jpg', '黄学务长.jpg'
        ];

        console.log(imageFiles.length, '+++++++++++++++');
        
        // 创建图片数组对象
        this.images = imageFiles.map((filename, index) => {
            const name = filename.replace('.jpg', '');
            return {
                id: index,
                name: name,
                src: `imgs/${filename}`
            };
        });
        
        console.log('游戏初始化完成，共加载', this.images.length, '张图片');
    }
    
    // 设置事件监听器
    setupEventListeners() {
        const startBtn = document.getElementById('start-btn');
        const stopBtn = document.getElementById('stop-btn');
        
        startBtn.addEventListener('click', () => this.startGame());
        stopBtn.addEventListener('click', () => this.stopGame());
    }
    
    // 开始游戏
    startGame() {
        if (this.isRunning) return;
        
        this.isRunning = true;
        document.getElementById('start-btn').disabled = true;
        document.getElementById('stop-btn').disabled = false;
        
        console.log('游戏开始！');
        
        // 开始快速切换图片
        this.intervalId = setInterval(() => {
            this.switchImage();
        }, this.switchSpeed);
        
        // 添加切换效果
        this.addSwitchEffect();
    }
    
    // 停止游戏
    stopGame() {
        if (!this.isRunning) return;
        
        this.isRunning = false;
        clearInterval(this.intervalId);
        this.intervalId = null;
        
        document.getElementById('start-btn').disabled = false;
        document.getElementById('stop-btn').disabled = true;
        
        console.log('游戏停止！');
        
        // 移除切换效果
        this.removeSwitchEffect();
    }
    
    // 切换图片
    switchImage() {
        this.currentIndex = Math.floor(Math.random() * this.images.length);
        this.updateDisplay();
    }
    
    // 更新显示
    updateDisplay() {
        const currentImage = this.images[this.currentIndex];
        const gameImage = document.getElementById('game-image');
        
        if (currentImage && gameImage) {
            gameImage.src = currentImage.src;
            gameImage.alt = '猜猜我是谁';
        }
    }
    
    // 添加切换效果
    addSwitchEffect() {
        const imageContainer = document.querySelector('.image-container');
        imageContainer.style.animation = 'pulse 0.1s infinite';
    }
    
    // 移除切换效果
    removeSwitchEffect() {
        const imageContainer = document.querySelector('.image-container');
        imageContainer.style.animation = 'none';
    }
}

// 添加CSS动画
const style = document.createElement('style');
style.textContent = `
    @keyframes pulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.02); }
        100% { transform: scale(1); }
    }
    
    .game-image.fade {
        opacity: 0.5;
    }
`;
document.head.appendChild(style);

// 页面加载完成后初始化游戏
document.addEventListener('DOMContentLoaded', () => {
    window.gameManager = new GameManager();
});

// 键盘快捷键
document.addEventListener('keydown', (e) => {
    if (e.code === 'Space') {
        e.preventDefault();
        if (window.gameManager) {
            if (window.gameManager.isRunning) {
                window.gameManager.stopGame();
            } else {
                window.gameManager.startGame();
            }
        }
    }
});
// 游戏状态管理
class GameManager {
    constructor() {
        this.images = [];
        this.currentIndex = 0;
        this.displayIndex = 0; // 用于顺序显示的索引
        this.isRunning = false;
        this.intervalId = null;
        this.switchSpeed = 1000; // 切换速度（毫秒）
        
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
            '王标.jpg','于洋.jpg', '刘天博.jpg','刘博文.jpg', '刘新宇.jpg', '刘腾飞.jpg', '刘芬.jpg',
            '孟想.jpg', '孟晓.jpg', '宁顺.jpg', '宋丹.jpg', '宋毓洋.jpg', '尹茂林.jpg',
            '张芮南.jpg', '徐婧.jpg', '曹小杰.jpg', '曾迟.jpg', '朱思博.jpg', '李世鹏.jpg',
            '李修伟.jpg', '李果.jpg', '李雅楠.jpg', '柴德华.jpg', '标哥.jpg', '汪蒙.jpg',
            '滕艳秋.jpg', '滕颖慧.jpg', '熊炜.jpg', '王喜鸿.jpg', '王宇.jpg', 
            '王睿.jpg', '王霞.jpg', '程都.jpg', '稽达.jpg', '肖慧.jpg', '肖芳芳.jpg',
            '董佩佩.jpg', '蔡严杰.jpg', '许文东.jpg', '许文怡.jpg', '谢畅.jpg', '陈嘉莉.jpg',
            '陈敏.jpg', '陈欣烨.jpg', '陈茜茜.jpg', '鞠岳坤.jpg', '高小迪.jpg', '高校长.jpg',
            '魏威.jpg', '黄学务长.jpg'
        ];


        // const imageFiles = [
        //     '王标.jpg','于洋.jpg', '刘博文.jpg', '刘天博.jpg'
        // ];


        console.log(imageFiles.length, '45454545454');

        // 定义黑名单（无法被抽到的图片）
        const blacklist = ['刘天博'];
        
        // 创建完整图片数组（用于显示）
        this.allImages = imageFiles.map((filename, index) => {
            const name = filename.replace('.jpg', '');
            return {
                id: index,
                name: name,
                src: `imgs/${filename}`,
                excluded: blacklist.includes(name) // 标记是否被排除
            };
        });
        
        // 创建可选图片数组（排除黑名单）
        this.images = this.allImages.filter(img => !img.excluded);
        
        console.log('游戏初始化完成，总图片：', this.allImages.length, '张');
        // console.log('可抽中图片：', this.images.length, '张（已排除黑名单）');
        // console.log('黑名单图片：', this.allImages.filter(img => img.excluded).map(img => img.name));
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
        
        // 播放BGM
        if (window.musicController) {
            window.musicController.play();
        }
    }
    
    // 停止游戏
    stopGame() {
        if (!this.isRunning) return;
        
        this.isRunning = false;
        clearInterval(this.intervalId);
        this.intervalId = null;
        
        document.getElementById('start-btn').disabled = false;
        document.getElementById('stop-btn').disabled = true;
        
        // 显示当前图片名字到控制台
        const currentImage = this.images[this.currentIndex];
        console.log('游戏停止！');
        console.log('当前图片名字：', currentImage.name);
        
        // 移除切换效果
        this.removeSwitchEffect();
        
        // 暂停BGM
        if (window.musicController) {
            window.musicController.pause();
        }
    }
    
    // 切换图片
    switchImage() {
        this.updateDisplay();
    }
    
    // 更新显示
    updateDisplay() {
        const gameImage = document.getElementById('game-image');
        
        if (this.displayIndex >= this.allImages.length) {
            this.displayIndex = 0; // 循环到开头
        }
        
        const displayImage = this.allImages[this.displayIndex];
        
        if (displayImage && gameImage) {
            gameImage.src = displayImage.src;
            gameImage.alt = '猜猜我是谁';
            
            // 只在非黑名单图片时更新currentIndex
            if (!displayImage.excluded) {
                this.currentIndex = this.images.findIndex(img => img.id === displayImage.id);
            }
            
            this.displayIndex++;
        }
    }
    
    // 添加切换效果
    addSwitchEffect() {
        const gameImage = document.getElementById('game-image');
        gameImage.classList.add('animated');
    }
    
    // 移除切换效果
    removeSwitchEffect() {
        const gameImage = document.getElementById('game-image');
        gameImage.classList.remove('animated');
    }
}

// 添加CSS动画
const style = document.createElement('style');
style.textContent = `
    @keyframes pulse {
        0% { opacity: 1; }
        50% { opacity: 0.8; }
        100% { opacity: 1; }
    }
    
    .game-image.animated {
        animation: pulse 1.0s infinite;
    }
`;
document.head.appendChild(style);

// 音乐控制功能
class MusicController {
    constructor() {
        this.audio = document.getElementById('bgm');
        this.toggleBtn = document.getElementById('music-toggle');
        this.isPlaying = false;
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        // 初始音量设为30%
        this.audio.volume = 0.3;
        this.updateButtonState();
    }
    
    setupEventListeners() {
        this.toggleBtn.addEventListener('click', () => this.toggle());
        
        // 键盘快捷键：M键切换音乐
        document.addEventListener('keydown', (e) => {
            if (e.code === 'KeyM') {
                e.preventDefault();
                this.toggle();
            }
        });
    }
    
    toggle() {
        if (this.isPlaying) {
            this.pause();
        } else {
            this.play();
        }
    }
    
    play() {
        this.audio.play().then(() => {
            this.isPlaying = true;
            this.updateButtonState();
            console.log('BGM已播放');
        }).catch(error => {
            console.log('播放失败:', error);
        });
    }
    
    pause() {
        this.audio.pause();
        this.isPlaying = false;
        this.updateButtonState();
        console.log('BGM已暂停');
    }
    
    updateButtonState() {
        if (this.isPlaying) {
            this.toggleBtn.classList.add('playing');
            this.toggleBtn.innerHTML = '🎵';
        } else {
            this.toggleBtn.classList.remove('playing');
            this.toggleBtn.innerHTML = '🔇';
        }
    }
}

// 页面加载完成后初始化游戏和音乐
document.addEventListener('DOMContentLoaded', () => {
    window.gameManager = new GameManager();
    window.musicController = new MusicController();
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
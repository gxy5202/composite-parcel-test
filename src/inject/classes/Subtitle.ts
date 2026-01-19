/**
 * 视频字幕插件
 * 这个类整合了字幕解析、显示和UI交互功能
 */
export class SubtitlePlugin {
    subtitles: never[];
    currentSubtitle: null;
    container: null;
    subtitleContainer: null;
    isVisible: boolean;
    videoElements: never[];
    selectedVideoIndex: number;
    video: null;
    dragStartX: number;
    dragStartY: number;
    offsetX: number;
    offsetY: number;
    animationFrameId: null;
    options: {
        fontSize: string; fontFamily: string; fontColor: string; fontWeight: string; backgroundColor: string; textShadow: string; position: string; // 'top', 'bottom'
        bottomMargin: string; topMargin: string;
    };
    /**
     * 创建字幕插件实例
     * @param {Object} options - 配置选项
     */
    constructor(options = {}) {
        // 字幕数据
        this.subtitles = [];
        this.currentSubtitle = null;
        
        // UI元素
        this.container = null;
        this.subtitleContainer = null;
        this.isVisible = true;
        
        // 视频元素
        this.videoElements = [];
        this.selectedVideoIndex = 0;
        this.video = null;
        
        // 拖动相关
        this.dragStartX = 0;
        this.dragStartY = 0;
        this.offsetX = 0;
        this.offsetY = 0;
        
        // 动画帧
        this.animationFrameId = null;
        
        // 默认样式选项
        this.options = {
            fontSize: '24px',
            fontFamily: 'Arial, sans-serif',
            fontColor: '#ffffff',
            fontWeight: 'bold',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            textShadow: '2px 2px 2px #000',
            position: 'bottom', // 'top', 'bottom'
            bottomMargin: '50px',
            topMargin: '20px',
            ...options
        };
        
        // 初始化插件
        this.init();
        
        // 监听页面上的视频元素变化
        this.observeVideoElements();
    }
    
}
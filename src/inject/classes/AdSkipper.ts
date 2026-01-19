/**
 * @description: 跳过YouTube广告处理类（监听#ytd-player广告状态，自动通知外部加速/恢复）
 */
export default class AdSkipper {
  private observer: MutationObserver | null = null;
  private lastAdState: boolean = false;
  private url: string = ''
  private readonly playerId = "#player";
  private readonly adClasses =
    ".html5-video-player.ad-showing.ad-interrupting";
  private readonly speedWhenAd = 16;
  private readonly normalSpeed = 1;

  /**
   * @param onAdStart 广告出现时回调（参数为当前广告状态）
   * @param onAdEnd 广告结束时回调（参数为当前广告状态）
   */
  constructor(private onAdStart: () => void, private onAdEnd: () => void) {}
}

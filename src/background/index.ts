/*
 * @description: event Listener
 * @Author: Gouxinyu
 * @Date: 2022-04-23 23:37:22
 */
import { createURL, sendRuntimeMessage } from "src/util";
import { ActionType } from "../types/type.d";
import AudioCreater from "./class/AudioCreater";
import { sendTabMessage, setBadge, getBrowser } from "../util";
import { useShortcuts } from "src/use/useShortcuts";
import { useGeneralConfig } from "src/options/use/useGeneralConfig";
import browser from "webextension-polyfill";
import { nanoid } from "nanoid";
// background.js
import { HttpTransport, createBackgroundHandler } from '@composite-inc/composite-js';

// Create transport for API communication
const transport = new HttpTransport({
  apiKey: 'pk_9_a082420259994995',
  apiHost: 'https://prod.alb.us.api.composite.com',
});

// Setup message handler for content scripts
createBackgroundHandler(transport);

console.log('[Composite] Background script initialized');

let currentTabId: number | undefined;

// offscreen 音频管理由 AudioCreater 统一处理

// 在扩展被卸载或重新加载时清理资源
chrome.runtime.onSuspend?.addListener(() => {
  console.log("Extension is being suspended, cleaning up...");
  cleanup();
});

chrome.runtime.setUninstallURL(
  `https://videoroll.app/${
    chrome.i18n.getUILanguage().includes("zh") ? "zh" : "en"
  }/uninstall?version=${chrome.runtime.getManifest()?.version}`
);

chrome.runtime.onUpdateAvailable.addListener((details) => {
  chrome.runtime.reload();
});

// 创建右键菜单（仅创建一次）
// chrome.runtime.onInstalled.addListener(() => {
//   try {
//     chrome.contextMenus.create({
//       id: "videoroll_add_favourite",
//       title:
//         chrome.i18n?.getMessage("contextAddFavourite") ||
//         "添加到 VideoRoll 收藏",
//       contexts: ["page", "video"],
//     });
//   } catch (e) {
//     console.debug("contextMenus already exist or cannot be created", e);
//   }
// });

// chrome.contextMenus.onClicked.addListener((info, tab) => {
//   if (!tab?.id) return;
//   try {
//     sendTabMessage(tab.id, {
//       type: ActionType.CONTEXT_CAPTURE_FAV,
//       tabId: tab.id,
//     });
//   } catch (err) {
//     console.debug("send context capture message error", err);
//   }
// });

function setupStorage() {
  // 检查并设置默认值
  chrome.storage.sync.get(["shortcuts", "generalConfig"], (result) => {
    if (!result.shortcuts) {
      // 果没有找到存储的值，就使用默认值
      const shortcutsMap = useShortcuts();
      chrome.storage.sync.set({
        shortcuts: JSON.parse(JSON.stringify(shortcutsMap.value)),
      });
    }

    const defaultConfig = JSON.parse(JSON.stringify(useGeneralConfig().value));
    if (
      result.generalConfig?.length &&
      result.generalConfig.length !== defaultConfig.length
    ) {
      chrome.storage.sync.set({
        generalConfig: defaultConfig.map((v: any) => {
          const item = result.generalConfig.find(
            (item: any) => item.key === v.key
          );
          if (item) {
            return item;
          }
          return v;
        }),
      });
      return;
    }

    if (!result.generalConfig) {
      // 如果没有找到存储的值，就使用默认值
      chrome.storage.sync.set({
        generalConfig: defaultConfig,
      });
    }
  });
}

chrome.runtime.onInstalled.addListener((params: any) => {
  const reason = params.reason;
  switch (reason) {
    case "install":
      createURL(
        `https://videoroll.app/${
          chrome.i18n.getUILanguage().includes("zh") ? "zh" : "en"
        }/welcome?version=${chrome.runtime.getManifest()?.version}`
      );
      break;
    case "update":
      createURL(
        `https://docs.videoroll.app/${
          chrome.i18n.getUILanguage().includes("zh") ? "cn" : "en"
        }/docs/release-notes`
      );
      break;
    case "uninstall":
      createURL(
        `https://videoroll.app/${
          chrome.i18n.getUILanguage().includes("zh") ? "zh" : "en"
        }/uninstall?version=${chrome.runtime.getManifest()?.version}`
      );
      break;
    default:
      break;
  }
});

// hasOffscreenDocument 与 getStreamId 已迁移到 AudioCreater

(getBrowser("action") as typeof chrome.action).setBadgeBackgroundColor({
  color: "#a494c6",
});

/**
 * when url has been changed, send a masseage to content.js
 * and update badge;
 */
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  currentTabId = tabId;
  setupStorage();
  sendTabMessage(
    tabId,
    { type: ActionType.GET_BADGE, tabId },
    (response: any) => {
      sendTabMessage(tabId, { type: ActionType.INIT_SHORT_CUT_KEY });
    }
  );
});

// when tab is changed and it means a tab is actived
chrome.tabs.onActivated.addListener((activeInfo) => {
  const { tabId } = activeInfo;
  currentTabId = tabId;
  setupStorage();
  sendTabMessage(
    tabId,
    { type: ActionType.GET_BADGE, tabId },
    (response: any) => {
      sendTabMessage(tabId, { type: ActionType.INIT_SHORT_CUT_KEY });
    }
  );
});

// createOffscreen 废弃，使用 AudioCreater.create

async function getPreferredAudioMode(): Promise<'stream' | 'element'> {
  try {
    const res = await browser.storage.sync.get('generalConfig');
    const arr = (res as any)?.generalConfig as any[] | undefined;
    const getModeFrom = (list: any[]) => {
      const audioGroup = list?.find((g: any) => g?.key === 'audio');
      const item = audioGroup?.config?.find((c: any) => c?.key === 'audioCaptureType');
      const val = item?.value;
      return val;
    };
    if (Array.isArray(arr)) return getModeFrom(arr);
    const defaults = JSON.parse(JSON.stringify(useGeneralConfig().value));
    return getModeFrom(defaults);
  } catch {
    return 'stream';
  }
}

/**
 * update
 */
chrome.runtime.onMessage.addListener(async (a, b, send) => {
  if (typeof currentTabId !== "number") return;

  const { rollConfig, type, text, tabId, videoId, imgData } = a;

  switch (type) {
    case ActionType.UPDATE_STORAGE:
      sendTabMessage(currentTabId, {
        rollConfig,
        type: ActionType.UPDATE_STORAGE,
        tabId,
      });
      break;
    case ActionType.UPDATE_BADGE:
      setBadge(tabId, text);
      break;
    default:
      break;
  }

  // 监听窗口焦点变化
  // browser.windows.onFocusChanged.addListener(function(windowId) {
  //     if (popupWindowId && windowId !== popupWindowId) {
  //         chrome.windows.update(popupWindowId, { focused: true });
  //     }
  // });

  send("update");
});

// 清理关闭的标签页数据
chrome.tabs.onRemoved.addListener((tabId) => {
  AudioCreater.reset(tabId);
});
